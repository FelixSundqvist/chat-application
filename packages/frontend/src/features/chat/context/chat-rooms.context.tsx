import type { PropsWithChildren } from "react";
import { createContext, use, useEffect, useMemo, useState } from "react";
import {
  useSubscribeToFirestoreCollection,
  useSubscribeToFirestoreDoc,
} from "@/lib/firebase/firestore.ts";
import type {
  ChatMessage,
  ChatRoom,
  PrivateChatRoom,
  PublicChatRoom,
  UserRooms,
} from "../chat.types.ts";
import { where } from "firebase/firestore";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import { useParams } from "react-router-dom";
import { getRoomLatestMessages } from "@/features/chat/data/get-room-latest-messages.ts";
import { arrayToRecord } from "@/lib/array.ts";

const useChatRoomsLogic = () => {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const { authUser } = useFirebaseAuth();

  const [latestMessageRecord, setLatestMessageRecord] =
    useState<Record<string, ChatMessage>>();

  const publicRooms = useSubscribeToFirestoreCollection<
    ChatRoom,
    PublicChatRoom
  >({
    collectionPath: `publicRooms/`,
    valueTransformer: (values) => values.map((v) => ({ ...v, isPublic: true })),
  });

  const userRooms = useSubscribeToFirestoreDoc<UserRooms>({
    docPath: `userRooms/${authUser?.uid}`,
  });

  const privateRooms = useSubscribeToFirestoreCollection<
    ChatRoom,
    PrivateChatRoom
  >({
    collectionPath: `privateRooms/`,
    queryConstraints: useMemo(
      () => [where("__name__", "in", userRooms?.rooms ?? [])],
      [userRooms?.rooms],
    ),
    disabled: (userRooms?.rooms ?? []).length === 0,
    valueTransformer: (values) =>
      values.map((v) => ({ ...v, isPublic: false })),
  });

  const currentRoom = useMemo(
    () => [...privateRooms, ...publicRooms].find((r) => r.id === roomId),
    [privateRooms, publicRooms, roomId],
  );

  const allRooms = useMemo(
    () =>
      [...privateRooms, ...publicRooms].sort(
        (a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis(),
      ),
    [privateRooms, publicRooms],
  );

  useEffect(() => {
    getRoomLatestMessages(allRooms).then((results) => {
      setLatestMessageRecord(
        arrayToRecord(results, "id", (r) => r.latestMessage),
      );
    });
  }, [allRooms]);

  return {
    allRooms,
    currentRoom,
    latestMessageRecord,
  };
};

type ChatRoomsContextType = ReturnType<typeof useChatRoomsLogic>;

const ChatRoomsContext = createContext<ChatRoomsContextType>(null!);

export const ChatRoomsProvider = ({ children }: PropsWithChildren) => {
  const data = useChatRoomsLogic();
  return (
    <ChatRoomsContext.Provider value={data}>
      {children}
    </ChatRoomsContext.Provider>
  );
};

export const useChatRooms = () => {
  return use(ChatRoomsContext)!;
};
