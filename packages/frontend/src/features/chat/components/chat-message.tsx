import { cn } from "@/lib/utils";
import { useFirebaseAuth } from "@/lib/firebase/auth";

import type { ChatMessage as ChatMessageType, WithId } from "@shared/types";

const timeFormatter = new Intl.DateTimeFormat(["en", "fi"], {
  timeStyle: "short",
});

function ChatMessage({ message }: { message: WithId<ChatMessageType> }) {
  const { authUser } = useFirebaseAuth();

  const isSentByMe = message.createdBy === authUser?.uid;

  const createdAt = timeFormatter.format(message.createdAt);

  return (
    <div
      key={message.id}
      className={cn(
        "p-2 rounded-xl max-w-[50%] min-w-[25%] relative m-2 w-fit flex flex-col",
        isSentByMe
          ? "bg-accent rounded-br-none text-gray-100 bg-gradient-to-r from-blue-400 to-blue-500 text-right self-end"
          : "rounded-bl-none bg-gray-200 text-gray-800 text-left",
      )}
    >
      <span
        className={cn(
          "text-xs",
          isSentByMe ? "text-gray-100" : "text-gray-500",
        )}
      >
        {createdAt}
      </span>
      <span>{message.content}</span>
    </div>
  );
}

export default ChatMessage;
