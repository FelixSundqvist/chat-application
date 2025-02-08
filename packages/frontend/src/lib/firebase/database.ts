import { DataSnapshot, get, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "@/config/firebase.ts";

export function snapshotToArray<T extends { id: string }>(
  snapshot: DataSnapshot,
): T[] {
  if (!snapshot.exists()) {
    return [];
  }
  return Object.entries(snapshot.val()).map(([id, otherValues]) => ({
    ...(otherValues as T),
    id,
  }));
}

/**
 * Custom hook to fetch and subscribe to values from a Firebase Realtime Database path.
 *
 * @template T - The type of the values being fetched. Must extend an object with an `id` property.
 * @param {string} path - The path in the Firebase Realtime Database to fetch values from.
 * @returns {T[]} - An array of values fetched from the specified database path.
 *
 * @example
 * // Usage example:
 * const rooms = useFirebaseDatabaseValues<PublicRoom>("publicRooms");
 */
export function useFirebaseDatabaseValues<T extends { id: string }>(
  path: string,
): T[] {
  const [values, setValues] = useState<T[]>([]);

  useEffect(() => {
    const reference = ref(database, path);
    get(reference).then((snapshot) => {
      setValues(snapshotToArray<T>(snapshot));
    });
  }, [path]);

  return values;
}
