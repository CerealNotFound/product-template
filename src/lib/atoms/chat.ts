import { atom } from "jotai";
import { ChatHistoryMessage, ModelChatHistory } from "../types";

// AI Models data
export const availableModels = [
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    symbol: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat v3",
    icon: "Bot",
    premium: false,
    status: "online",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    symbol: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash",
    icon: "Gem",
    premium: false,
    status: "online",
  },
  {
    id: "qwen/qwen3-32b:free",
    symbol: "qwen/qwen3-32b:free",
    name: "Qwen 3 32B",
    icon: "Brain",
    premium: false,
    status: "online",
  },
  {
    id: "mistralai/mistral-nemo:free",
    symbol: "mistralai/mistral-nemo:free",
    name: "Mistral Nemo",
    icon: "Wand2",
    premium: false,
    status: "online",
  },
  {
    id: "meta-llama/llama-4-maverick:free",
    symbol: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    icon: "Crown",
    premium: false,
    status: "online",
  },
  {
    id: "moonshotai/kimi-dev-72b:free",
    symbol: "moonshotai/kimi-dev-72b:free",
    name: "Kimi Dev 72B",
    icon: "Feather",
    premium: false,
    status: "online",
  },
];

// Chat state atoms
export const layoutAtom = atom<"2" | "3" | "4" | "6">("4");
export const chatHistoriesAtom = atom<
  Record<
    string,
    {
      role: "user" | "ai";
      content: string;
      timestamp: string;
      isError?: boolean;
    }[]
  >
>({
  "deepseek/deepseek-chat-v3-0324:free": [],
  "google/gemini-2.0-flash-exp:free": [],
  "qwen/qwen3-32b:free": [],
  "mistralai/mistral-nemo:free": [],
  "meta-llama/llama-4-maverick:free": [],
  "moonshotai/kimi-dev-72b:free": [],
});
export const inputAtom = atom("");
export const currentConversationIdAtom = atom<string | null>(null);

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
