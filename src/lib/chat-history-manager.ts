import { getDefaultStore } from "jotai";
import {
  modelChatHistoriesAtom,
  cleanupUnusedHistoriesAtom,
} from "./atoms/chat";
import { ModelChatHistory, ChatHistoryMessage } from "./types";

const store = getDefaultStore();

export class ChatHistoryManager {
  /**
   * Update chat history for a specific model
   */
  static updateModelHistory(
    modelId: string,
    conversationId: string,
    messages: ChatHistoryMessage[]
  ) {
    const currentHistories = store.get(modelChatHistoriesAtom);

    const updatedHistory: ModelChatHistory = {
      conversation_id: conversationId,
      messages: messages,
      last_updated: new Date().toISOString(),
    };

    store.set(modelChatHistoriesAtom, {
      ...currentHistories,
      [modelId]: updatedHistory,
    });
  }

  /**
   * Get chat history for a specific model
   */
  static getModelHistory(modelId: string): ModelChatHistory | null {
    const histories = store.get(modelChatHistoriesAtom);
    return histories[modelId] || null;
  }

  /**
   * Add a new message to a model's history
   */
  static addMessageToHistory(
    modelId: string,
    conversationId: string,
    role: "user" | "assistant",
    content: string
  ) {
    const currentHistory = this.getModelHistory(modelId);
    const newMessage: ChatHistoryMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    if (currentHistory && currentHistory.conversation_id === conversationId) {
      // Update existing history
      const updatedMessages = [...currentHistory.messages, newMessage];
      this.updateModelHistory(modelId, conversationId, updatedMessages);
    } else {
      // Create new history
      this.updateModelHistory(modelId, conversationId, [newMessage]);
    }
  }

  /**
   * Clean up histories for models that are no longer active
   */
  static cleanupUnusedHistories(activeModelIds: string[]) {
    store.set(cleanupUnusedHistoriesAtom, activeModelIds);
  }

  /**
   * Clear all chat histories
   */
  static clearAllHistories() {
    store.set(modelChatHistoriesAtom, {});
  }

  /**
   * Get all active model IDs that have histories
   */
  static getActiveModelIds(): string[] {
    const histories = store.get(modelChatHistoriesAtom);
    return Object.keys(histories);
  }

  /**
   * Check if a model has history for a specific conversation
   */
  static hasHistoryForConversation(
    modelId: string,
    conversationId: string
  ): boolean {
    const history = this.getModelHistory(modelId);
    return history?.conversation_id === conversationId;
  }
}
