import Page from "@/components/page.tsx";
import { SidebarProvider } from "@/components/sidebar.tsx";
import { Outlet } from "react-router-dom";
import ChatSidebar from "@/features/chat/components/chat.sidebar.tsx";
import { ChatRoomsProvider } from "@/features/chat/context/chat-rooms.context.tsx";

function ChatLayout() {
  return (
    <SidebarProvider>
      <Page>
        <ChatSidebar />
        <Outlet />
      </Page>
    </SidebarProvider>
  );
}

export default function ChatLayoutWithContext() {
  return (
    <ChatRoomsProvider>
      <ChatLayout />
    </ChatRoomsProvider>
  );
}
