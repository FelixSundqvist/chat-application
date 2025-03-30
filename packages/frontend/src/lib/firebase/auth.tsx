import { routes } from "@/app/routes.ts";
import { auth } from "@/config/firebase.ts";
import Logger from "@/lib/logger.ts";
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  type User,
} from "firebase/auth";
import type { PropsWithChildren } from "react";
import { createContext, use, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  authUser: User | null;
  isAuthenticated: boolean;
  hasAuthLoaded: boolean;
};

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function sendEmailLink(email: string) {
  const actionCodeSettings = {
    url: window.location.origin,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
  } catch (error) {
    toast.error((error as Error).message);
  }
}

export function signInWithEmail() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem("emailForSignIn");

    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt("Please provide your email for confirmation");
    }

    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email!, window.location.href)
      .then(() => {
        // Clear email from storage.
        window.localStorage.removeItem("emailForSignIn");
      })
      .catch((error) => {
        toast.error((error as Error).message);
      });
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    redirect(routes.signIn);
  } catch (error) {
    Logger.log(error);
  }
}

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
