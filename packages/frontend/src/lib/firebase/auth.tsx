import { auth } from "@/config/firebase.ts";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type User,
} from "firebase/auth";
import type { PropsWithChildren } from "react";
import { createContext, use, useEffect, useState } from "react";

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOut() {
  await auth.signOut();
}

type AuthContextType = {
  authUser: User | null;
  isAuthenticated: boolean;
  hasAuthLoaded: boolean;
};

const FirebaseAuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function FirebaseAuthProvider({ children }: PropsWithChildren) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [hasAuthLoaded, setHasAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setHasAuthLoaded(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <FirebaseAuthContext.Provider
      value={{
        authUser,
        isAuthenticated: authUser !== null,
        hasAuthLoaded,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export const useFirebaseAuth = () => use(FirebaseAuthContext)!;
