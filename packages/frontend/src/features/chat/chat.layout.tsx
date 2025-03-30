import { Button } from "@/components/button.tsx";
import Page from "@/components/page.tsx";
import { SidebarProvider, useSidebar } from "@/components/sidebar.tsx";
import InviteUserDialog from "@/features/chat/components/chat.invite-user.dialog.tsx";
import ChatSidebar from "@/features/chat/components/chat.sidebar.tsx";
import {
  ChatRoomsProvider,
  useChatRooms,
} from "@/features/chat/context/chat-rooms.context.tsx";
import { MenuIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

function ChatLayout() {
  const { toggleSidebar } = useSidebar();
  const { currentRoom } = useChatRooms();

  return (
    <Page>
      <ChatSidebar />
      <div className="flex flex-col h-full w-full">
        <div className="w-full border-b-gray-200 flex items-center gap-1 border-b-2 p-1 h-12">
          <Button
            variant="ghost"
            className="
            text-gray-100
            dark:hover:text-gray-300 border-1 h-[25px] w-[25px]"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
          <h1 className="text-2xl dark:text-gray-200 flex-1">
            {currentRoom?.name}
          </h1>
          <InviteUserDialog />
        </div>
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </Page>
  );
}

export default function ChatLayoutWithContext() {
  return (
    <ChatRoomsProvider>
      <SidebarProvider>
        <ChatLayout />
      </SidebarProvider>
    </ChatRoomsProvider>
  );
}
