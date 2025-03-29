import { routePaths } from "@/app/routes.ts";
import type { ChatMessage, ChatRoom } from "@/features/chat/chat.types.ts";
import type { WithId } from "@/lib/firebase/types.ts";
import { cn } from "@/lib/style.ts";
import { Link } from "react-router-dom";

const relativeDateFormatter = new Intl.RelativeTimeFormat(["en", "fi"], {
  numeric: "auto",
});

const dateFormatter = new Intl.DateTimeFormat(["en", "fi"], {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

function formatSentAtTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return relativeDateFormatter.format(-diffSeconds, "second");
  }
  if (diffMinutes < 30)
    return relativeDateFormatter.format(-diffMinutes, "minute");
  if (diffHours < 24) return relativeDateFormatter.format(-diffHours, "hour");
  if (diffDays < 3) return relativeDateFormatter.format(-diffDays, "day");

  return dateFormatter.format(date);
}

export function ChatRoomLink<TRoom extends WithId<ChatRoom>>({
  room,
  isSelected,
  latestMessage,
}: {
  room: TRoom;
  isSelected: boolean;
  latestMessage?: ChatMessage;
}) {
  return (
    <div
      className={cn(
        "cursor-pointer p-1 my-1 rounded-xl",
        isSelected ? "bg-blue-700" : "hover:bg-blue-500  hover:text-white",
      )}
    >
      <Link
        key={room.id}
        to={routePaths.chatRoom(room.id)}
        className={cn("block pl-2 pb-1 font-light relative")}
      >
        <span>{room.name}</span>
        {latestMessage !== undefined && (
          <div
            className={cn(
              "block px-1 font-light text-sm flex-wrap text-gray-300",
              isSelected && "text-gray-w00",
            )}
          >
            <>
              <span className="truncate">
                {[
                  latestMessage.content,
                  formatSentAtTime(latestMessage.createdAt.toDate()),
                ].join(" - ")}
              </span>
            </>
          </div>
        )}
      </Link>
    </div>
  );
}
