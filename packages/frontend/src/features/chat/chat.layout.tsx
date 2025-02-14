import Page from "@/components/page.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/sidebar.tsx";
import { Button } from "@/components/button.tsx";
import { Outlet, useParams } from "react-router-dom";
import { signOut } from "@/lib/firebase/auth.tsx";
import CreateChatRoomDialog from "@/features/chat/components/chat.create-room.dialog.tsx";
import { ChatRoomLink } from "@/features/chat/components/chat.room.link.tsx";
import {
  ChatRoomsProvider,
  useChatRooms,
} from "@/features/chat/chat.context.tsx";

function ChatLayout() {
  const { roomId } = useParams<{ roomId: string }>();

  const { publicRooms, privateRooms, latestMessageRecord } = useChatRooms();

  return (
    <SidebarProvider>
      <Page>
        <Sidebar>
          <SidebarHeader>
            <h1 className={"text-lg font-bold"}>Chats</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {publicRooms?.map((room) => (
                <ChatRoomLink
                  key={room.id}
                  isPublic
                  room={room}
                  isSelected={room.id === roomId}
                  latestMessage={latestMessageRecord?.[room.id]}
                />
              ))}
              {privateRooms?.map((room) => (
                <ChatRoomLink
                  key={room.id}
                  room={room}
                  isSelected={room.id === roomId}
                  latestMessage={latestMessageRecord?.[room.id]}
                />
              ))}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <CreateChatRoomDialog />
            <Button onClick={signOut} variant="outline">
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>
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
