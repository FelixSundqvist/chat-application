import { auth } from "@/config/firebase.ts";
import {
  createCollection,
  getCollectionValues,
  getDocValues,
  snapshotToArray,
} from "@/lib/firebase/firestore.ts";
import type { PrivateRoom, UserRooms } from "@/features/chat/chat.types.ts";
import { getDocs, query, where } from "firebase/firestore";

export const getUserRooms = async () => {
  await auth.authStateReady();
  const publicRooms = await getCollectionValues("publicRooms");
  const userRooms = await getDocValues<UserRooms>(
    `userRooms/${auth.currentUser?.uid}`,
  );
  const rooms = userRooms?.rooms ?? [];

  let privateRooms: PrivateRoom[] = [];

  if (rooms.length > 0) {
    const privateRoomsRef = await getDocs(
      query(createCollection("privateRooms"), where("__name__", "in", rooms)),
    );
    privateRooms = snapshotToArray<PrivateRoom>(privateRoomsRef);
  }
  return {
    publicRooms,
    privateRooms,
  };
};
