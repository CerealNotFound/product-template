import { useAtom } from "jotai";
import { currentConversationIdAtom } from "@/lib/atoms/chat";

export function useChatPipeline() {
  const [currentConversationId, setCurrentConversationId] = useAtom(
    currentConversationIdAtom
  );

  const sendPrompt = async (content: string, modelIds: string[]) => {
    try {
      let conversationId = currentConversationId;

      // Create conversation if it doesn't exist
      if (!conversationId) {
        const createResponse = await fetch("/api/chat/create-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `Multi-Brain Chat - ${new Date().toLocaleString()}`,
          }),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create conversation");
        }

        const createData = await createResponse.json();
        conversationId = createData.conversation_id;
        setCurrentConversationId(conversationId);
      }

      // Send prompt to all models
      const sendResponse = await fetch("/api/chat/send-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          content,
          model_ids: modelIds,
        }),
      });

      if (!sendResponse.ok) {
        throw new Error("Failed to send prompt");
      }

      return await sendResponse.json();
    } catch (error) {
      console.error("Chat pipeline error:", error);
      throw error;
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
  };

  return {
    sendPrompt,
    startNewConversation,
    currentConversationId,
  };
}
