export const routes = {
  signIn: "/sign-in",
  chat: "/chat",
  publicChatRoom: "/chat/public/:roomId",
  chatRoom: "/chat/:roomId",
  notFound: "/404",
};

export const routePaths = {
  signIn: () => routes.signIn,
  chat: () => routes.chat,
  publicChatRoom: (roomId: string) =>
    routes.publicChatRoom.replace(":roomId", roomId),
  chatRoom: (roomId: string) => routes.chatRoom.replace(":roomId", roomId),
  notFound: () => routes["notFound"],
};
