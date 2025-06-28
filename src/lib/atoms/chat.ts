import { atom } from "jotai";

// AI Models data
export const availableModels = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    icon: "Bot",
    premium: true,
    status: "online",
  },
  {
    id: "gpt-3.5",
    name: "GPT-3.5",
    icon: "Bot",
    premium: false,
    status: "online",
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    icon: "Feather",
    premium: false,
    status: "online",
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    icon: "Crown",
    premium: true,
    status: "online",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    icon: "Gem",
    premium: false,
    status: "online",
  },
  {
    id: "llama",
    name: "Llama",
    icon: "Brain",
    premium: false,
    status: "online",
  },
];

// Chat state atoms
export const layoutAtom = atom<"2" | "3" | "4" | "6">("4");
export const chatHistoriesAtom = atom<
  Record<string, { role: "user" | "ai"; content: string; timestamp: string }[]>
>({
  "gpt-4o": [],
  "gpt-3.5": [],
  "claude-sonnet-4": [],
  "claude-opus": [],
  "gemini-pro": [],
  llama: [],
});
export const inputAtom = atom("");
