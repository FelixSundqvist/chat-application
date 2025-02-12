import { useRef } from "react";
import { useParams } from "react-router-dom";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import ChatInput from "@/features/chat/components/chat.input.tsx";
import useProcessedMessages from "@/features/chat/hooks/use-processed-messages.tsx";
import { useScrollToLatestMessage } from "@/features/chat/hooks/use-scroll-to-latest-message.ts";
import { Messages } from "@/features/chat/components/chat.messages.tsx";
import { useSubscribeToFirestoreCollection } from "@/lib/firebase/firestore.ts";
import type { ChatMessage } from "@/features/chat/chat.types.ts";
import { orderBy } from "firebase/firestore";

const queryConstraints = [orderBy("createdAt", "asc")];

function ChatRoomPage() {
  const { roomId = "" } = useParams<{ roomId: string }>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useSubscribeToFirestoreCollection<ChatMessage>({
    collectionPath: `roomMessages/${roomId}/messages`,
    queryConstraints,
  });

  const formattedMessages = useProcessedMessages(messages);

  useScrollToLatestMessage(scrollRef, messages);

  return (
    <div className="flex w-full h-full flex-col gap-2 p-2 overflow-hidden">
      <div className="flex-1 gap-2 flex flex-col p-4 overflow-y-auto">
        <Messages messages={formattedMessages} />
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
