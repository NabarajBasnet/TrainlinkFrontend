import { socket } from "../SocketConnection/SocketConnection";

interface Message {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  attachments?: string[];
  sentAt: Date;
}

export const sendUserMessage = (message: Message) => {
  console.log(message);
  socket.emit("send-user-message", message);
};
