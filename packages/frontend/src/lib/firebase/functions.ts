import { auth, functions } from "@/config/firebase.ts";
import type { User } from "@/features/chat/chat.types.ts";
import { httpsCallable } from "firebase/functions";

type FunctionNames =
  | "createChatRoom"
  | "markMessagesAsSeen"
  | "getRoomUsers"
  | "inviteUserToChatRoom";

type FunctionInput = {
  createChatRoom: {
    name: string;
    invitedEmails: string[];
  };
  markMessagesAsSeen: {
    roomId: string;
    messageIds: string[];
  };
  getRoomUsers: {
    roomId: string;
  };
  inviteUserToChatRoom: {
    roomId: string;
    email: string;
  };
};

type FunctionResponse = {
  createChatRoom: void;
  markMessagesAsSeen: void;
  getRoomUsers: User[];
  inviteUserToChatRoom: void;
};

export async function callFirebaseFunction<TFunctionName extends FunctionNames>(
  functionName: TFunctionName,
  functionArgs: FunctionInput[TFunctionName],
) {
  await auth.authStateReady();
  const fn = httpsCallable(functions, functionName);
  const result = await fn(functionArgs);
  return result.data as FunctionResponse[TFunctionName];
}
