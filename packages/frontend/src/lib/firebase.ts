import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase.ts";
import { setAuthToken } from "@/stores/auth.ts";

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOut() {
  await auth.signOut();
  setAuthToken(null);
}
