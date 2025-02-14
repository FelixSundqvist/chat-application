import { cn } from "@/lib/utils";
import { useFirebaseAuth } from "@/lib/firebase/auth";

import type { ProcessedChatMessage } from "@/features/chat/chat.types.ts";
import { useMemo } from "react";

const timeFormatter = new Intl.DateTimeFormat(["en", "fi"], {
  timeStyle: "short",
});

const getStyles = (isSentByMe: boolean) => {
  if (isSentByMe) {
    return {
      container: "",
      speechBubble:
        "bg-accent rounded-br-none text-gray-100 bg-gradient-to-r from-blue-400 to-blue-500 text-right",
      timeStamp: "text-gray-100",
      name: "text-gray-300",
      initials: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
    };
  }

  return {
    container: "flex-row-reverse",
    speechBubble:
      "rounded-bl-none bg-gray-200 text-gray-800 text-left self-end",
    timeStamp: "text-gray-500",
    name: "text-gray-500",
    initials: "bg-gray-400 text-white",
  };
};

function ChatMessage({ message }: { message: ProcessedChatMessage }) {
  const { authUser } = useFirebaseAuth();
  const { isSentByMe, createdAt, initials } = useMemo(
    () => ({
      isSentByMe: message.createdBy === authUser?.uid,
      createdAt: timeFormatter.format(message.jsDate),
      initials: message.userDisplayName
        .split(" ")
        .map((n) => n[0])
        .join(""),
    }),
    [authUser?.uid, message],
  );
  const styles = getStyles(isSentByMe);
  return (
    <div className={cn("flex gap-1 justify-end", styles.container)}>
      <div
        key={message.id}
        className={cn(
          "p-2 rounded-xl max-w-[50%] min-w-[25%] flex-1 relative m-0.5 mb-5 w-fit flex flex-col gap-1",
          styles.speechBubble,
        )}
      >
        <span className={cn("text-xs", styles.timeStamp)}>{createdAt}</span>
        <span>{message.content}</span>
        <span className={cn("text-xs", styles.name)}>
          {message.userDisplayName}
        </span>
      </div>
      <div
        className={cn(
          "h-[40px] w-[40px] rounded-full bg-blue-200 self-end inline-flex items-center justify-center",
          styles.initials,
        )}
      >
        {initials}
      </div>
    </div>
  );
}

export default ChatMessage;
