import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";

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
        className="h-full w-full p-2 bg-gray-700 focus:outline-gray-400"
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
        className="absolute bottom-2 right-2 rounded-xl"
        disabled={message.length === 0}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </div>
  );
}

export default ChatInput;
