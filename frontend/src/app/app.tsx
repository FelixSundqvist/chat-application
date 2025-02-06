import "./globals.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "@/features/sign-in/sign-in.page.tsx";
import ChatPage from "@/features/chat/chat.page.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<SignInPage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
