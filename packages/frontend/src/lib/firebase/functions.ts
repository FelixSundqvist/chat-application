import { httpsCallable } from "firebase/functions";
import { auth, functions } from "@/config/firebase.ts";

type FunctionNames = "sendMessage" | "createPrivateChatRoom";
export async function callFirebaseFunction<T, TData>(
  functionName: FunctionNames,
  data: TData,
) {
  await auth.authStateReady();
  const fn = httpsCallable(functions, functionName);
  const result = await fn(data);
  return result.data as T;
}
