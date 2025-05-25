"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useContextMessages, ContextMessage } from "@/hooks/use-context-messages";
import { useContextStatusUpdates } from "@/hooks/use-context-status-updates";

interface StatusUpdatesProps {
  contextId: string;
}

export function StatusUpdates({ contextId }: StatusUpdatesProps) {
  const { data, isLoading } = useContextStatusUpdates(contextId);
  const { messages: wsMessages, socketConnected } = useContextMessages(contextId);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Convert API status updates to ContextMessage format
  const apiMessages: ContextMessage[] = (data?.results || []).map((update) => ({
    type: "context_update_message",
    status: update.data?.status || "info",
    message: {
      ...update.data,
    },
    context_id: update.context_id,
    created_at: update.created_at,
  }));

  // Merge and deduplicate by created_at + message content
  const allMessages = React.useMemo(() => {
    // Use a Map for deduplication
    const map = new Map<string, ContextMessage>();
    for (const msg of apiMessages) {
      map.set(msg.created_at + (msg.message?.message || "") + (msg.message?.match_id || ""), msg);
    }
    for (const msg of wsMessages) {
      map.set(msg.created_at + (msg.message?.message || "") + (msg.message?.match_id || ""), msg);
    }
    // Sort by created_at ascending
    return Array.from(map.values()).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [apiMessages, wsMessages]);

  useEffect(() => {
    if (chatEndRef.current && scrollContainerRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [allMessages]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="font-semibold text-lg truncate">Updates</div>
        <div className={cn("text-xs ml-2", socketConnected ? "text-green-600" : "text-red-500")}>{socketConnected ? "Live" : "Disconnected"}</div>
      </div>
      {/* Chat window */}
      <div ref={scrollContainerRef} className="flex-1 min-h-0 max-h-[400px] overflow-y-auto p-6 space-y-4">
        {isLoading ? (
          <div className="text-gray-400 text-center">Loading...</div>
        ) : allMessages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet. Messages will appear here as events occur.</div>
        ) : (
          allMessages.map((msg: ContextMessage) => (
            <div
              key={msg.created_at + (msg.message?.message || "") + (msg.message?.match_id || "")}
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
                <span className="font-semibold text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">{msg.status}</span>
                {msg.message.match_id && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xxs">Match: {msg.message.match_id.slice(0, 8)}...</span>
                )}
              </div>
              <div className="whitespace-pre-line break-words">{msg?.message?.message?.slice(0, 80)}{msg?.message?.message?.length > 100 ? "..." : ""}</div>
            </div>
            // <pre key={i}>{JSON.stringify(msg, null, 2)}</pre>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}