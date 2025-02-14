import type { WithId } from "@/lib/firebase/types.ts";
import type { ChatMessage, ChatRoom } from "@/features/chat/chat.types.ts";
import { Link } from "react-router-dom";
import { routePaths } from "@/app/routes.ts";
import { cn } from "@/lib/style.ts";

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

  if (diffMinutes < 30)
    return relativeDateFormatter.format(-diffMinutes, "minute");
  if (diffHours < 24) return relativeDateFormatter.format(-diffHours, "hour");
  if (diffDays < 3) return relativeDateFormatter.format(-diffDays, "day");

  return dateFormatter.format(date);
}

export function ChatRoomLink<TRoom extends WithId<ChatRoom>>({
  isPublic = false,
  room,
  isSelected,
  latestMessage,
}: {
  isPublic?: boolean;
  room: TRoom;
  isSelected: boolean;
  latestMessage?: ChatMessage;
}) {
  return (
    <div
      className={cn(
        "cursor-pointer p-1 my-1",
        isSelected ? "bg-blue-100" : "hover:bg-gray-100  hover:text-blue-500",
      )}
    >
      <Link
        key={room.id}
        to={routePaths.chatRoom(room.id)}
        className={cn("block pl-2 pb-1 font-light relative")}
      >
        <span>{room.name}</span>

        {isPublic && (
          <span className="absolute p-1 top-0 right-0 text-[0.5rem] font-semibold text-blue-500">
            Public
          </span>
        )}
        <span className="block pl-2 py-1 font-light text-sm text-muted-foreground">
          {latestMessage !== undefined && (
            <span>
              {[
                latestMessage.content,
                formatSentAtTime(latestMessage.createdAt.toDate()),
              ].join(" - ")}
            </span>
          )}
        </span>
      </Link>
    </div>
  );
}
