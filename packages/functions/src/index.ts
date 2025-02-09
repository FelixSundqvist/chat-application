import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/https";
import { logger } from "firebase-functions";
import { onCallAuthGuard } from "./utils/auth-guard.js";

admin.initializeApp();

export const fetchUserPrivateRooms = onCall(async (request, response) => {
  logger.info("Fetching user private rooms");

  const userId = await onCallAuthGuard(request);

  const userRoomsRef = admin.database().ref(`userRooms/${userId}`);
  const snapshot = await userRoomsRef.once("value");
  const roomIdRecord: Record<string, boolean> = snapshot.val();
  const roomIds = Object.entries(roomIdRecord)
    .filter(([, value]) => value)
    .map(([key]) => key);

  logger.info("Fetched user private rooms", { roomIds });

  if (!roomIds) {
    return [];
  }

  const privateRoomsRef = admin.database().ref("privateRooms");
  const privateRoomsSnapshot = await privateRoomsRef.once("value");
  // FIXME: any
  const privateRooms = privateRoomsSnapshot.val() as Record<string, any>;

  return Object.entries(privateRooms)
    .filter(([roomId]) => roomIds.includes(roomId))
    .map(([roomId, room]) => ({ ...room, id: roomId }));
});
