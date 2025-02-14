import type { PropsWithChildren } from "react";
import { createContext, use, useEffect, useMemo, useState } from "react";
import {
  useSubscribeToFirestoreCollection,
  useSubscribeToFirestoreDoc,
} from "@/lib/firebase/firestore";
import type { ChatMessage, ChatRoom, UserRooms } from "./chat.types";
import { where } from "firebase/firestore";
import { useFirebaseAuth } from "@/lib/firebase/auth";
import { useParams } from "react-router-dom";
import { getRoomLatestMessages } from "@/features/chat/data/get-room-latest-messages.ts";
import { arrayToRecord } from "@/lib/array.ts";

const useChatRoomsLogic = () => {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const { authUser } = useFirebaseAuth();

  const [latestMessageRecord, setLatestMessageRecord] =
    useState<Record<string, ChatMessage>>();

  const publicRooms = useSubscribeToFirestoreCollection<ChatRoom>({
    collectionPath: `publicRooms/`,
  });

  const userRooms = useSubscribeToFirestoreDoc<UserRooms>({
    docPath: `userRooms/${authUser?.uid}`,
  });

  const privateRooms = useSubscribeToFirestoreCollection<
    ChatRoom,
    ChatRoom & { hello: number }
  >({
    collectionPath: `privateRooms/`,
    queryConstraints: useMemo(
      () => [where("__name__", "in", userRooms?.rooms ?? [])],
      [userRooms?.rooms],
    ),
    disabled: (userRooms?.rooms ?? []).length === 0,
    valueTransformer: (values) => {
      return values.map((v) => ({ ...v, hello: 1 }));
    },
  });

  const currentRoom = useMemo(
    () => [...privateRooms, ...publicRooms].find((r) => r.id === roomId),
    [privateRooms, publicRooms, roomId],
  );

  useEffect(() => {
    getRoomLatestMessages([...privateRooms, ...publicRooms]).then((results) => {
      setLatestMessageRecord(
        arrayToRecord(results, "id", (r) => r.latestMessage),
      );
    });
  }, [privateRooms, publicRooms]);

  return {
    publicRooms,
    privateRooms,
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
