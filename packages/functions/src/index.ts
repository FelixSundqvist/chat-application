import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/https";
import { auth, firestore } from "firebase-functions/v1";
import validator from "validator";
import { db } from "./config";
import { onCallAuthGuard } from "./utils/auth-guard.js";
import { createChatRoomAndAddUsers } from "./utils/create-chat-room-and-add-users";
import { sanitize } from "./utils/sanitize";

export const createPrivateChatRoom = onCall<{
  name: string;
  invitedEmails: string[];
}>({ enforceAppCheck: true }, async (request, response) => {
  const userId = await onCallAuthGuard(request);
  const { invitedEmails, name } = request.data;
  const sanitizedName = sanitize(name);

  for (const email of invitedEmails) {
    if (!validator.isEmail(email)) {
      throw new HttpsError("invalid-argument", "Invalid email address.");
    }
  }

  return createChatRoomAndAddUsers({
    name: sanitizedName,
    currentUserId: userId,
    invitedEmails,
  });
});

export const markMessagesAsSeen = onCall<{
  roomId: string;
  messageIds: string[];
}>({ enforceAppCheck: true }, async (request, response) => {
  const userId = await onCallAuthGuard(request);
  const { roomId, messageIds } = request.data;
  const messageRef = db
    .collection("roomMessages")
    .doc(roomId)
    .collection("messages")
    .where("__name__", "in", messageIds);

  const querySnapshot = await messageRef.get();

  const batch = db.batch();

  querySnapshot.docs.forEach((doc) => {
    const createdBy = doc.data().createdBy;
    const seenBy = doc.data()?.seenBy ?? {};
    if (seenBy[userId] || userId === createdBy) return;
    seenBy[userId] = admin.firestore.FieldValue.serverTimestamp();
    batch.update(doc.ref, { seenBy });
  });

  await batch.commit();
});

export const getRoomUsers = onCall<{ roomId: string }>(
  { enforceAppCheck: true },
  async (request) => {
    const userId = await onCallAuthGuard(request);
    const { roomId } = request.data;
    const roomRef = db.collection("rooms").doc(roomId);
    const roomSnapshot = await roomRef.get();
    if (!roomSnapshot.exists) {
      throw new HttpsError("not-found", "Room not found.");
    }
    const userIds: string[] = roomSnapshot.data()?.userIds ?? [];

    if (!userIds.includes(userId)) {
      throw new HttpsError(
        "permission-denied",
        "You are not a member of this room.",
      );
    }

    const userRefs = userIds.map((userId) =>
      db.collection("users").doc(userId),
    );
    const userSnapshots = await Promise.all(userRefs.map((ref) => ref.get()));
    return userSnapshots.map((snapshot) => {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    });
  },
);

export const addUserToFirestore = auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;
  const userRef = db.collection("users").doc(uid);
  await userRef.set({
    email,
    displayName: displayName ?? email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    photoURL,
  });

  const invitedUsersRef = await db
    .collection("invitedUsers")
    .where("email", "==", email)
    .limit(1)
    .get();

  const userRoomsRef = db.collection("userRooms").doc(uid);

  if (invitedUsersRef.empty) {
    return userRoomsRef.set({
      rooms: [],
    });
  }

  const invitedUserData = invitedUsersRef.docs[0].data();
  const uniqueRoomIds = new Set<string>();

  invitedUserData.rooms.forEach((room: { roomId: string }) => {
    uniqueRoomIds.add(room.roomId);
  });

  await invitedUsersRef.docs[0].ref.delete();

  // Add user to room
  for (const roomId of uniqueRoomIds) {
    const roomRef = db.collection("rooms").doc(roomId);
    const room = await roomRef.get();
    if (!room.exists) continue;
    const userIds = room.data()?.userIds ?? [];
    userIds.push(uid);
    await roomRef.update({
      userIds,
    });
  }

  return userRoomsRef.set({
    rooms: Array.from(uniqueRoomIds),
  });
});

export const onMessageCreate = firestore
  .document("roomMessages/{roomId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const { roomId } = context.params;

    if (!snapshot.exists) {
      console.error("Message not found!");
      return;
    }
    const message = snapshot.data();

    const room = db.collection("rooms").doc(roomId);

    const payload = {
      latestMessageRef: snapshot.ref,
      updatedAt: message?.createdAt,
    };

    await room.update(payload);
  });
