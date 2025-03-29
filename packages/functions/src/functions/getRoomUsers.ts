import { HttpsError, onCall } from "firebase-functions/https";
import { db } from "../config";
import { onCallAuthGuard } from "../utils/auth-guard";

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
