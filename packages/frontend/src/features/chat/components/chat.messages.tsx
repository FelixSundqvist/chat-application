import type { ChatMessageByDateTuple } from "@/features/chat/chat.types.ts";
import ChatMessage from "@/features/chat/components/chat.message.tsx";

export function Messages({ messages }: { messages: ChatMessageByDateTuple[] }) {
  if (messages.length === 0)
    return (
      <h1 className="text-center font-semibold dark:text-gray-100">
        No messages yet.
      </h1>
    );

  return messages.map(([date, messages]) => (
    <div key={date} className="flex flex-col gap-2 w-full">
      <div className="text-center text-gray-500 text-xs">{date}</div>
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
    </div>
  ));
}
