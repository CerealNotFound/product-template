"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Settings as LucideSettings,
  BrainCircuit,
  MessageCircle,
  Star,
  Bot,
  Crown,
  Feather,
  Gem,
  Brain,
  Wand2,
} from "lucide-react";
import { availableModels } from "@/lib/atoms/chat";

// Icon mapping
const iconMap = {
  Bot,
  Crown,
  Feather,
  Gem,
  Brain,
  Wand2,
};

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  return (
    <aside
      className={`h-full flex flex-col transition-all duration-300 ease-out w-60 bg-white/80 backdrop-blur-sm border-r border-gray-100/60 shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <Button
          variant={"outline"}
          className="font-semibold text-xl tracking-tight text-gray-900 w-full py-2 hover:bg-white"
        >
          <BrainCircuit />
          MultiBrain
        </Button>
      </div>

      <Separator className="mb-6" />

      <div className="px-4 pb-3">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Primary
        </div>
        <Button
          variant={"ghost"}
          className={`w-full cursor-pointer text-xs flex items-center justify-start gap-3 rounded-xl transition-all duration-200 hover:bg-gray-100 text-gray-700 `}
          onClick={() => {
            console.log("main");
          }}
        >
          <span className="text-lg text-gray-600">
            <MessageCircle />
          </span>
          <span className="flex-1 text-left font-medium">Playground</span>
        </Button>
      </div>

      {/* AI Models Section */}
      <div className="px-4 pb-3">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          AI Models
        </div>
        <div className="space-y-2">
          {availableModels.map((model) => {
            const IconComponent = iconMap[model.icon as keyof typeof iconMap];
            return (
              <Button
                key={model.id}
                variant={"ghost"}
                className={`w-full cursor-pointer text-xs flex items-center justify-start gap-3 rounded-xl transition-all duration-200 hover:bg-gray-100 text-gray-700 `}
                onClick={() => {
                  console.log(model.id);
                }}
              >
                <span className="text-lg text-gray-600">
                  {IconComponent && <IconComponent />}
                </span>
                {!collapsed && (
                  <span className="flex-1 text-left font-medium">
                    {model.name}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto px-6 py-6 space-y-2 border-t border-gray-100/60">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 rounded-lg hover:bg-gray-50/80 text-gray-600 font-medium"
        >
          <LucideSettings className="h-4 w-4" />
          {!collapsed && "Settings"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 px-3 rounded-lg hover:bg-gray-50/80 text-gray-600 font-medium"
        >
          <Star className="h-4 w-4" />
          {!collapsed && "Support"}
        </Button>
      </div>
    </aside>
  );
}
