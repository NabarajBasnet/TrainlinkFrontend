'use client';

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, Smile, Paperclip, Send, MessageSquare, User, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface User {
    _id: string;
    fullName: string;
    avatarUrl?: string;
}

interface Connection {
    _id: string;
    user: User;
    lastEngagementAt: string;
    lastMessage?: string;
}

interface ConnectionsData {
    myConnections?: Connection[];
    chatList?: Connection[];
}

const Messages = () => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [selectedUser, setSelectedUser] = useState<Connection | null>(null);

    console.log(selectedUser);

    const getConnections = async (): Promise<ConnectionsData> => {
        try {
            const response = await fetch(`${API}/get-connections`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log('Error: ', error);
            toast.error(error instanceof Error ? error.message : 'An error occurred');
            throw error;
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['connections'],
        queryFn: getConnections
    });

    const { myConnections, chatList } = data || {};

    if (isLoading) {
        return (
            <div className="w-full flex h-[calc(100vh-4.5rem)] items-center justify-center">
                <div className="animate-pulse">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="w-full flex h-[calc(100vh-4.5rem)] md:p-0.5 dark:bg-gray-900">
            {/* Mobile - Chat List (shown only when no user is selected) */}
            <div className={`${selectedUser ? 'hidden' : 'flex'} md:hidden w-full bg-white dark:bg-gray-900 flex-col`}>
                {/* Mobile search */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search messages"
                            className="pl-10 rounded-sm py-5 bg-gray-100 dark:bg-gray-800 border-none"
                        />
                    </div>
                </div>

                {/* Mobile conversation list */}
                <div className="flex-1 overflow-y-auto">
                    {/* Horizontal List: Favorites or Recent */}
                    <div className="flex overflow-x-auto sticky top-0 z-50 dark:bg-gray-900 bg-white p-3 gap-4 border-b">
                        {chatList?.map((connection) => (
                            <div
                                key={connection._id}
                                onClick={() => setSelectedUser(connection)}
                                className="cursor-pointer flex-shrink-0 text-center"
                            >
                                <Avatar className="h-12 w-12 mx-auto">
                                    <AvatarImage src={connection?.user?.avatarUrl} />
                                    <AvatarFallback>
                                        <User className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <p className="text-xs mt-1 text-center truncate max-w-[60px] text-gray-600 dark:text-gray-300">
                                    {connection?.user?.fullName}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Vertical List: Full Conversations */}
                    <div className="flex-1">
                        {chatList?.map((connection) => (
                            <div
                                key={connection._id}
                                onClick={() => setSelectedUser(connection)}
                                className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={connection?.user?.avatarUrl} />
                                    <AvatarFallback>
                                        <User className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-orange-500">
                                            {connection?.user?.fullName}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {new Date(connection.lastEngagementAt).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {connection.lastMessage || 'No messages'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile - Chat Area (shown only when user is selected) */}
            <div className={`${selectedUser ? 'flex' : 'hidden'} md:hidden flex-col w-full bg-gray-50 dark:bg-gray-950`}>
                {/* Mobile chat header with back button */}
                <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(null)}
                            className="mr-2"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedUser?.user?.avatarUrl} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                            <h3 className="font-medium">{selectedUser?.user?.fullName}</h3>
                            <p className="text-xs text-gray-500">Online</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>

                {/* Mobile messages area */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {/* Received message */}
                        <div className="flex items-start">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src={selectedUser?.user?.avatarUrl} />
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
                                <div className="bg-orange-500 text-white p-3 rounded-lg rounded-tr-none shadow">
                                    <p>I'm doing great! Just working on this new project.</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">10:32 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile message input */}
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
                        <Button size="icon" className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop - Left sidebar (Chat List) */}
            <div className="hidden md:flex w-3/12 border-r bg-white dark:bg-gray-900 flex-col">
                <div className="py-5.5 px-3 border-b">
                    <h2 className="text-xl font-bold text-orange-500">Messages</h2>
                </div>

                {/* Desktop search bar */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search messages"
                            className="pl-10 bg-gray-100 dark:bg-gray-800 border-none"
                        />
                    </div>
                </div>

                {/* Desktop conversation list */}
                <div className="flex-1 overflow-y-auto">
                    {/* Horizontal List: Favorites or Recent */}
                    <div className="flex overflow-x-auto p-2 sticky -top-1 dark:bg-gray-900 bg-white gap-4 border-b z-50">
                        {chatList?.map((connection) => (
                            <div
                                key={connection._id}
                                onClick={() => setSelectedUser(connection)}
                                className="cursor-pointer flex-shrink-0 text-center"
                            >
                                <Avatar className="h-12 w-12 mx-auto">
                                    <AvatarImage src={connection?.user?.avatarUrl} />
                                    <AvatarFallback>
                                        <User className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <p className="text-xs mt-1 text-center truncate max-w-[60px] text-gray-600 dark:text-gray-300">
                                    {connection?.user?.fullName}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Vertical List: Full Conversations */}
                    <div className="flex-1">
                        {chatList?.map((connection) => (
                            <div
                                key={connection._id}
                                onClick={() => setSelectedUser(connection)}
                                className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer border-b ${selectedUser?._id === connection._id ? 'bg-gray-100 dark:bg-gray-900' : ''
                                    }`}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={connection?.user?.avatarUrl} />
                                    <AvatarFallback>
                                        <User className="h-10 w-10" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-orange-500">
                                            {connection?.user?.fullName}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {new Date(connection.lastEngagementAt).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {connection.lastMessage || 'No messages'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop - Right side (Chat Area) */}
            <div className="hidden md:flex flex-col w-9/12 bg-gray-50 dark:bg-gray-950">
                {selectedUser ? (
                    <>
                        {/* Desktop chat header */}
                        <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-900">
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedUser?.user?.avatarUrl} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <h3 className="font-medium">{selectedUser?.user?.fullName}</h3>
                                    <p className="text-xs text-gray-500">Online</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Desktop messages area */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {/* Received message */}
                                <div className="flex items-start">
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarImage src={selectedUser?.user?.avatarUrl} />
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
                                        <div className="bg-orange-500 text-white p-3 rounded-lg rounded-tr-none shadow">
                                            <p>I'm doing great! Just working on this new project.</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 text-right">10:32 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop message input */}
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
                                <Button size="icon" className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Choose from your existing conversations or start a new one
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;