import { cn } from "@/lib/style";
import { useFirebaseAuth } from "@/lib/firebase/auth";

import type { ProcessedChatMessage } from "@/features/chat/chat.types.ts";
import { useMemo } from "react";

const timeFormatter = new Intl.DateTimeFormat(["en", "fi"], {
  timeStyle: "short",
});

const getStyles = (isSentByMe: boolean) => {
  if (isSentByMe) {
    return {
      container: "flex-row-reverse",
      speechBubble:
        "bg-accent rounded-br-none text-gray-100 bg-gradient-to-r from-blue-400 to-blue-500 text-right self-end",
      timeStamp: "text-gray-100",
      name: "text-gray-300",
    };
  }

  return {
    container: "",
    speechBubble:
      "rounded-bl-none bg-gray-200 text-gray-800 text-left self-start",
    timeStamp: "text-gray-500",
    name: "text-gray-500",
  };
};

function ChatMessage({ message }: { message: ProcessedChatMessage }) {
  const { authUser } = useFirebaseAuth();
  const { isSentByMe, createdAt } = useMemo(
    () => ({
      isSentByMe: message.createdBy === authUser?.uid,
      createdAt: timeFormatter.format(message.jsDate),
    }),
    [authUser?.uid, message],
  );
  const styles = getStyles(isSentByMe);
  return (
    <div
      key={message.id}
      className={cn(
        "p-2 rounded-xl max-w-[50%] min-w-[25%] flex-1 relative m-0.5 mb-5 flex flex-col gap-1",
        styles.speechBubble,
      )}
    >
      <span className={cn("text-xs", styles.timeStamp)}>{createdAt}</span>
      <span>{message.content}</span>
      <span className={cn("text-xs", styles.name)}>
        {isSentByMe ? "You" : message.userDisplayName}
      </span>
    </div>
  );
}

export default ChatMessage;
