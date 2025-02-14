import type { DocumentReference } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import type { ChatMessage, ChatRoom } from "@/features/chat/chat.types.ts";
import type { WithId } from "@/lib/firebase/types.ts";

type RoomWithLatestMessageRef = WithId<ChatRoom> & {
  latestMessageRef: DocumentReference<ChatMessage>;
};

type RoomWithLatestMessage = {
  id: string;
  latestMessage: ChatMessage;
};

export async function getRoomLatestMessages(rooms: WithId<ChatRoom>[]) {
  const promises = rooms
    .filter(
      (r): r is RoomWithLatestMessageRef => r.latestMessageRef !== undefined,
    )
    .map(async (r) => {
      const doc = await getDoc(r.latestMessageRef);
      return {
        id: r.id,
        latestMessage: doc.data() as ChatMessage,
      };
    });

  const results = await Promise.all(promises);

  return results.filter(
    (result): result is RoomWithLatestMessage => result !== undefined,
  );
}
