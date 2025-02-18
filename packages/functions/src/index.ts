import * as admin from "firebase-admin";
import { auth } from "firebase-functions/v1";
import { HttpsError, onCall } from "firebase-functions/https";
import { onCallAuthGuard } from "./utils/auth-guard.js";
import validator from "validator";
import { sanitize } from "./utils/sanitize";
import { createChatRoomAndAddUsers } from "./utils/create-chat-room-and-add-users";
import { db } from "./config";

export const sendMessage = onCall<{
  roomId: string;
  content: string;
}>({ enforceAppCheck: true }, async (request) => {
  const userId = await onCallAuthGuard(request);
  const { roomId, content } = request.data;

  const sanitizedContent = sanitize(content);

  const messageRef = db
    .collection("roomMessages")
    .doc(roomId)
    .collection("messages")
    .doc();

  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  await messageRef.set({
    content: sanitizedContent,
    createdBy: userId,
    createdAt: timestamp,
    seenBy: {},
  });

  const publicRoom = db.collection("publicRooms").doc(roomId);
  const publicRoomSnapshot = await publicRoom.get();

  const payload = {
    latestMessageRef: messageRef,
    updatedAt: timestamp,
  };

  if (publicRoomSnapshot.exists) {
    return publicRoom.update(payload);
  }

  const privateRoom = db.collection("privateRooms").doc(roomId);
  const privateRoomSnapshot = await privateRoom.get();
  if (!privateRoomSnapshot.exists) {
    throw new HttpsError("not-found", "Room not found.");
  }
  return privateRoom.update(payload);
});

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

  return userRoomsRef.set({
    rooms: Array.from(uniqueRoomIds),
  });
});
