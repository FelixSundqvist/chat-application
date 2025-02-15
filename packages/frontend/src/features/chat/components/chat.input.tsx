import { Button } from "@/components/button.tsx";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/style.ts";
import { toast } from "sonner";

function ChatInput({
  sendMessage,
}: {
  sendMessage: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSendMessage() {
    if (message.length === 0 || isSending) return;
    setIsSending(true);

    try {
      await sendMessage(message);
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
      <div className="relative w-full h-full">
        <label htmlFor="message" className="sr-only">
          Send message
        </label>
        <textarea
          id="message"
          aria-label={"Send message"}
          disabled={isSending}
          className={cn(
            "h-full w-full p-2 bg-gray-200 focus:outline-gray-200 rounded-xl dark:bg-gray-600 dark:focus:outline-gray-800 dark:text-gray-200",
            isSending && "opacity-50",
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
        ></textarea>
        <Button
          type={"submit"}
          className="absolute bottom-2 right-2 rounded-xl hover:bg-inherit hover:text-gray-500"
          disabled={message.length === 0 || isSending}
          variant="ghost"
        >
          <SendHorizonal size={24} />
        </Button>
      </div>
    </form>
  );
}

export default ChatInput;
