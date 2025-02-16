import type { WithId } from "@/lib/firebase/types.ts";
import type { ChatMessage } from "@/features/chat/chat.types.ts";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLatestValue } from "@/hooks/use-latest-value.ts";
import { auth } from "@/config/firebase.ts";
import { callFirebaseFunction } from "@/lib/firebase/functions.ts";

/**
 * Observes messages within a chat room and marks them as seen when they become visible within the viewport.
 *
 * @param {string} roomId - The unique identifier of the chat room where messages are being observed.
 * @param {WithId<ChatMessage>[]} messages - The list of chat messages in the room, each identified by a unique ID.
 * @return {void} This function does not return a value.
 */
export function useSeenMessagesObserver(
  roomId: string,
  messages: WithId<ChatMessage>[],
): void {
  const observer = useRef<IntersectionObserver | null>(null);

  const messagesMap = useMemo(
    () =>
      messages.reduce(
        (acc, message) => {
          acc[message.id] = message;
          return acc;
        },
        {} as Record<string, WithId<ChatMessage>>,
      ),
    [messages],
  );

  const latestMessagesMap = useLatestValue(messagesMap);

  const setSeenMessages = useCallback(
    async (messageIds: string[]) => {
      const userId = auth.currentUser!.uid;

      const filteredMessageIds = messageIds.filter(
        (id) =>
          latestMessagesMap.current[id]?.createdBy !== userId &&
          latestMessagesMap.current[id]?.seenBy?.[userId] === undefined,
      );

      if (filteredMessageIds.length === 0) return;

      await callFirebaseFunction("markMessagesAsSeen", {
        roomId,
        messageIds: filteredMessageIds,
      });
    },
    [latestMessagesMap, roomId],
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        const seenIds = new Set<string>();

        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry) => {
            const messageId = entry.target.getAttribute("data-message-id");
            if (!messageId) return;
            seenIds.add(messageId);

            // Only update seen if no other messages has been seen in 500ms

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
              void setSeenMessages(Array.from(seenIds));
              seenIds.clear();
            }, 500);
          });
      });
    }

    // Attach observer to all message elements
    const elements = document.querySelectorAll("[data-message-id]");
    elements.forEach((el) => observer.current?.observe(el));

    return () => {
      elements.forEach((el) => observer.current?.unobserve(el));
    };
  }, [messagesMap, setSeenMessages]);
}
