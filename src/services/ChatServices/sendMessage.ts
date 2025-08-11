import { socketConnector } from "../SocketConnection/SocketConnection";

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
  socketConnector.emit("sed-message", message);
};
