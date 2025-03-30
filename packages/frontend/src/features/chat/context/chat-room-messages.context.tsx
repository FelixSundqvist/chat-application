import { routePaths } from "@/app/routes.ts";
import { auth } from "@/config/firebase.ts";
import { arrayToRecord } from "@/lib/array.ts";
import { useSubscribeToFirestoreCollection } from "@/lib/firebase/firestore.ts";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import { orderBy } from "firebase/firestore";
import i18n from "i18next";
import type { PropsWithChildren } from "react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  ChatMessage,
  ChatMessageByDateTuple,
  User,
} from "../chat.types.ts";

const queryConstraints = [orderBy("createdAt", "asc")];

/**
 * A custom hook that provides logic and state for processing and displaying chat room messages.
 *
 * This hook manages the data retrieved from a Firestore collection dedicated to chat room messages.
 * It handles subscribing to the Firestore messages, retrieving user information related to the chat room,
 * and formatting the messages into a structure that can be presented in a grouped and user-friendly format.
 *
 * @function useChatRoomMessagesLogic
 * @returns An object containing methods and properties to manage chat room messages:
 * - rawMessages: Array of raw chat messages as retrieved from Firestore.
 * - displayMessages: Array of formatted messages grouped by date and enriched with user display information.
 * - getUserById: Function to resolve a user by their unique ID and retrieve their display information.
 */
const useChatRoomMessagesLogic = () => {
  const [roomUsers, setRoomUsers] = useState<Record<string, User>>({});
  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const rawMessages = useSubscribeToFirestoreCollection<ChatMessage>({
    collectionPath: `roomMessages/${roomId}/messages`,
    queryConstraints,
    onError: () => {
      navigate(routePaths.notFound());
    },
  });

  useEffect(() => {
    callFirebaseFunction("getRoomUsers", {
      roomId,
    }).then((data) => {
      const record = arrayToRecord(data, "id");
      setRoomUsers(record);
    });
  }, [roomId]);

  const getUserById = useCallback(
    (userId: string) => {
      if (auth.currentUser?.uid === userId) {
        return {
          displayName: i18n.t("Common.you"),
        };
      }
      return (
        roomUsers[userId] ?? {
          displayName: i18n.t("Common.unknownUser"),
        }
      );
    },
    [roomUsers],
  );

  /**
   * Formats a list of chat messages by users and groups them by date.
   * This hook retrieves user information associated with the messages
   * and processes the messages into a structure suitable for display.
   */
  const displayMessages = useMemo(() => {
    const dateMessageTuple: ChatMessageByDateTuple[] = [];

    rawMessages.forEach((message) => {
      const jsDate = message.createdAt?.toDate() ?? new Date();
      const dateKey = jsDate.toLocaleDateString();
      const lastMessage = dateMessageTuple.at(-1);
      const user = getUserById(message.createdBy);

      const formattedMessage = {
        ...message,
        jsDate,
        userDisplayName: user?.displayName ?? i18n.t("Common.unknownUser"),
      };

      const isNewDateKey = !lastMessage || lastMessage?.[0] !== dateKey;

      if (isNewDateKey) {
        dateMessageTuple.push([dateKey, [formattedMessage]]);
      } else {
        lastMessage[1].push(formattedMessage);
      }
    });

    return dateMessageTuple;
  }, [getUserById, rawMessages]);

  return {
    rawMessages,
    displayMessages,
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
