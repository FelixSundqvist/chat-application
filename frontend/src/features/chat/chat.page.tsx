import Page from "@/components/ui/page.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar.tsx";
import { useState } from "react";
import { Message } from "@/features/chat/chat.types.ts";
import ChatMessage from "@/features/chat/components/chat.message.tsx";
import ChatInput from "@/features/chat/components/chat.input.tsx";

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello",
      sentBy: 1,
    },
    {
      id: 2,
      text: "Hi",
      sentBy: 2,
    },
    {
      id: 3,
      text: "How are you?",
      sentBy: 1,
    },
    {
      id: 4,
      text: "Good, you?",
      sentBy: 2,
    },
    {
      id: 5,
      text: "I'm good",
      sentBy: 1,
    },
    {
      id: 6,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      sentBy: 1,
    },
  ]);

  function sendMessage(message: string) {
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: message,
        sentBy: 1,
      },
    ]);
  }

  return (
    <SidebarProvider>
      <Page>
        <Sidebar>
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup>Chats</SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>

        <div className="flex w-full h-full flex-col gap-2 p-2">
          <div className="flex-1 gap-2 flex flex-col p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
          <div className="rounded h-1/4 mb-4">
            <ChatInput sendMessage={sendMessage} />
          </div>
        </div>
      </Page>
    </SidebarProvider>
  );
}

export default ChatPage;
