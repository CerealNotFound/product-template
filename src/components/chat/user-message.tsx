"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserMessageProps {
  content: string;
  timestamp: string;
}

export function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-[85%] items-start gap-3 flex-row-reverse">
        <div className="flex shrink-0">
          <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/50">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-medium">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2">
          <div className="rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-sm leading-relaxed">{content}</p>
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
