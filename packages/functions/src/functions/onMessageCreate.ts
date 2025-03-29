import { firestore } from "firebase-functions/v1";
import { db } from "../config";

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
