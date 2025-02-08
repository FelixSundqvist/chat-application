import { cn } from "@/lib/utils.ts";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import { Message } from "@/features/chat/chat.types.ts";

function ChatMessage({ message }: { message: Message }) {
  const { authUser } = useFirebaseAuth();

  const isSentByMe = message.userId === authUser?.uid;

  return (
    <div
      key={message.id}
      className={cn(
        "p-2 rounded-xl max-w-[50%]",
        isSentByMe
          ? "bg-accent bg-gray-600 self-end rounded-br-none text-gray-100"
          : "bg-gray-300 rounded-bl-none  text-gray-900",
      )}
    >
      {message.content}
    </div>
  );
}

export default ChatMessage;
