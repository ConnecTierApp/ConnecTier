"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useContextMessages, ContextMessage } from "@/hooks/use-context-messages";

interface StatusUpdatesProps {
  contextId: string;
}

export function StatusUpdates({ contextId }: StatusUpdatesProps) {
  const { messages, socketConnected } = useContextMessages(contextId);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="font-semibold text-lg truncate">Updates</div>
        <div className={cn("text-xs ml-2", socketConnected ? "text-green-600" : "text-red-500")}>{socketConnected ? "Live" : "Disconnected"}</div>
      </div>
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet. Messages will appear here as events occur.</div>
        ) : (
          messages.map((msg: ContextMessage, i: number) => (
            <div
              key={i}
              className={cn(
                "rounded-lg px-4 py-3 shadow-sm max-w-2xl mx-auto",
                msg.status === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : msg.status === "info"
                    ? "bg-blue-50 text-blue-900 border border-blue-200"
                    : "bg-white text-gray-800 border border-gray-200"
              )}
            >
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <span>{msg.type || msg.status}</span>
                {msg.match_id && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xxs">Match: {msg.match_id}</span>
                )}
              </div>
              <div className="whitespace-pre-line break-words">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}