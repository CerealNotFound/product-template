"use client";

import { useAtom } from "jotai";
import { ChatPanel } from "./chat-panel";
import {
  layoutAtom,
  availableModels,
  selectedModelsAtom,
} from "@/lib/atoms/chat";
import React from "react";

export function ChatGrid() {
  const [layout] = useAtom(layoutAtom);
  const [selectedModels, setSelectedModels] = useAtom(selectedModelsAtom);

  // Ensure selectedModels is never empty
  React.useEffect(() => {
    if (!selectedModels || selectedModels.length === 0) {
      setSelectedModels(availableModels.slice(0, 4).map((m) => m.id));
    } else {
      const modelCount = getModelCount(layout);
      if (selectedModels.length > modelCount) {
        setSelectedModels(selectedModels.slice(0, modelCount));
      }
    }
  }, [selectedModels, setSelectedModels, layout]);

  // Get the number of models needed based on layout
  const getModelCount = (layout: string) => {
    switch (layout) {
      case "1":
        return 1; // 1x1 layout
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

  // Remove the effect that trims selectedModels
  // Only slice selectedModels locally for display
  const modelCount = getModelCount(layout);
  const activeModels = selectedModels
    .filter((id) => availableModels.some((m) => m.id === id))
    .slice(0, modelCount)
    .map((id) => availableModels.find((m) => m.id === id)!)
    .filter(Boolean);

  // Determine grid columns/rows
  let gridClass = "";
  if (layout === "1") gridClass = "grid-cols-1 grid-rows-1";
  else if (layout === "3") gridClass = "grid-cols-3 grid-rows-1";
  else if (layout === "2") gridClass = "grid-cols-2 grid-rows-1";
  else if (layout === "4") gridClass = "grid-cols-2 grid-rows-2";
  else if (layout === "6") gridClass = "grid-cols-3 grid-rows-2";

  React.useEffect(() => {
    const modelCount = getModelCount(layout);
    if (selectedModels.length < modelCount) {
      // Fill up with available models (no duplicates)
      const extra = availableModels
        .map((m) => m.id)
        .filter((id) => !selectedModels.includes(id))
        .slice(0, modelCount - selectedModels.length);
      if (extra.length > 0) {
        setSelectedModels([...selectedModels, ...extra]);
      }
    }
  }, [layout, selectedModels, setSelectedModels]);

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
