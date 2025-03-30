import ChatInput from "@/features/chat/components/chat.input.tsx";
import { ChatMessages } from "@/features/chat/components/chat.messages.tsx";
import {
  ChatRoomMessagesProvider,
  useChatRoomMessages,
} from "@/features/chat/context/chat-room-messages.context";
import { useScrollToLatestMessage } from "@/features/chat/hooks/use-scroll-to-latest-message.ts";
import { useSeenMessagesObserver } from "@/features/chat/hooks/use-seen-message-observer.ts";
import { useRef } from "react";
import { useParams } from "react-router-dom";

function ChatRoomPage() {
  const { roomId = "" } = useParams<{ roomId: string }>();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { rawMessages } = useChatRoomMessages();

  useScrollToLatestMessage(scrollRef, rawMessages);
  useSeenMessagesObserver(roomId, rawMessages);

  return (
    <div className="flex w-full h-full flex-col overflow-hidden">
      <div className="flex-1 gap-2 flex flex-col p-2 pt-4 overflow-y-auto">
        <ChatMessages />
        <div ref={scrollRef} />
      </div>
      <div>
        <ChatInput />
      </div>
    </div>
  );
}

export default function ChatRoomPageWithContext() {
  return (
    <ChatRoomMessagesProvider>
      <ChatRoomPage />
    </ChatRoomMessagesProvider>
  );
}
