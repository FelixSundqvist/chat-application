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
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import { routePaths } from "@/app/routes.ts";
import { signOut } from "@/lib/firebase/auth.tsx";
import type { WithId } from "@/lib/firebase/types.ts";
import type { PrivateRoom, PublicRoom } from "@/features/chat/chat.types.ts";
import { SelectRoom } from "@/features/chat/components/chat.select-room.tsx";

function ChatLayout() {
  const { publicRooms, privateRooms } = useLoaderData<{
    publicRooms: WithId<PublicRoom>[];
    privateRooms: WithId<PrivateRoom>[];
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

export default ChatLayout;
