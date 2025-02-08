import ChatInput from "@/features/chat/components/chat.input.tsx";
import { useParams } from "react-router-dom";
import ChatMessage from "@/features/chat/components/chat.message.tsx";
import { useSubscribeToFirebaseDatabaseValues } from "@/lib/firebase/database.ts";
import { Message } from "@/features/chat/chat.types.ts";

function PublicChatRoomPage() {
  const params = useParams<{ roomId: string }>();
  const chatMessages = useSubscribeToFirebaseDatabaseValues<Message>(
    `messages/${params.roomId!}`,
  );

  return (
    <div className="flex w-full h-full flex-col gap-2 p-2">
      <div className="flex-1 gap-2 flex flex-col p-4">
        {chatMessages.map((message) => (
          <ChatMessage message={message} key={message.id} />
        ))}
      </div>
      <div className="rounded h-1/4 mb-4">
        <ChatInput sendMessage={() => {}} />
      </div>
    </div>
  );
}

export default PublicChatRoomPage;
