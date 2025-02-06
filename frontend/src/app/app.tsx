import "./globals.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignInPage from "@/features/sign-in/sign-in.page.tsx";
import { useAuthToken } from "@/stores/auth.ts";
import ChatPage from "@/features/chat/chat.page.tsx";
import ProtectedRoute from "./components/protected-route.tsx";
import PublicRoute from "./components/public-route.tsx";
import { useAuthListener } from "@/app/hooks/use-auth-listener.tsx";
import { routes } from "@/app/routes.ts";

function App() {
  const authToken = useAuthToken();

  useAuthListener();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path={routes.signIn} element={<SignInPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path={routes.chat} element={<ChatPage />} />
        </Route>
        <Route
          path="*"
          element={
            <Navigate to={authToken === null ? routes.signIn : routes.chat} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
