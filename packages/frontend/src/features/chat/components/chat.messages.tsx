import ChatMessage from "@/features/chat/components/chat.message.tsx";
import { useChatRoomMessages } from "@/features/chat/context/chat-room-users.context.tsx";

export function ChatMessages() {
  const { uiMessages } = useChatRoomMessages();

  if (uiMessages.length === 0) {
    return (
      <h1 className="text-center font-semibold dark:text-gray-100">
        No messages yet.
      </h1>
    );
  }

  return uiMessages.map(([date, messages]) => (
    <div key={date} className="flex flex-col gap-2 w-full">
      <div className="text-center text-gray-500 text-xs">{date}</div>
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
    </div>
  ));
}
