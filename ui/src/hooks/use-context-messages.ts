import { useEffect, useRef, useState } from "react";

export interface ContextMessage {
  status: string;
  message: string;
  type?: string;
  match_id?: string;
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

