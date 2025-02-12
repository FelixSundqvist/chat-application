import { useRef } from "react";
import { useSubscribeToFirestoreCollection } from "@/lib/firebase/firestore.ts";
import { useParams } from "react-router-dom";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import { orderBy } from "firebase/firestore";
import type { ChatMessage as ChatMessageType } from "@/features/chat/chat.types.ts";
import ChatMessage from "@/features/chat/components/chat.message.tsx";
import ChatInput from "@/features/chat/components/chat.input.tsx";
import useProcessedMessages from "@/features/chat/hooks/use-processed-messages.tsx";
import { useScrollToLatestMessage } from "@/features/chat/hooks/use-scroll-to-latest-message.ts";

function ChatRoomPage() {
  const { roomId = "" } = useParams<{ roomId: string }>();

  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useSubscribeToFirestoreCollection<ChatMessageType>({
    name: `roomMessages/${roomId}/messages`,
    queryConstraints: [orderBy("createdAt")],
  });

  const formattedMessages = useProcessedMessages(messages);

  useScrollToLatestMessage(scrollRef, messages);

  return (
    <div className="flex w-full h-full flex-col gap-2 p-2 overflow-hidden">
      <div className="flex-1 gap-2 flex flex-col p-4 overflow-y-auto">
        {formattedMessages.map(([date, messages]) => (
          <div key={date} className="flex flex-col gap-2">
            <div className="text-center text-gray-500 text-xs">{date}</div>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
          </div>
        ))}
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

export default ChatRoomPage;
