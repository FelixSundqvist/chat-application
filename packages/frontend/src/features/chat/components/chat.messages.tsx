import ChatMessage from "@/features/chat/components/chat.message.tsx";
import { useChatRoomMessages } from "@/features/chat/context/chat-room-users.context.tsx";
import { useTranslation } from "react-i18next";

export function ChatMessages() {
  const { t } = useTranslation("translations", {
    keyPrefix: "Chat",
  });

  const { displayMessages } = useChatRoomMessages();

  if (displayMessages.length === 0) {
    return (
      <h1 className="text-center font-semibold dark:text-gray-100">
        {t("noMessagesYet")}
      </h1>
    );
  }

  return displayMessages.map(([date, messages]) => (
    <div key={date} className="flex flex-col gap-2 w-full">
      <div className="text-center text-gray-500 text-xs">{date}</div>
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
    </div>
  ));
}
