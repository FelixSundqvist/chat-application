import * as admin from "firebase-admin";
import { auth } from "firebase-functions/v1";
import { db } from "../config";

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
