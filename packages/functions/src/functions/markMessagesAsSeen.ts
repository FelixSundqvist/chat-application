import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/https";
import { db } from "../config";
import { onCallAuthGuard } from "../utils/auth-guard";

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