import { cn } from "@/lib/utils.ts";
import { Message } from "../chat.types.ts";

function ChatMessage({ message }: { message: Message }) {
  const sentByMe = message.sentBy === 1;
  return (
    <div
      key={message.id}
      className={cn(
        "p-2 rounded-xl max-w-[50%]",
        sentByMe
          ? "bg-accent bg-gray-600 self-end rounded-br-none text-gray-100"
          : "bg-gray-300 rounded-bl-none  text-gray-900",
      )}
    >
      {message.text}
    </div>
  );
}

export default ChatMessage;
