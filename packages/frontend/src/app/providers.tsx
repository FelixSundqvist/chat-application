import { FirebaseAuthProvider } from "@/lib/firebase/auth.tsx";
import type { PropsWithChildren } from "react";

function Providers({ children }: PropsWithChildren) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}

export default Providers;
