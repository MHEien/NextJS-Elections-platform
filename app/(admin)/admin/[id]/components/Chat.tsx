"use client";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Textarea } from "@/components/ui/textarea"
  import { Separator } from "@/components/ui/separator"
  import { MessageCircle, Plus } from "lucide-react";
  import { useSocket } from "@/lib/context/SocketProvider";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import useSWR from 'swr';
//A FAB button that opens a chat window in a Popover.
//Connects to the socket.io server and sends messages to the server.
//Messages are sent to the server with the user's name, message and election id.
//Messages are received from the server and displayed in the chat window.

interface ChatProps {
    electionId: string;
}

interface Message {
    name: string;
    time: string;
    message: string;
}

export default function Chat({ electionId }: ChatProps) {
    const { data: session } = useSession();
    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const socket = useSocket();

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data: messages, error } = useSWR(`/api/chat/${electionId}`, fetcher);

    useEffect(() => {
        if (socket) {
            socket.emit("join_chat", {
                userId: session?.user.id,
                role: session?.user.role,
                electionId,
            });
        }
    }, [socket, session, electionId]);
    useEffect(() => {
        if (messages) {
            setChatMessages(messages);
        }
    }, [messages]);
    
    useEffect(() => {
        if (socket) {
          const messageHandler = (message: Message) => {
            setChatMessages((messages) => [...messages, message]);
          };
      
          socket.on("message", messageHandler);
      
          // Cleanup function to remove the event listener
          return () => {
            socket.off("message", messageHandler);
          };
        }
      }, [socket]);
    
    const sendMessage = (e: any) => {
        e.preventDefault();
        if (message && socket && session?.user.id && session?.user.name) {
            try {
                const newMessage = {
                    userId: session.user.id,
                    message,
                    name: session.user.name,
                    electionId,
                    time: new Date().toISOString(),
                };
                socket.emit("send_message", newMessage);
                console.log('Message sent:', message);
                setMessage("");
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.log('Message or socket not available:', { message, socket });
        }
    };
    
    return (
        <>
        <Popover>
        <PopoverTrigger asChild>
            <Button variant="default" size="icon" className="fixed bottom-4 right-4">
                <MessageCircle size={24} />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
            <div className="flex flex-col h-full">
            <div className="flex flex-col flex-grow">
                <div className="flex flex-col flex-grow overflow-y-auto">
                {chatMessages.map((chatMessages, i) => (
                    <div key={i} className="flex flex-col">
                    <div className="flex flex-row justify-between">
                        <p className="text-sm font-semibold">{chatMessages.name}</p>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(chatMessages.time), { addSuffix: true })}
                        </p>
                    </div>
                    <p className="text-sm">{chatMessages.message}</p>
                    </div>
                ))}
                </div>
                <Separator />
                <form onSubmit={sendMessage} className="flex flex-row">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow"
                />
                <Button variant="default" size="icon" type="submit" className="ml-2">
                    <Plus size={24} />
                </Button>
                </form>
            </div>
            </div>
        </PopoverContent>
        </Popover>
        </>
    );
    }