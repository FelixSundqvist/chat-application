import { Button } from "@/components/button.tsx";
import { auth, db } from "@/config/firebase";
import { cn } from "@/lib/style.ts";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Loader, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useChatRooms } from "../context/chat-rooms.context";

function ChatInput() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { roomId } = useChatRooms();

  async function handleSendMessage() {
    if (message.length === 0 || isSending || roomId == null || roomId === "") {
      return;
    }
    setIsSending(true);

    try {
      const messageRef = doc(
        collection(db, "roomMessages", roomId, "messages"),
      );
      await setDoc(messageRef, {
        content: message,
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        seenBy: {},
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setMessage("");
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSendMessage();
      }}
    >
      <div className="relative w-full h-full px-2">
        <label htmlFor="message" className="sr-only">
          Send message
        </label>
        <textarea
          id="message"
          aria-label={"Send message"}
          disabled={isSending}
          className={cn(
            "h-full w-full p-2 bg-gray-200 focus:outline-gray-200 rounded-xl dark:bg-gray-600 dark:focus:outline-gray-800 dark:text-gray-200 opacity-80",
            isSending && "dark:bg-gray-500 opacity-20",
          )}
          placeholder="Send message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSendMessage();
            }
          }}
        />
        <Button
          type={"submit"}
          className="
          translate-y-1/2
          absolute z-50
          bottom-[50%]
          right-2
          rounded-xl
          hover:text-gray-300
          text-gray-100
          cursor-pointer"
          disabled={message.length === 0 || isSending}
          variant="ghost"
        >
          {isSending ? <Loader size={24} /> : <SendHorizonal size={24} />}
        </Button>
      </div>
    </form>
  );
}

export default ChatInput;
