import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";
import ChatInput from "@/features/chat/components/chat.input.tsx";
import useProcessedMessages from "@/features/chat/hooks/use-processed-messages.tsx";
import { useScrollToLatestMessage } from "@/features/chat/hooks/use-scroll-to-latest-message.ts";
import { Messages } from "@/features/chat/components/chat.messages.tsx";
import { useSubscribeToFirestoreCollection } from "@/lib/firebase/firestore.ts";
import type { ChatMessage } from "@/features/chat/chat.types.ts";
import { orderBy } from "firebase/firestore";
import { useChatRooms } from "@/features/chat/chat.context.tsx";
import { routePaths } from "@/app/routes.ts";

const queryConstraints = [orderBy("createdAt", "asc")];

function ChatRoomPage() {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const { currentRoom } = useChatRooms();

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const messages = useSubscribeToFirestoreCollection<ChatMessage>({
    collectionPath: `roomMessages/${roomId}/messages`,
    queryConstraints,
    onError: () => {
      navigate(routePaths.notFound());
    },
  });

  const formattedMessages = useProcessedMessages(messages);

  useScrollToLatestMessage(scrollRef, messages);

  return (
    <div className="flex w-full h-full flex-col gap-2 p-2 overflow-hidden">
      <h1 className="text-2xl">{currentRoom?.name}</h1>
      <div className="flex-1 gap-2 flex flex-col p-2 overflow-y-auto">
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
