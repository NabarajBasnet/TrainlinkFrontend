import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Create socket connection
    const socket = io("http://localhost:4000");
    socketRef.current = socket;

    // Authenticate with user ID
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("authenticate", userId);
    }

    return () => {
      socket.close();
    };
  }, []);

  return socketRef.current;
};
