import type { PropsWithChildren } from "react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  ChatMessage,
  ChatMessageByDateTuple,
  User,
} from "../chat.types.ts";
import getUsersByIds from "@/features/chat/data/get-users-by-ids.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscribeToFirestoreCollection } from "@/lib/firebase/firestore.ts";
import { routePaths } from "@/app/routes.ts";
import { orderBy } from "firebase/firestore";
import { auth } from "@/config/firebase.ts";

const queryConstraints = [orderBy("createdAt", "asc")];

const useChatRoomMessagesLogic = () => {
  const [messageUsersRecord, setMessageUsersRecord] = useState<
    Record<string, User>
  >({});

  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const messages = useSubscribeToFirestoreCollection<ChatMessage>({
    collectionPath: `roomMessages/${roomId}/messages`,
    queryConstraints,
    onError: () => {
      navigate(routePaths.notFound());
    },
  });

  useEffect(() => {
    getUsersByIds(messages.map((m) => m.createdBy)).then((results) =>
      setMessageUsersRecord(results),
    );
  }, [messages]);

  const getUserById = useCallback(
    (userId: string) => {
      if (auth.currentUser?.uid === userId) {
        return {
          displayName: "You",
        };
      }
      return messageUsersRecord[userId];
    },
    [messageUsersRecord],
  );

  /**
   * Formats a list of chat messages by users and groups them by date.
   * This hook retrieves user information associated with the messages
   * and processes the messages into a structure suitable for display.
   */
  const uiMessages = useMemo(() => {
    const dateMessageTuple: ChatMessageByDateTuple[] = [];

    messages.forEach((message) => {
      const jsDate = message.createdAt.toDate();
      const dateKey = jsDate.toLocaleDateString();
      const lastMessage = dateMessageTuple.at(-1);
      const user = getUserById(message.createdBy);

      const formattedMessage = {
        ...message,
        jsDate,
        userDisplayName: user?.displayName ?? "Unknown",
      };

      const isNewDateKey = !lastMessage || lastMessage?.[0] !== dateKey;

      if (isNewDateKey) {
        dateMessageTuple.push([dateKey, [formattedMessage]]);
      } else {
        lastMessage[1].push(formattedMessage);
      }
    });

    return dateMessageTuple;
  }, [getUserById, messages]);

  return {
    messageUsersRecord,
    messages,
    uiMessages,
    getUserById,
  };
};

type ChatRoomMessagesContextType = ReturnType<typeof useChatRoomMessagesLogic>;

const ChatRoomMessagesContext = createContext<ChatRoomMessagesContextType>(
  null!,
);

export const ChatRoomMessagesProvider = ({ children }: PropsWithChildren) => {
  const data = useChatRoomMessagesLogic();
  return (
    <ChatRoomMessagesContext.Provider value={data}>
      {children}
    </ChatRoomMessagesContext.Provider>
  );
};

export const useChatRoomMessages = () => {
  return use(ChatRoomMessagesContext)!;
};
