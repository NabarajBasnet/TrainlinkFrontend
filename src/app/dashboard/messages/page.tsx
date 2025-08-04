'use client';

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, Smile, Paperclip, Send, MessageSquare, User } from "lucide-react";

const Messages = () => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const getConnections = async () => {
        try {
            const response = await fetch(`${API}/get-connections`);
            const resBody = await response.json();
            return resBody;
        } catch (error: any) {
            console.log('Error: ', error);
            toast.error(error.message);
            throw error;
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['connections'],
        queryFn: getConnections
    });

    const { myConnections, chatList } = data || {};

    console.log(chatList)

    if (isLoading) {
        return (
            <div className="w-full flex h-[calc(100vh-5rem)] items-center justify-center">
                <div className="animate-pulse">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="w-full flex h-[calc(100vh-5rem)]">
            {/* Left sidebar - Conversation list */}
            <div className="w-full md:w-3/12 border-r bg-white dark:bg-gray-900">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Messages</h2>
                </div>

                {/* Search bar */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search messages"
                            className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
                        />
                    </div>
                </div>

                {/* Conversation list */}
                <div className="overflow-y-auto h-[calc(100%-7.5rem)]">
                    {chatList?.map((connection: any) => (
                        <div
                            key={connection._id}
                            className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b"
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={connection?.user?.avatarUrl} />
                                <AvatarFallback>
                                    <User className="h-10 w-10"/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1">
                                <div className="items-start">
                                    <h3 className="font-medium">{connection?.user?.fullName}</h3>
                                    <span className="text-xs text-gray-500">
                                        {new Date(connection.lastEngagementAt).toLocaleTimeString('en-US',{
                                            hour:'2-digit',
                                            minute:'2-digit',
                                            second:'2-digit',
                                            hour12:true
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {/* {connection.lastMessage} */}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Chat area */}
            <div className="hidden md:flex flex-col w-9/12 bg-gray-50 dark:bg-gray-950">
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900">
                    <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <h3 className="font-medium">Selected User</h3>
                            <p className="text-xs text-gray-500">Online</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {/* Sample messages */}
                    <div className="space-y-4">
                        {/* Received message */}
                        <div className="flex items-start">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg rounded-tl-none shadow">
                                    <p>Hey there! How are you doing?</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                            </div>
                        </div>

                        {/* Sent message */}
                        <div className="flex justify-end">
                            <div className="max-w-xs">
                                <div className="bg-blue-500 text-white p-3 rounded-lg rounded-tr-none shadow">
                                    <p>I'm doing great! Just working on this new project.</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">10:32 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message input */}
                <div className="p-4 border-t bg-white dark:bg-gray-900">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon">
                            <Smile className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            placeholder="Type a message"
                            className="flex-1 mx-2 bg-gray-100 dark:bg-gray-800 border-none"
                        />
                        <Button size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Empty state when no chat is selected (mobile) */}
            <div className="md:hidden flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center p-6">
                    <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                        <MessageSquare className="h-full w-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Select a conversation
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose from your existing conversations or start a new one
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Messages;