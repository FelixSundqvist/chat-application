import type { WithId } from "@/lib/firebase/types.ts";
import type { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  content: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface PublicChatRoom {
  name: string;
}

export interface PrivateChatRoom {
  name: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface UserRooms {
  rooms: string[];
}

export type UiChatMessage = WithId<ChatMessage & { createdAtDate: Date }>;

export type DateMessageTuple = [string, [UiChatMessage]];
