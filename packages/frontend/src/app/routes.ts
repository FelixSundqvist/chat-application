export const routes = {
  signIn: "/sign-in",
  chat: "/chat",
  chatRoom: "/chat/:roomId",
  notFound: "/404",
};

export const routePaths = {
  signIn: () => routes.signIn,
  chat: () => routes.chat,
  chatRoom: (roomId: string) => routes.chatRoom.replace(":roomId", roomId),
  notFound: () => routes["notFound"],
};
