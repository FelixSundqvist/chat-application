import { createBrowserRouter, Navigate } from "react-router-dom";
import { routes } from "@/app/routes.ts";
import SignInPage from "@/features/sign-in/sign-in.page.tsx";
import ChatLayout from "@/features/chat/chat.layout.tsx";
import ChatRoomPage from "@/features/chat/chat-room.page.tsx";
import NotFoundPage from "@/features/error/not-found.page.tsx";
import { auth } from "@/config/firebase.ts";
import RouteErrorBoundary from "@/features/error/components/route-error-boundary.tsx";
import PublicRoute from "@/app/components/public-route.tsx";
import ProtectedRoute from "@/app/components/protected-route.tsx";
import { SelectRoom } from "@/features/chat/components/chat.select-room.tsx";

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    loader: async () => {
      await auth.authStateReady();
    },
    children: [
      {
        element: <PublicRoute />,
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
