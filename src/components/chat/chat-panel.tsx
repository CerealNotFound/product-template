"use client";

import React from "react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Settings as LucideSettings,
  Bot,
  Crown,
  Feather,
  Gem,
  Brain,
  Wand2,
} from "lucide-react";
import { chatHistoriesAtom, availableModels } from "@/lib/atoms/chat";
import { AIMessage } from "./ai-message";
import { UserMessage } from "./user-message";

// Icon mapping
const iconMap = {
  Bot,
  Crown,
  Feather,
  Gem,
  Brain,
  Wand2,
};

interface ChatPanelProps {
  modelId: string;
}

export function ChatPanel({ modelId }: ChatPanelProps) {
  const [chatHistories] = useAtom(chatHistoriesAtom);
  const model = availableModels.find((m) => m.id === modelId);
  // Dummy loading/error states
  const loading = false;
  const error = model?.status === "offline";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between py-4 bg-gradient-to-r from-gray-50/50 to-white/50 border-b border-gray-100/40">
        <Select>
          <SelectTrigger>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100/60">
                <span className="text-lg text-gray-600">
                  {model?.icon &&
                    iconMap[model.icon as keyof typeof iconMap] &&
                    React.createElement(
                      iconMap[model.icon as keyof typeof iconMap]
                    )}
                </span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                {model?.name}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((model) => {
              const IconComponent = iconMap[model.icon as keyof typeof iconMap];
              return (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg">
                      <span className="text-lg text-gray-600">
                        {IconComponent && <IconComponent />}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      {model.name}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-gray-100/60"
              >
                <LucideSettings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg">
              Panel Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Card className="flex flex-col h-full rounded-2xl border border-gray-100/60 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Chat Content */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 px-6 py-4">
            {error ? (
              <Alert
                variant="destructive"
                className="rounded-xl border-red-200/50 bg-red-50/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-red-700">Model unavailable.</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-100/50 rounded-lg"
                  >
                    Retry
                  </Button>
                </div>
              </Alert>
            ) : loading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-16 w-3/4 rounded-xl" />
              </div>
            ) : chatHistories[modelId]?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-gray-100/60 mb-4">
                  <Bot className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No conversation yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Ask something to get started!
                </p>
              </div>
            ) : (
              chatHistories[modelId].map((msg, i) =>
                msg.role === "user" ? (
                  <UserMessage
                    key={i}
                    content={msg.content}
                    timestamp={msg.timestamp}
                  />
                ) : (
                  <AIMessage
                    key={i}
                    content={msg.content}
                    timestamp={msg.timestamp}
                  />
                )
              )
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
