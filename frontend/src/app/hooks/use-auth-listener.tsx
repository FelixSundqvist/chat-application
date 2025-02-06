import { useEffect } from "react";
import { setAuthToken } from "@/stores/auth.ts";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.ts";

export function useAuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          console.log(user);
          const token = await user.getIdToken();
          setAuthToken(token);
        } else {
          setAuthToken(null);
        }
      },
      (error) => {
        console.error(error);
      },
    );
    return () => {
      unsubscribe();
    };
  }, []);
}
