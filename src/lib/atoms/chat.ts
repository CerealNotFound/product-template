import { atom } from "jotai";
import { ChatHistoryMessage, ModelChatHistory } from "../types";

// AI Models data
export const availableModels = [
  {
    id: "deepseek-chat-v3-0324",
    name: "DeepSeek Chat v3",
    icon: "Bot",
    premium: false,
    status: "online",
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    icon: "Gem",
    premium: false,
    status: "online",
  },
  {
    id: "qwen3-32b",
    name: "Qwen 3 32B",
    icon: "Brain",
    premium: false,
    status: "online",
  },
  {
    id: "mistral-nemo",
    name: "Mistral Nemo",
    icon: "Wand2",
    premium: false,
    status: "online",
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    icon: "Crown",
    premium: false,
    status: "online",
  },
  {
    id: "kimi-dev-72b",
    name: "Kimi Dev 72B",
    icon: "Feather",
    premium: false,
    status: "online",
  },
];

// Chat state atoms
export const layoutAtom = atom<"2" | "3" | "4" | "6">("4");
export const chatHistoriesAtom = atom<
  Record<string, { role: "user" | "ai"; content: string; timestamp: string }[]>
>({
  "deepseek-chat-v3-0324": [],
  "gemini-2.0-flash-exp": [],
  "qwen3-32b": [],
  "mistral-nemo": [],
  "llama-4-maverick": [],
  "kimi-dev-72b": [],
});
export const inputAtom = atom("");

// New atom for managing chat history per model with automatic cleanup
export const modelChatHistoriesAtom = atom<Record<string, ModelChatHistory>>(
  {}
);

// Helper function to clean up unused model histories
export const cleanupUnusedHistoriesAtom = atom(
  null,
  (get, set, activeModelIds: string[]) => {
    const currentHistories = get(modelChatHistoriesAtom);
    const newHistories: Record<string, ModelChatHistory> = {};

    // Only keep histories for currently active models
    activeModelIds.forEach((modelId) => {
      if (currentHistories[modelId]) {
        newHistories[modelId] = currentHistories[modelId];
      }
    });

    set(modelChatHistoriesAtom, newHistories);
  }
);
