import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";

function ChatInput({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  function handleSendMessage() {
    if (message.length === 0) return;
    sendMessage(message);
    setMessage("");
  }

  return (
    <div className="relative w-full h-full">
      <textarea
        className="h-full w-full p-2 bg-gray-200 focus:outline-gray-200 rounded-xl"
        placeholder="Send message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      ></textarea>
      <Button
        className="absolute bottom-2 right-2 rounded-xl hover:bg-inherit hover:text-gray-500"
        disabled={message.length === 0}
        onClick={handleSendMessage}
        variant="ghost"
      >
        <SendHorizonal size={24} />
      </Button>
    </div>
  );
}

export default ChatInput;
