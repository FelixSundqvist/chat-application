import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "@/app/components/public-route.tsx";
import { routes } from "@/app/routes.ts";
import SignInPage from "@/features/sign-in/sign-in.page.tsx";
import ProtectedRoute from "@/app/components/protected-route.tsx";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";
import ChatLayout from "@/features/chat/chat.layout.tsx";
import PublicChatRoomPage from "@/features/chat/pages/public-chat-room.page.tsx";

function Router() {
  const { isAuthenticated, hasAuthLoaded } = useFirebaseAuth();

  if (!hasAuthLoaded) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={routes.signIn} element={<SignInPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<ChatLayout />} path={routes.chat}>
            <Route
              element={<PublicChatRoomPage />}
              path={routes.publicChatRoom}
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? routes.chat : routes.signIn} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
