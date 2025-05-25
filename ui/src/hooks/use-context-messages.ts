import { useEffect, useRef, useState } from "react";

// ContextMessage should look like this:
/**
 * {
  "type": "context_update_message",
  "status": "info",
  "message": {
    "status": "info",
    "message": "Match between mentor Evan Kim and startup FrameLoop created with score excellent. Reason: Evan's expertise in AI, ML ops, and creator tools perfectly aligns with FrameLoop's needs in scaling GPU inference and optimizing creator workflows.",
    "mentor": "Evan Kim",
    "startup": "FrameLoop",
    "context_id": "c0663efb-7434-4251-a470-ed9cc537c338",
    "match_id": "1a0b8fbd-ee6b-4a68-ba72-9f5b79769418",
    "score": "excellent",
    "reasoning": "Evan's expertise in AI, ML ops, and creator tools perfectly aligns with FrameLoop's needs in scaling GPU inference and optimizing creator workflows."
  },
  "context_id": "c0663efb-7434-4251-a470-ed9cc537c338",
  "created_at": "2025-05-25T09:50:52.382746+00:00"
}
 */

export interface ContextMessage {
  type: string;
  status: string;
  message: {
    status: string;
    message: string;
    mentor: string;
    startup: string;
    context_id: string;
    match_id?: string;
    score?: string;
    reasoning?: string;
  };
  context_id: string;
  created_at: string;
}

export function useContextMessages(contextId: string) {
  const [messages, setMessages] = useState<ContextMessage[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;

    const connectSocket = () => {
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        return;
      }
      // Determine ws URL from NEXT_PUBLIC_API_URL
      let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      // Remove trailing slash if present
      apiUrl = apiUrl.replace(/\/$/, '');
      // Replace protocol with ws/wss
      let wsUrl: string;
      if (apiUrl.startsWith('https://')) {
        wsUrl = apiUrl.replace(/^https:/, 'wss:');
      } else if (apiUrl.startsWith('http://')) {
        wsUrl = apiUrl.replace(/^http:/, 'ws:');
      } else if (apiUrl.startsWith('ws://') || apiUrl.startsWith('wss://')) {
        wsUrl = apiUrl;
      } else {
        // Fallback: assume https
        wsUrl = 'wss://' + apiUrl;
      }
      wsUrl += `/ws/context/${contextId}/`;
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setSocketConnected(true);
      };
      socket.onclose = () => {
        setSocketConnected(false);
      };
      socket.onerror = () => {
        setSocketConnected(false);
      };
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch {
          // ignore invalid messages
        }
      };
    };

    connectSocket();

    const handleFocus = () => {
      if (!socket || socket.readyState === WebSocket.CLOSED) {
        connectSocket();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      if (socket) {
        socket.close();
      }
    }
  }, [contextId]);

  return { messages, socketConnected };
}

