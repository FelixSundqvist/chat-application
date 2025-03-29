import { getRoomLatestMessages } from "@/features/chat/data/get-room-latest-messages.ts";
import { arrayToRecord } from "@/lib/array.ts";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import {
  useSubscribeToFirestoreCollection,
  useSubscribeToFirestoreDoc,
} from "@/lib/firebase/firestore.ts";
import { where } from "firebase/firestore";
import type { PropsWithChildren } from "react";
import { createContext, use, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { ChatMessage, ChatRoom, UserRooms } from "../chat.types.ts";

const useChatRoomsLogic = () => {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const { authUser } = useFirebaseAuth();

  const [latestMessageRecord, setLatestMessageRecord] =
    useState<Record<string, ChatMessage>>();

  const userRooms = useSubscribeToFirestoreDoc<UserRooms>({
    docPath: `userRooms/${authUser?.uid}`,
  });

  const rooms = useSubscribeToFirestoreCollection<ChatRoom>({
    collectionPath: `rooms/`,
    queryConstraints: useMemo(
      () => [where("__name__", "in", userRooms?.rooms ?? [])],
      [userRooms?.rooms],
    ),
    disabled: (userRooms?.rooms ?? []).length === 0,
  });

  const currentRoom = useMemo(
    () => rooms.find((r) => r.id === roomId),
    [rooms, roomId],
  );

  useEffect(() => {
    getRoomLatestMessages(rooms).then((results) => {
      setLatestMessageRecord(
        arrayToRecord(results, "id", (r) => r.latestMessage),
      );
    });
  }, [rooms]);

  return {
    roomId,
    rooms,
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
