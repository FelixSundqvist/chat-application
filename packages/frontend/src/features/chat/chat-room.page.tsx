import { useRef } from "react";
import { useParams } from "react-router-dom";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import ChatInput from "@/features/chat/components/chat.input.tsx";
import { useScrollToLatestMessage } from "@/features/chat/hooks/use-scroll-to-latest-message.ts";
import { ChatMessages } from "@/features/chat/components/chat.messages.tsx";
import { useSeenMessagesObserver } from "@/features/chat/hooks/use-seen-message-observer.ts";
import {
  ChatRoomMessagesProvider,
  useChatRoomMessages,
} from "@/features/chat/context/chat-room-users.context.tsx";
import { useChatRooms } from "@/features/chat/context/chat-rooms.context.tsx";

function ChatRoomPage() {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const { currentRoom } = useChatRooms();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages } = useChatRoomMessages();

  useScrollToLatestMessage(scrollRef, messages);
  useSeenMessagesObserver(roomId, messages);

  return (
    <div className="flex w-full h-full flex-col p-2 overflow-hidden">
      <h1 className="text-2xl dark:text-gray-200 border-b-2 border-gray-200 pb-2">
        {currentRoom?.name}
      </h1>
      <div className="flex-1 gap-2 flex flex-col p-2 pt-4 overflow-y-auto">
        <ChatMessages />
        <div ref={scrollRef} />
      </div>
      <div>
        <ChatInput
          sendMessage={(message) =>
            callFirebaseFunction("sendMessage", {
              roomId: roomId,
              content: message,
            })
          }
        />
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
