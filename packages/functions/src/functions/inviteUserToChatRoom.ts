import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/https";
import validator from "validator";
import { db } from "../config";
import { onCallAuthGuard } from "../utils/auth-guard";

export const inviteUserToChatRoom = onCall<{
  roomId: string;
  email: string;
}>({ enforceAppCheck: true }, async (request) => {
  const userId = await onCallAuthGuard(request);

  const { roomId, email } = request.data;

  if (!validator.isEmail(email)) {
    throw new HttpsError("invalid-argument", "Invalid email address.");
  }
  const roomRef = db.collection("rooms").doc(roomId);
  const roomDoc = await roomRef.get();

  if (!roomDoc.exists) {
    throw new HttpsError("invalid-argument", "Room not found.");
  }

  const existingInvitedUser = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!existingInvitedUser.empty) {
    const id = existingInvitedUser.docs[0].id;
    const userRoomsCollection = db.collection("userRooms");
    const userRoomsRef = userRoomsCollection.doc(id);

    await userRoomsRef.update({
      rooms: admin.firestore.FieldValue.arrayUnion(roomId),
    });
    await roomDoc.ref.update({
      userIds: admin.firestore.FieldValue.arrayUnion(id),
    });
    return;
  }

  const invitedUserQuerySnapshot = await db
    .collection("invitedUsers")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (invitedUserQuerySnapshot.empty) {
    const newDocRef = db.collection("invitedUsers").doc();
    await newDocRef.set({
      email,
      rooms: [
        {
          roomId,
          invitedBy: userId,
        },
      ],
    });
    return;
  }
  // Create entry in invitedUsers collection
  const invitedUserDocRef = invitedUserQuerySnapshot.docs[0].ref;
  const invitedUserDocSnapshot = await db.doc(invitedUserDocRef.path).get();
  const invitedUserDocData = invitedUserDocSnapshot.data();
  const rooms = invitedUserDocData?.rooms;
  rooms.push({
    roomId,
    invitedBy: userId,
  });
  await invitedUserDocRef.update({
    rooms,
  });
});
