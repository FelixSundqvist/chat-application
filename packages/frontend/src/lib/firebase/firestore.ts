import type {
  DocumentData,
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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

interface UseSubscribeToFirestoreArgs<
  TCollectionValue,
  TTransformedValue = TCollectionValue,
> {
  collectionPath: string;
  queryConstraints?: QueryConstraint[];
  disabled?: boolean;
  onError?: (error: Error) => void;
  valueTransformer?: (
    values: WithId<TCollectionValue>[],
  ) => WithId<TTransformedValue>[];
}

function useSubscribeToFirestoreCollection<TCollectionValue, TTransformedValue>(
  args: UseSubscribeToFirestoreArgs<TCollectionValue, TTransformedValue> & {
    valueTransformer: (
      values: WithId<TCollectionValue>[],
    ) => WithId<TTransformedValue>[];
  },
): WithId<TTransformedValue>[];
function useSubscribeToFirestoreCollection<TCollectionValue>(
  args: UseSubscribeToFirestoreArgs<TCollectionValue> & {
    valueTransformer?: undefined;
  },
): WithId<TCollectionValue>[];
function useSubscribeToFirestoreCollection<
  TCollectionValue,
  TTransformedValue = TCollectionValue,
>({
  collectionPath,
  queryConstraints,
  disabled,
  onError,
  valueTransformer,
}: UseSubscribeToFirestoreArgs<TCollectionValue, TTransformedValue>) {
  const [data, setData] = useState<
    (TTransformedValue | WithId<TCollectionValue>)[]
  >([]);

  const valueTransformerRef = useRef(valueTransformer);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const constraints = queryConstraints ?? [];

    const unsubscribe = onSnapshot(
      query(createCollection(collectionPath), ...constraints),
      (snapshot) => {
        const values = snapshotToArray<TCollectionValue>(snapshot);

        if (valueTransformerRef.current) {
          const transformed = valueTransformerRef.current(values);
          setData(transformed);
          return;
        }

        setData(values);
      },
      (error) => {
        onErrorRef.current?.(error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [collectionPath, disabled, onErrorRef, queryConstraints]);

  return data;
}

export { useSubscribeToFirestoreCollection };

export function useSubscribeToFirestoreDoc<TDocValue>({
  docPath,
}: {
  docPath: string;
}) {
  const [data, setData] = useState<TDocValue | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, docPath), // Create the Firestore document reference
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setData({ id: docSnapshot.id, ...(docSnapshot.data() as TDocValue) });
        } else {
          setData(null);
        }
      },
      (error) => {
        toast.error("Error fetching document - \n\n" + error.message);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [docPath]);

  return data;
}
