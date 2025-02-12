import type {
  DocumentData,
  FirestoreError,
  QueryConstraint,
  QuerySnapshot,
} from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "@/config/firebase.ts";
import type { WithId } from "@/lib/firebase/types.ts";
import { useCallback, useEffect, useState } from "react";
import { useLatestValue } from "@/lib/utils.ts";
import Logger from "@/lib/logger.ts";

export function snapshotToArray<T>(
  snapshot: QuerySnapshot<DocumentData, DocumentData>,
) {
  const data: WithId<T>[] = [];

  snapshot.forEach((doc) => {
    data.push({ id: doc.id, ...(doc.data() as T) });
  });

  return data;
}

export function snapshotToIdObject<T>(
  snapshot: QuerySnapshot<DocumentData, DocumentData>,
) {
  const data: Record<string, T> = {};
  snapshot.forEach((doc) => {
    data[doc.id] = doc.data() as T;
  });
  return data;
}

export function createCollection(collectionName: string) {
  return collection(db, collectionName);
}

export function createDoc(docName: string) {
  return doc(db, docName);
}

export async function getCollectionValues<T>(collectionName: string) {
  const docRef = await getDocs(createCollection(collectionName));
  return snapshotToArray<T>(docRef);
}

export async function getDocValues<T>(
  docName: string,
): Promise<WithId<T> | null> {
  const docRef = await getDoc(createDoc(docName));
  if (!docRef.exists()) {
    return null;
  }
  const data = docRef.data();
  return {
    id: docRef.id,
    ...(data as T),
  };
}

export function useSubscribeToFirestoreCollection<TCollectionValue>({
  name,
  queryConstraints = [],
}: {
  name: string;
  queryConstraints?: QueryConstraint[];
}) {
  const [data, setData] = useState<WithId<TCollectionValue>[]>([]);

  const latestQueryConstrains = useLatestValue(queryConstraints);
  const onError = useCallback((error: FirestoreError) => {
    Logger.error("Error fetching data", error);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(createCollection(name), ...latestQueryConstrains.current),
      (snapshot) => {
        setData(snapshotToArray<TCollectionValue>(snapshot));
      },
      (error) => {
        Logger.error("Error fetching data", error);
        onError(error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [name, latestQueryConstrains, onError]);
  return data;
}
