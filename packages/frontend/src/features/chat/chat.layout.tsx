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
import { Link, Outlet, useLocation } from "react-router-dom";
import { routePaths } from "@/app/routes.ts";
import { signOut, useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import { SelectRoom } from "@/features/chat/components/chat.select-room.tsx";
import CreateChatRoomDialog from "@/features/chat/components/chat.create-room.dialog.tsx";
import {
  useSubscribeToFirestoreCollection,
  useSubscribeToFirestoreDoc,
} from "@/lib/firebase/firestore";
import type { PrivateRoom, PublicRoom, UserRooms } from "./chat.types";
import { where } from "firebase/firestore";
import { useMemo } from "react";

function ChatLayout() {
  const { authUser } = useFirebaseAuth();
  const location = useLocation();

  const publicRooms = useSubscribeToFirestoreCollection<PublicRoom>({
    collectionPath: `publicRooms/`,
  });

  const userRooms = useSubscribeToFirestoreDoc<UserRooms>({
    docPath: `userRooms/${authUser?.uid}`,
  });

  const privateRooms = useSubscribeToFirestoreCollection<PrivateRoom>({
    collectionPath: `privateRooms/`,
    queryConstraints: useMemo(
      () => [where("__name__", "in", userRooms?.rooms ?? [])],
      [userRooms?.rooms],
    ),
    disabled: (userRooms?.rooms ?? []).length === 0,
  });

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
                  className="p-2 underline inline-flex w-full"
                >
                  {room.name}
                </Link>
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
        {location.pathname === routePaths.chat() ? <SelectRoom /> : <Outlet />}
      </Page>
    </SidebarProvider>
  );
}

export default ChatLayout;
