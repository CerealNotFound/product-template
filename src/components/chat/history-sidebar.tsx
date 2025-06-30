"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Clock } from "lucide-react";
import { useChatPipeline } from "@/lib/hooks/use-chat-pipeline";
import { useAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentConversationIdAtom,
  selectedModelsAtom,
  layoutAtom,
  availableModels,
  isHistoricalConversationAtom,
} from "@/lib/atoms/chat";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function HistorySidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { startNewConversation, currentConversationId } = useChatPipeline();
  const [, setChatHistories] = useAtom(chatHistoriesAtom);
  const [, setCurrentConversationId] = useAtom(currentConversationIdAtom);
  const [, setSelectedModels] = useAtom(selectedModelsAtom);
  const [, setLayout] = useAtom(layoutAtom);
  const [, setIsHistoricalConversation] = useAtom(isHistoricalConversationAtom);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/chat/get-conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setChatHistories({});
    startNewConversation();
    setIsHistoricalConversation(false);
  };

  const handleSelectConversation = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/chat/get-messages?conversation_id=${conversationId}`
      );
      if (response.ok) {
        const messages = await response.json();

        // Set the current conversation ID
        setCurrentConversationId(conversationId);

        // Mark as historical conversation
        setIsHistoricalConversation(true);

        // Create a mapping from model names to symbols
        const modelNameToSymbol: Record<string, string> = {};
        availableModels.forEach((model) => {
          modelNameToSymbol[model.name] = model.symbol;
        });

        // Transform messages to chat history format
        const newHistories: Record<
          string,
          { role: "user" | "ai"; content: string; timestamp: string }[]
        > = {};

        // Track which models actually responded
        const respondingModels = new Set<string>();

        messages.forEach((message: any) => {
          // Add user message
          const userMessage = {
            role: "user" as const,
            content: message.prompt,
            timestamp: message.created_at,
          };

          // Add AI responses
          message.responses.forEach((response: any) => {
            const modelSymbol = modelNameToSymbol[response.model_name];
            if (modelSymbol) {
              respondingModels.add(modelSymbol);

              if (!newHistories[modelSymbol]) {
                newHistories[modelSymbol] = [];
              }

              // Add user message if not already added for this model
              if (
                !newHistories[modelSymbol].some(
                  (msg) => msg.content === message.prompt
                )
              ) {
                newHistories[modelSymbol].push(userMessage);
              }

              // Add AI response
              newHistories[modelSymbol].push({
                role: "ai" as const,
                content: response.content,
                timestamp: response.created_at,
              });
            }
          });
        });

        // Set the selected models based on which ones actually responded
        const respondingModelsArray = Array.from(respondingModels);
        setSelectedModels(respondingModelsArray);

        // Set appropriate layout based on number of responding models
        const modelCount = respondingModelsArray.length;
        if (modelCount <= 1) setLayout("1");
        else if (modelCount <= 2) setLayout("2");
        else if (modelCount <= 3) setLayout("3");
        else if (modelCount <= 4) setLayout("4");
        else setLayout("6");

        setChatHistories(newHistories);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="w-80 border-r border-gray-200/60 bg-white/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/60">
        <Button
          onClick={handleNewConversation}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new conversation to begin</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(conversation.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
