import { createBrowserRouter, Navigate } from "react-router-dom";
import PublicRoute from "@/app/components/public-route.tsx";
import { routes } from "@/app/routes.ts";
import SignInPage from "@/features/sign-in/sign-in.page.tsx";
import ProtectedRoute from "@/app/components/protected-route.tsx";
import ChatLayout from "@/features/chat/chat.layout.tsx";
import ChatRoomPage from "@/features/chat/pages/chat-room.page.tsx";
import NotFoundPage from "@/features/error/not-found.page.tsx";
import { getFirebaseDatabaseValues } from "@/lib/firebase/database.ts";
import { auth } from "@/config/firebase.ts";
import { getValuesFromFunction } from "@/lib/firebase/functions.ts";

export const router = createBrowserRouter([
  {
    loader: async () => {
      await auth.authStateReady();
    },
  },
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
        loader: async () => {
          const [publicRooms, privateRooms] = await Promise.all([
            getFirebaseDatabaseValues("publicRooms"),
            getValuesFromFunction("fetchUserPrivateRooms"),
          ]);

          return {
            publicRooms,
            privateRooms,
          };
        },
        element: <ChatLayout />,
        children: [
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
    element: <Navigate to={routes.signIn} />,
  },
]);
