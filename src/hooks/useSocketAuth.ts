import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocketAuth = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) return;

    const socket = io('http://localhost:5000');
    
    // Authenticate with user ID
    socket.emit('authenticate', userId);

    return () => {
      socket.close();
    };
  }, []);
}; 