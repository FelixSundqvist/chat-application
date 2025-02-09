import "./globals.css";
import { FirebaseAuthProvider } from "@/lib/firebase/auth.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router.tsx";

function App() {
  return (
    <FirebaseAuthProvider>
      <RouterProvider router={router} />
    </FirebaseAuthProvider>
  );
}

export default App;
