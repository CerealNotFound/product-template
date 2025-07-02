"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface AIMessageProps {
  content: string;
  timestamp: string;
  modelIcon?: string;
  modelName?: string;
}

export function AIMessage({
  content,
  timestamp,
  modelIcon,
  modelName,
}: AIMessageProps) {
  const [copied, setCopied] = useState(false);

  const sanitizeMarkdown = (markdown: string): string => {
    const lines = markdown.split(/\r?\n/);
    const result: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Fix trailing pipes
      if (line.startsWith("|") && line.endsWith("|")) {
        line = line.replace(/\|\s*$/, "");
      }

      // Add newline between compressed table rows (when a row starts in the middle of a line)
      if (
        line.startsWith("|") &&
        i > 0 &&
        !lines[i - 1].endsWith("|") &&
        !lines[i - 1].trim().endsWith("  ") // hard line break
      ) {
        result.push(""); // blank line before table row
      }

      result.push(line);
    }

    return result.join("\n");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex w-full justify-start">
      <div className="flex max-w-[85%] items-start gap-3">
        <div className="flex shrink-0">
          <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/50">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 text-xs font-medium">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl px-4 py-3 bg-white/80 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
            <div className="min-w-0 text-sm prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headings
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-3 text-gray-900 border-b border-gray-200/60 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold mb-2 text-gray-900">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-medium mb-2 text-gray-800">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-sm font-medium mb-1 text-gray-800">
                      {children}
                    </h4>
                  ),
                  // Paragraphs
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0 text-gray-700 leading-relaxed">
                      {children}
                    </p>
                  ),
                  // Lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-sm leading-relaxed">{children}</li>
                  ),
                  // Text formatting
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800">{children}</em>
                  ),
                  // Code blocks
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-gray-100/80 text-gray-800 px-1.5 py-0.5 rounded-md text-xs font-mono border border-gray-200/60">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="bg-gray-100/80 text-gray-800 px-1.5 py-0.5 rounded-md text-xs font-mono border border-gray-200/60">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-50/80 border border-gray-200/60 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-3 text-gray-800">
                      {children}
                    </pre>
                  ),
                  // Tables
                  table: ({ children }) => (
                    <div className="w-full overflow-x-auto mb-3">
                      <table className="min-w-full table-auto border-collapse border border-gray-200/60 rounded-lg overflow-hidden">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50/80 border-b border-gray-200/60">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => (
                    <tr className="border-b border-gray-200/40 last:border-b-0 hover:bg-gray-50/40 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 text-left font-semibold text-sm text-gray-900 border-r border-gray-200/40 last:border-r-0">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200/40 last:border-r-0">
                      {children}
                    </td>
                  ),
                  // Blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-200/60 pl-4 py-2 mb-3 bg-blue-50/30 rounded-r-lg">
                      <div className="text-gray-700 italic">{children}</div>
                    </blockquote>
                  ),
                  // Links
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:text-blue-700 underline decoration-blue-300/60 hover:decoration-blue-400/80 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  // Horizontal rule
                  hr: () => <hr className="border-t border-gray-200/60 my-4" />,
                }}
              >
                {sanitizeMarkdown(content)}
              </ReactMarkdown>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
