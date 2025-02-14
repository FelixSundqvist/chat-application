import type { WithId, WithJsDate } from "@/lib/firebase/types.ts";
import type { DocumentReference, Timestamp } from "firebase/firestore";

export interface ChatMessage {
  content: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface ChatRoom {
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  latestMessageRef?: DocumentReference<ChatMessage>;
}

export interface UserRooms {
  rooms: string[];
}

/**
 * Represents a processed chat message with additional metadata.
 *
 * The `ProcessedChatMessage` type enhances a `ChatMessage` by including:
 * - A unique identifier (`WithId`)
 * - A `jsDate` property representing the timestamp of the message as a Date object.
 * - A `userDisplayName` property for the display name of the user who sent the message.
 */
export type ProcessedChatMessage = WithId<
  WithJsDate<ChatMessage & { userDisplayName: string }>
>;

/**
 * Represents a tuple containing a date and an array of processed chat messages.
 *
 * This type is used to group chat messages by their corresponding dates.
 *
 * The first element in the tuple is a string representing the date in a specific format.
 * The second element is an array containing `ProcessedChatMessage` items that belong to the associated date.
 */
export type ChatMessageByDateTuple = [string, [ProcessedChatMessage]];

export interface User {
  displayName: string;
}
