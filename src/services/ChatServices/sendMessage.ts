import { socket } from "../SocketConnection/SocketConnection";

interface Message {
  receiverId: string;
  message: string;
  read: boolean;
  attachments?: string[];
  sentAt: Date;
}

export const sendUserMessage = (message: Message) => {
  socket.emit("send-user-message", message);
};
