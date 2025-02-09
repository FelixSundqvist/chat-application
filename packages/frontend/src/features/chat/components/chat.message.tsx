import { cn } from "@/lib/utils";
import { useFirebaseAuth } from "@/lib/firebase/auth";

import type { ChatMessage as ChatMessageType, WithId } from "@shared/types";

const timeFormatter = new Intl.DateTimeFormat(["en", "fi"], {
  dateStyle: "short",
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
        "p-2 rounded-xl max-w-[50%] min-w-[25%] relative m-2 w-fit",
        isSentByMe
          ? "bg-accent bg-gray-600 self-end rounded-br-none text-gray-100"
          : "bg-gray-300 rounded-bl-none  text-gray-900",
      )}
    >
      <span
        className={cn(
          "absolute top-0 text-xs -translate-y-full text-gray-300",
          {
            "left-0": !isSentByMe,
            "right-0": isSentByMe,
          },
        )}
      >
        {createdAt}
      </span>
      {message.content}
    </div>
  );
}

export default ChatMessage;
