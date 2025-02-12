import * as admin from "firebase-admin";
import { auth } from "firebase-functions/v1";
import { onCall } from "firebase-functions/https";
import { onCallAuthGuard } from "./utils/auth-guard.js";
import sanitizeHtml from "sanitize-html";

admin.initializeApp();

const db = admin.firestore();

export const sendMessage = onCall<{
  roomId: string;
  content: string;
}>(async (request, response) => {
  const userId = await onCallAuthGuard(request);
  const { roomId, content } = request.data;

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  });

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
  });

  const publicRoom = db.collection("publicRooms").doc(roomId);
  const publicRoomSnapshot = await publicRoom.get();
  if (publicRoomSnapshot.exists) {
    await publicRoom.update({
      lastMessageAt: timestamp,
    });
  } else {
    const privateRoom = db.collection("privateRooms").doc(roomId);
    const privateRoomSnapshot = await privateRoom.get();
    if (privateRoomSnapshot.exists) {
      await privateRoom.update({
        lastMessageAt: timestamp,
      });
    }
  }

  // Send notification
});

export const addUserToFirestore = auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;
  const userRef = db.collection("users").doc(uid);
  await userRef.set({
    email,
    displayName,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    photoURL,
  });
  const userRoomsRef = db.collection("userRooms").doc(uid);
  await userRoomsRef.set({
    rooms: [],
  });
});
