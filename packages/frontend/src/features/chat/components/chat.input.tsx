import { Button } from "@/components/button.tsx";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";

function ChatInput({
  sendMessage,
}: {
  sendMessage: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");

  async function handleSendMessage() {
    if (message.length === 0) return;
    await sendMessage(message);
    setMessage("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSendMessage();
      }}
    >
      <div className="relative w-full h-full">
        <textarea
          aria-label={"Send message"}
          className="h-full w-full p-2 bg-gray-200 focus:outline-gray-200 rounded-xl"
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
          disabled={message.length === 0}
          variant="ghost"
        >
          <SendHorizonal size={24} />
        </Button>
      </div>
    </form>
  );
}

export default ChatInput;
