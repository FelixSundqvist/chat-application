import { Avatar, AvatarFallback } from "@/components/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar.tsx";
import CreateChatRoomDialog from "@/features/chat/components/chat.create-room.dialog.tsx";
import { ChatRoomLink } from "@/features/chat/components/chat.room.link.tsx";
import { useChatRooms } from "@/features/chat/context/chat-rooms.context.tsx";
import { useIsMobile } from "@/hooks/use-mobile.tsx";
import { signOut, useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import Logger from "@/lib/logger.ts";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

function ChatSidebar() {
  const { roomId } = useParams<{ roomId: string }>();
  const { authUser } = useFirebaseAuth();
  const { t } = useTranslation();

  const { rooms, latestMessageRecord } = useChatRooms();

  const [refreshKey, setRefreshKey] = useState(v4());

  useEffect(() => {
    const interval = setInterval(() => {
      Logger.log("Refreshing chat sidebar...");
      setRefreshKey(v4());
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const isMobile = useIsMobile();

  const initials = authUser?.displayName?.split(" ").map((n) => n[0]) || [];

  if (!authUser) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex justify-center gap-2 px-2 pt-[1.2rem]">
        <h1 className={"text-lg font-bold"}>{t("Chat.chats")}</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key={refreshKey}>
          {rooms?.map((room) => (
            <ChatRoomLink
              key={room.id}
              room={room}
              isSelected={room.id === roomId}
              latestMessage={latestMessageRecord?.[room.id]}
            />
          ))}
          <CreateChatRoomDialog />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/*<AvatarImage src={authUser.avatar} alt={authUser.displayName} />*/}
                    <AvatarFallback className="rounded-full bg-blue-500 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {authUser.displayName}
                    </span>
                    <span className="truncate text-xs">{authUser.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-full bg-blue-500 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {authUser.displayName}
                      </span>
                      <span className="truncate text-xs">{authUser.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut />
                  {t("Common.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default ChatSidebar;
