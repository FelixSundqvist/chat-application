import { HttpsError } from "firebase-functions/https";
import { db } from "../config";

export async function validateIsUserInRoom(userId: string, roomId: string) {
  const userRoomsCollection = db.collection("userRooms");

  const currentUser = await userRoomsCollection.doc(userId).get();
  const isCurrentUserInRoom = (currentUser.data()?.rooms ?? []).includes(
    roomId,
  );

  if (!isCurrentUserInRoom) {
    throw new HttpsError(
      "permission-denied",
      "You are not a member of this room.",
    );
  }

  const roomRef = await db.collection("rooms").doc(roomId).get();

  const userIds: string[] = roomRef.data()?.userIds ?? [];

  if (!roomRef.exists) {
    throw new HttpsError("permission-denied", "Room does not exist.");
  }

  if (!userIds.includes(userId)) {
    throw new HttpsError(
      "permission-denied",
      "You are not a member of this room.",
    );
  }
}
