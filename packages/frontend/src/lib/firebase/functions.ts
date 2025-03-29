import { auth, functions } from "@/config/firebase.ts";
import { httpsCallable } from "firebase/functions";

type FunctionNames =
  | "createChatRoom"
  | "markMessagesAsSeen"
  | "getRoomUsers"
  | "inviteUserToChatRoom";

export async function callFirebaseFunction<TResponse, TFunctionArgs>(
  functionName: FunctionNames,
  functionArgs: TFunctionArgs,
) {
  await auth.authStateReady();
  const fn = httpsCallable(functions, functionName);
  const result = await fn(functionArgs);
  return result.data as TResponse;
}
