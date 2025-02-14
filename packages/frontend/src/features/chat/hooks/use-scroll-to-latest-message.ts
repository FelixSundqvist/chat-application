import type { RefObject } from "react";
import { useLayoutEffect } from "react";
import { useFirebaseAuth } from "@/lib/firebase/auth.tsx";

import type { ChatMessage } from "@/features/chat/chat.types.ts";
import usePrevious from "@/hooks/use-previous.ts";

/**
 * Scrolls to the bottom of the chat after initial load
 * Or when the user sends a message.
 */
export function useScrollToLatestMessage(
  ref: RefObject<HTMLDivElement | null>,
  messages: ChatMessage[],
) {
  const { authUser } = useFirebaseAuth();

  const previousMessages = usePrevious(messages);

  useLayoutEffect(() => {
    if (messages.length === 0) return;

    if (previousMessages?.length === 0) {
      ref.current!.scrollIntoView({ behavior: "instant" });
      return;
    }

    const isLastMessageByMe = messages.at(-1)?.createdBy === authUser?.uid;

    if (isLastMessageByMe) {
      ref.current!.scrollIntoView({ behavior: "smooth" });
    }
  }, [authUser?.uid, messages, previousMessages, ref]);
}
