import ChatInput from "@/features/chat/components/chat-input.tsx";

import { useNavigate, useParams } from "react-router-dom";
import ChatMessage from "@/features/chat/components/chat-message.tsx";
import {
  useSubscribeToFirebaseDatabaseValues,
  writeToFirebaseDatabase,
} from "@/lib/firebase/database.ts";

import type { ChatMessage as ChatMessageType } from "@shared/types";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import Logger from "@/lib/logger.ts";
import { routePaths } from "@/app/routes.ts";
import { useLayoutEffect, useRef } from "react";
import usePrevious from "@/lib/utils.ts";

function ChatRoomPage() {
  const { authUser } = useFirebaseAuth();
  const params = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMessages = useSubscribeToFirebaseDatabaseValues<ChatMessageType>({
    path: `messages/${params.roomId!}`,
    sortFn: (a, b) => a.createdAt - b.createdAt,
    onError: (e) => {
      Logger.error(e);
      navigate(routePaths.notFound());
    },
  });

  async function sendMessage(content: string) {
    await writeToFirebaseDatabase<ChatMessageType>(
      `messages/${params.roomId!}`,
      {
        content,
        createdBy: authUser!.uid,
        createdAt: Date.now(),
      },
      true,
    );
  }

  const previousMessages = usePrevious(chatMessages);

  useLayoutEffect(() => {
    if (previousMessages?.length === 0) {
      scrollRef.current!.scrollIntoView({ behavior: "instant" });
    }
    const lastMessage = chatMessages.at(-1);

    const isLastMessageByMe = lastMessage?.createdBy === authUser?.uid;

    if (isLastMessageByMe) {
      scrollRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  }, [authUser?.uid, chatMessages, previousMessages]);

  return (
    <div className="flex w-full h-full flex-col gap-2 p-2 overflow-hidden">
      <div className="flex-1 gap-2 flex flex-col p-4 overflow-y-auto">
        {chatMessages.map((message) => (
          <ChatMessage message={message} key={message.id} />
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="mb-4">
        <ChatInput sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default ChatRoomPage;
