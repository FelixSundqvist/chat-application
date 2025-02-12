import type { WithId } from "@/lib/firebase/types.ts";
import type {
  ChatMessage,
  DateMessageTuple,
} from "@/features/chat/chat.types.ts";

export function groupMessagesByDate(messages: WithId<ChatMessage>[]) {
  const dateMessageTuple: DateMessageTuple[] = [];

  messages.forEach((message) => {
    const jsDate = message.createdAt.toDate();
    const dateKey = jsDate.toLocaleDateString();
    const lastMessage = dateMessageTuple.at(-1);

    const formattedMessage = {
      ...message,
      createdAtDate: jsDate,
    };

    if (!lastMessage || lastMessage?.[0] !== dateKey) {
      dateMessageTuple.push([dateKey, [formattedMessage]]);
    } else {
      lastMessage[1].push(formattedMessage);
    }
  });

  return dateMessageTuple;
}
