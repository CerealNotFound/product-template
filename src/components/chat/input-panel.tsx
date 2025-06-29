"use client";

import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  LayoutGrid,
  Share2,
  Trash2,
  Settings as LucideSettings,
} from "lucide-react";
import {
  inputAtom,
  layoutAtom,
  chatHistoriesAtom,
  availableModels,
  currentConversationIdAtom,
} from "@/lib/atoms/chat";

// Custom SVGs for panel layouts
function TwoPanelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" {...props}>
      <rect
        x="5"
        y="7"
        width="22"
        height="18"
        rx="3"
        stroke="#000"
        strokeWidth="2"
      />
      <line x1="16" y1="7" x2="16" y2="25" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function FourPanelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" {...props}>
      <rect
        x="5"
        y="7"
        width="22"
        height="18"
        rx="3"
        stroke="#000"
        strokeWidth="2"
      />
      <line x1="16" y1="7" x2="16" y2="25" stroke="#000" strokeWidth="2" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function SixPanelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" {...props}>
      <rect
        x="5"
        y="7"
        width="22"
        height="18"
        rx="3"
        stroke="#000"
        strokeWidth="2"
      />
      <line x1="5" y1="16" x2="27" y2="16" stroke="#000" strokeWidth="2" />
      <line x1="12" y1="7" x2="12" y2="25" stroke="#000" strokeWidth="2" />
      <line x1="20" y1="7" x2="20" y2="25" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

function OneByThreePanelIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" {...props}>
      <rect
        x="6"
        y="7"
        width="22"
        height="18"
        rx="3"
        stroke="#000"
        strokeWidth="2"
      />
      <line x1="14" y1="7" x2="14" y2="25" stroke="#000" strokeWidth="2" />
      <line x1="21" y1="7" x2="21" y2="25" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

export function InputPanel() {
  const [input, setInput] = useAtom(inputAtom);
  const [layout, setLayout] = useAtom(layoutAtom);
  const [chatHistories, setChatHistories] = useAtom(chatHistoriesAtom);
  const [currentConversationId, setCurrentConversationId] = useAtom(
    currentConversationIdAtom
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const content = input.trim();
    const timestamp = new Date().toISOString();

    // Add user message to all models immediately
    const updatedHistories = { ...chatHistories };
    availableModels.forEach((model) => {
      const modelHistory = updatedHistories[model.id] || [];
      updatedHistories[model.id] = [
        ...modelHistory,
        { role: "user", content, timestamp },
      ];
    });
    setChatHistories(updatedHistories);

    // Clear input
    setInput("");

    try {
      // Use the new pipeline endpoint that creates conversation first
      const response = await fetch("/api/chat/send-prompt-with-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          model_ids: availableModels.map((m) => m.id),
          conversation_title: `Multi-Brain Chat - ${new Date().toLocaleString()}`,
          conversation_id: currentConversationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Set the conversation ID for future messages
        setCurrentConversationId(data.conversation_id);

        // Add AI responses
        const finalHistories = { ...updatedHistories };
        data.responses.forEach((resp: any) => {
          if (finalHistories[resp.model_id]) {
            finalHistories[resp.model_id].push({
              role: "ai",
              content: resp.content,
              timestamp: new Date().toISOString(),
            });
          }
        });
        setChatHistories(finalHistories);
      }
    } catch (error) {
      console.error("Failed to send prompt:", error);
    }
  };

  return (
    <div className="flex items-center gap-4 px-8 py-6 border-t border-gray-100/60 bg-white/80 backdrop-blur-sm">
      {/* View Toggles */}
      <div className="flex items-center gap-1 p-1 bg-gray-100/60 rounded-xl">
        <ToggleGroup
          type="single"
          value={layout}
          onValueChange={(v) => v && setLayout(v as any)}
          className="gap-1"
        >
          <ToggleGroupItem
            value="2"
            aria-label="1x2 grid view"
            className="h-8 w-8 rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
          >
            <TwoPanelIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="3"
            aria-label="1x3 grid view"
            className="h-8 w-8 rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
          >
            <OneByThreePanelIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="4"
            aria-label="2x2 grid view"
            className="h-8 w-8 rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
          >
            <FourPanelIcon />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="6"
            aria-label="2x3 grid view"
            className="h-8 w-8 rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm transition-all"
          >
            <SixPanelIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Input */}
      <div className="flex-1 relative">
        <Textarea
          className="w-full resize-none rounded-2xl border border-gray-200/60 px-4 py-3 text-base bg-white/80 backdrop-blur-sm focus:bg-white focus:border-blue-300/60 focus:ring-2 focus:ring-blue-100/50 transition-all duration-200 placeholder:text-gray-400"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question to compare responses..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
      </div>

      {/* Send Button */}
      <Button
        className="h-12 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
        size="lg"
        disabled={!input.trim()}
        onClick={handleSend}
      >
        Send
      </Button>

      {/* Additional Controls */}
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-100/60"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="rounded-lg">Export/Share</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-100/60"
            >
              <LucideSettings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="rounded-lg">Preferences</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-100/60"
              onClick={() => {
                setChatHistories({});
                setCurrentConversationId(null);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="rounded-lg">
            Clear all chats
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
