"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Send,
  Search,
  MessageSquare,
  Plus,
  X,
  User,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey, are we still meeting today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I sent you the files you requested",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: 1,
    online: true,
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for your help yesterday!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Emily Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let me know when you're free to talk",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Team Project",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "David: I'll update the presentation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: 5,
    online: true,
    isGroup: true,
  },
];

// Mock messages for a conversation
const mockMessages = [
  {
    id: 1,
    content: "Hey, how are you doing?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isOwn: false,
  },
  {
    id: 2,
    content: "I'm good, thanks! Just finishing up some work. How about you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
    isOwn: true,
  },
  {
    id: 3,
    content: "Pretty good! Are we still meeting today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
    isOwn: false,
  },
  {
    id: 4,
    content: "Yes, I'll be there at 3pm. Looking forward to it!",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    isOwn: true,
  },
  {
    id: 5,
    content: "Great! See you then.",
    timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
    isOwn: false,
  },
];

// Add this mock users data after the mockMessages array
const mockUsers = [
  {
    id: 101,
    name: "Jessica Parker",
    email: "jessica@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Manager",
  },
  {
    id: 102,
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "UX Designer",
  },
  {
    id: 103,
    name: "Sophia Martinez",
    email: "sophia@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Frontend Developer",
  },
  {
    id: 104,
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Backend Engineer",
  },
  {
    id: 105,
    name: "Emma Thompson",
    email: "emma.t@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Marketing Specialist",
  },
];

// Replace the MessagingPage component with this updated version
export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);

  // Find the selected conversation
  const currentChat = selectedChat
    ? mockConversations.find((chat) => chat.id === selectedChat)
    : null;

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(mockUsers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = mockUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery]);

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setNewMessage("");
    // In a real app, you would add the message to the conversation
  };

  // Go back to the conversation list
  const handleBack = () => {
    setSelectedChat(null);
  };

  // Start a new conversation with a user
  const startConversation = () => {
    // In a real app, you would create a new conversation
    // For now, just close the modal
    setIsModalOpen(false);
    setSearchQuery("");

    // For demo purposes, let's pretend we created a new conversation
    // and select it (we'll just select the first conversation)
    setSelectedChat(1);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute inset-0 bg-[url(/grid.svg)] opacity-[0.02] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <main className="relative pt-2 pb-6 px-4 md:px-6 max-w-7xl mx-auto">
        {selectedChat ? (
          // Chat view
          <div className="flex flex-col h-[calc(100vh-120px)] rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-zinc-800/50 flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
              >
                <ArrowLeft size={20} className="text-zinc-400" />
              </button>

              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800/50">
                  <Image
                    src={currentChat?.avatar || "/placeholder.svg"}
                    alt={currentChat?.name || "User"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                {currentChat?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 rounded-full border-2 border-zinc-900"></div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-zinc-100">
                  {currentChat?.name}
                </h3>
                {currentChat?.online ? (
                  <p className="text-xs text-teal-400">Online</p>
                ) : (
                  <p className="text-xs text-zinc-500">Offline</p>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-zinc-900/30">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[75%] mb-4 ${
                    message.isOwn ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      message.isOwn
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-none"
                        : "bg-zinc-800 text-zinc-100 rounded-bl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <div
                    className={`text-xs mt-1 text-zinc-500 ${
                      message.isOwn ? "text-right" : ""
                    }`}
                  >
                    {formatDistanceToNow(message.timestamp, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-zinc-800/50 flex items-center gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-zinc-800/50 rounded-full text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-full p-2 h-10 w-10"
                disabled={newMessage.trim() === ""}
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        ) : (
          // Conversation list
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-500" />
                <h1 className="text-xl font-bold text-zinc-100">Messages</h1>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-zinc-800/50 text-zinc-400 hover:text-teal-400"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={20} />
              </Button>
            </div>

            <div className="p-4 border-b border-zinc-800/50">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search messages"
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 rounded-full text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
              {mockConversations.map((chat) => (
                <div
                  key={chat.id}
                  className="relative group p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800/50">
                        <Image
                          src={chat.avatar || "/placeholder.svg"}
                          alt={chat.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 rounded-full border-2 border-zinc-900"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-zinc-100 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                          {formatDistanceToNow(chat.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-zinc-400 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="ml-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Search Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-100">
                  New Message
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="p-4 border-b border-zinc-800/50">
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by email or name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 rounded-full text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="relative group p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                      onClick={() => startConversation()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800/50">
                            <Image
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-zinc-100 truncate">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail size={14} className="text-zinc-500" />
                            <p className="text-sm text-zinc-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <p className="text-xs text-zinc-500 mt-1">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <User className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-400">No users found</p>
                    <p className="text-zinc-500 text-sm mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
