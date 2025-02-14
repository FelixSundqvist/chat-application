import { getDocs, query, where } from "firebase/firestore";
import {
  createCollection,
  snapshotToIdObject,
} from "@/lib/firebase/firestore.ts";
import type { User } from "@/features/chat/chat.types.ts";
import { uniqueArray } from "@/lib/array.ts";

async function getUsersByIds(userIds: string[]): Promise<Record<string, User>> {
  const uniqueIds = uniqueArray(userIds);

  if (uniqueIds.length === 0) return {};

  const q = query(
    createCollection("users"),
    where("__name__", "in", uniqueIds),
  );
  const docs = await getDocs(q);
  return snapshotToIdObject<User>(docs);
}

export default getUsersByIds;
