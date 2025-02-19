import { createBrowserRouter, Navigate } from "react-router-dom";
import { routes } from "@/app/routes.ts";
import { auth } from "@/config/firebase.ts";
import { signInWithEmail } from "@/lib/firebase/auth.tsx";
import { lazy } from "react";

const SignInPage = lazy(
  async () => await import("@/features/sign-in/sign-in.page.tsx"),
);
const NotFoundPage = lazy(
  async () => await import("@/features/error/not-found.page.tsx"),
);
const RouteErrorBoundary = lazy(
  async () =>
    await import("@/features/error/components/route-error-boundary.tsx"),
);
const PublicRoute = lazy(
  async () => await import("@/app/components/public-route.tsx"),
);
const ProtectedRoute = lazy(
  async () => await import("@/app/components/protected-route.tsx"),
);
const SelectRoom = lazy(
  async () => await import("@/features/chat/components/chat.select-room.tsx"),
);
const ChatLayout = lazy(
  async () => await import("@/features/chat/chat.layout.tsx"),
);
const ChatRoomPage = lazy(
  async () => await import("@/features/chat/chat-room.page.tsx"),
);

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    loader: async () => {
      await auth.authStateReady();
    },
    children: [
      {
        element: <PublicRoute />,
        loader: async () => signInWithEmail(),
        children: [
          {
            path: routes.signIn,
            element: <SignInPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: routes.chat,
            element: <ChatLayout />,
            children: [
              {
                index: true,
                element: <SelectRoom />,
              },
              {
                path: routes.chatRoom,
                element: <ChatRoomPage />,
              },
            ],
          },
        ],
      },
      {
        path: routes.notFound,
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to={routes.notFound} />,
      },
    ],
  },
]);
