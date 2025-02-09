import type { DataSnapshot } from "firebase/database";
import { get, off, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "@/config/firebase.ts";
import type { WithId } from "@/lib/firebase/types.ts";
import { v4 } from "uuid";

function snapshotToArray<T>(snapshot: DataSnapshot): WithId<T>[] {
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
 * @template T - The type of the values being fetched.
 * @param {string} path - The path in the Firebase Realtime Database to fetch values from.
 * @returns {WithId<T>[]} - An array of values with their IDs.
 *
 * @example
 * // Usage example:
 * const rooms = useFirebaseDatabaseValues<PublicRoom>("publicRooms");
 */
export function useFirebaseDatabaseValues<T>(path: string): WithId<T>[] {
  const [values, setValues] = useState<WithId<T>[]>([]);

  useEffect(() => {
    const reference = ref(database, path);
    get(reference).then((snapshot) => {
      setValues(snapshotToArray<T>(snapshot));
    });
  }, [path]);

  return values;
}

/**
 * Custom hook to fetch and subscribe to values from a Firebase Realtime Database path.
 *
 * @template T - The type of the values being fetched.
 * @returns {WithId<T>[]} - An array of values with their IDs.
 *
 * @example
 * // Usage example:
 * const rooms = useSubscribeToFirebaseDatabaseValues<ChatRoom>("publicRooms");
 */
export function useSubscribeToFirebaseDatabaseValues<T>(params: {
  path: string;
  sortFn?: (a: WithId<T>, b: WithId<T>) => number;
  onError?: (error: Error) => void;
}): WithId<T>[] {
  const [values, setValues] = useState<WithId<T>[]>([]);

  useEffect(() => {
    const { path, sortFn, onError } = params;
    const callback = (snapshot: DataSnapshot) => {
      const snapshotArray = snapshotToArray<T>(snapshot);
      if (sortFn) {
        snapshotArray.sort(sortFn);
      }
      setValues(snapshotArray);
    };

    const reference = ref(database, path);
    onValue(reference, callback, (error) => {
      console.error("Error fetching data: ", error);
      onError?.(error);
    });

    return () => {
      off(reference, "value", callback);
    };
  }, [params]);

  return values;
}

/**
 * Writes data to a specified path in the Firebase Realtime Database.
 *
 * @template T - The type of the data being written.
 * @param {string} path - The path in the Firebase Realtime Database where the data should be written.
 * @param {T} data - The data to write to the specified path.
 * @param insert - Whether to insert a new item or update an existing one.
 * @returns {Promise<void>} - A promise that resolves when the data has been written.
 *
 * @example
 * // Usage example:
 * writeToFirebaseDatabase("users/user1", { name: "John Doe", age: 30 });
 */
export async function writeToFirebaseDatabase<T>(
  path: string,
  data: T,
  insert?: boolean,
) {
  let fullPath = path;
  if (insert) {
    fullPath = `${path}/${v4()}`;
  }
  try {
    console.log("Writing document to: ", fullPath, data);

    await set(ref(database, fullPath), data);
  } catch (error) {
    console.error("Error writing document: ", error);
  }
}
