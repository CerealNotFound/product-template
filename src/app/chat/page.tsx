"use client";

import { useState } from "react";
import { Sidebar, ChatGrid, InputPanel } from "@/components/chat";
import { HistorySidebar } from "@/components/chat/history-sidebar";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export default function ChatPlaygroundPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      {historySidebarOpen && <HistorySidebar />}
      <main className="flex-1 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200/60">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
              className="h-8 w-8 p-0"
            >
              <History className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">Chat History</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <ChatGrid />
        </div>
        <InputPanel />
      </main>
    </div>
  );
}
