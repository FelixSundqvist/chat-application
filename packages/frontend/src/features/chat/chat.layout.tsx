import Page from "@/components/ui/page.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import { routePaths } from "@/app/routes.ts";
import { signOut } from "@/lib/firebase/auth.tsx";
import type { WithId } from "@/lib/firebase/types.ts";
import type {
  PrivateChatRoom,
  PublicChatRoom,
} from "@/features/chat/chat.types.ts";

function ChatLayout() {
  const { publicRooms, privateRooms } = useLoaderData<{
    publicRooms: WithId<PublicChatRoom>[];
    privateRooms: WithId<PrivateChatRoom>[];
  }>();

  const location = useLocation();

  return (
    <SidebarProvider>
      <Page>
        <Sidebar>
          <SidebarHeader>
            <h1 className={"text-lg font-bold"}>Chats</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <h2 className={"text-lg"}>Public rooms</h2>
              {publicRooms?.map((room) => (
                <Link
                  key={room.id}
                  to={routePaths.chatRoom(room.id)}
                  className="block p-2 underline"
                >
                  {room.name}
                </Link>
              ))}
            </SidebarGroup>
            <SidebarGroup>
              <h2 className={"text-lg"}>Private rooms</h2>
              {privateRooms?.map((room) => (
                <Link
                  key={room.id}
                  to={routePaths.chatRoom(room.id)}
                  className="block p-2 underline"
                >
                  {room.name}
                </Link>
              ))}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Button onClick={signOut} variant="ghost">
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>
        {location.pathname === routePaths.chat() ? <SelectRoom /> : <Outlet />}
      </Page>
    </SidebarProvider>
  );
}

function SelectRoom() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Welcome to the chat app!</h1>
      <p>Select a room to start chatting.</p>
    </div>
  );
}

export default ChatLayout;
