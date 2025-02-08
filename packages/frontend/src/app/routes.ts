export const routes = {
  signIn: "/sign-in",
  chat: "/",
  chatRoom: "/chat/:roomId",
};

export const routeLinks = {
  signIn: () => routes.signIn,
  chat: () => routes.chat,
  chatRoom: (roomId: string) => `/chat/${roomId}`,
};
