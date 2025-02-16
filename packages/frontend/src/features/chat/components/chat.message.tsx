import { cn } from "@/lib/style";
import { useFirebaseAuth } from "@/lib/firebase/auth";

import type { ProcessedChatMessage } from "@/features/chat/chat.types.ts";
import { memo, useMemo } from "react";
import { EyeIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip.tsx";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useChatRoomMessages } from "@/features/chat/context/chat-room-users.context.tsx";

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
      nameAndSeenBy: "flex-row-reverse",
    };
  }

  return {
    container: "",
    speechBubble:
      "rounded-bl-none bg-gray-200 text-gray-800 text-left self-start",
    timeStamp: "text-gray-500",
    name: "text-gray-500",
    nameAndSeenBy: "",
  };
};

function ChatMessage({ message }: { message: ProcessedChatMessage }) {
  const { authUser } = useFirebaseAuth();
  const { getUserById } = useChatRoomMessages();

  const { isSentByMe, createdAt, seenByArray } = useMemo(() => {
    return {
      isSentByMe: message.createdBy === authUser?.uid,
      createdAt: timeFormatter.format(message.jsDate),
      seenByArray: Object.entries(message.seenBy ?? []).map(
        ([userId, timeStamp]) => ({
          id: [message.id, userId, timeStamp.toMillis()].join("-"),
          displayName: getUserById(userId)?.displayName ?? "Unknown",
          seenAt: timeStamp.toDate().toLocaleString(["en", "fi"], {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
      ),
    };
  }, [authUser?.uid, getUserById, message]);

  const styles = getStyles(isSentByMe);

  return (
    <div
      key={message.id}
      data-message-id={message.id}
      className={cn(
        "p-2 rounded-xl max-w-[50%] min-w-[30%] flex-1 relative m-0.5 mb-5 flex flex-col gap-1",
        styles.speechBubble,
      )}
    >
      <span className={cn("text-xs", styles.timeStamp)}>{createdAt}</span>
      <span>{message.content}</span>
      <div className={cn("flex items-center gap-1", styles.nameAndSeenBy)}>
        <span className={cn("text-xs flex-1", styles.name)}>
          {isSentByMe ? "You" : message.userDisplayName}
        </span>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              {seenByArray.length > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold">
                  {seenByArray.length}
                  <EyeIcon size={16} />
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent className="inline-flex flex-col gap-1 items-start ">
              {seenByArray.map((seenBy) => (
                <div className="inline-flex gap-1" key={seenBy.id}>
                  <span className="flex-1">{seenBy.displayName}</span>
                  <span>- {seenBy.seenAt}</span>
                </div>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default memo(ChatMessage);
