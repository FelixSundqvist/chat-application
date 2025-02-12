import type { WithId } from "@/lib/firebase/types.ts";
import type {
  ChatMessage,
  ChatMessageByDateTuple,
  User,
} from "@/features/chat/chat.types.ts";
import getUsersByIds from "@/features/chat/data/get-users-by-ids.ts";
import { useEffect, useMemo, useState } from "react";

/**
 * Formats a list of chat messages by users and groups them by date.
 * This hook retrieves user information associated with the messages
 * and processes the messages into a structure suitable for display.
 *
 * @param {WithId<ChatMessage>[]} messages Array of chat messages with their unique IDs.
 * @return {ChatMessageByDateTuple[]} An array of tuples, where each tuple contains a date string
 * and an array of formatted messages for that date. Each message includes additional user
 * and formatting details.
 */
function useProcessedMessages(
  messages: WithId<ChatMessage>[],
): ChatMessageByDateTuple[] {
  const [userRecord, setUserRecord] = useState<Record<string, User>>({});

  useEffect(() => {
    getUsersByIds(messages.map((m) => m.createdBy)).then((results) =>
      setUserRecord(results),
    );
  }, [messages]);

  return useMemo(() => {
    const dateMessageTuple: ChatMessageByDateTuple[] = [];

    messages.forEach((message) => {
      const jsDate = message.createdAt.toDate();
      const dateKey = jsDate.toLocaleDateString();
      const lastMessage = dateMessageTuple.at(-1);
      const user = userRecord[message.createdBy];

      const formattedMessage = {
        ...message,
        jsDate,
        userDisplayName: user?.displayName ?? "Unknown",
      };

      if (!lastMessage || lastMessage?.[0] !== dateKey) {
        dateMessageTuple.push([dateKey, [formattedMessage]]);
      } else {
        lastMessage[1].push(formattedMessage);
      }
    });

    return dateMessageTuple;
  }, [messages, userRecord]);
}

export type FormattedMessage = ReturnType<
  typeof useProcessedMessages
>[number][1][0];

export default useProcessedMessages;
