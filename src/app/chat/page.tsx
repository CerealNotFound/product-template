"use client";

import { useState } from "react";
import { Sidebar, ChatGrid, InputPanel } from "@/components/chat";

export default function ChatPlaygroundPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed((c) => !c)}
      />
      <main className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-auto p-8">
          <ChatGrid />
        </div>
        <InputPanel />
      </main>
    </div>
  );
}
