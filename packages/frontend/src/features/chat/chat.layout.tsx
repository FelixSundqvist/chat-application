import Page from "@/components/page.tsx";
import { SidebarProvider } from "@/components/sidebar.tsx";
import { Outlet } from "react-router-dom";
import { ChatRoomsProvider } from "@/features/chat/chat.context.tsx";
import ChatSidebar from "@/features/chat/components/chat.sidebar.tsx";

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
