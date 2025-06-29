"use client";

import { useAtom } from "jotai";
import { ChatPanel } from "./chat-panel";
import { layoutAtom, availableModels } from "@/lib/atoms/chat";

export function ChatGrid() {
  const [layout] = useAtom(layoutAtom);

  // Get the number of models needed based on layout
  const getModelCount = (layout: string) => {
    switch (layout) {
      case "2":
        return 2; // 1x2 layout
      case "3":
        return 3; // 1x3 layout
      case "4":
        return 4; // 2x2 layout
      case "6":
        return 6; // 2x3 layout
      default:
        return 4;
    }
  };

  // Get top models based on layout
  const modelCount = getModelCount(layout);
  const activeModels = availableModels.slice(0, modelCount);

  // Determine grid columns/rows
  let gridClass = "";
  if (layout === "3") gridClass = "grid-cols-3 grid-rows-1";
  else if (layout === "2") gridClass = "grid-cols-2 grid-rows-1";
  else if (layout === "4") gridClass = "grid-cols-2 grid-rows-2";
  else if (layout === "6") gridClass = "grid-cols-3 grid-rows-2";

  return (
    <div
      className={`grid gap-x-6 gap-y-18 ${gridClass} w-full h-full transition-all duration-300 pb-12`}
    >
      {activeModels.map((model) => (
        <ChatPanel key={model.id} modelId={model.id} />
      ))}
    </div>
  );
}
