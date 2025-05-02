import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw } from "lucide-react";
import { ChatMessage } from "@/data/mockData";
import Avatar from "../common/Avatar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type ChatInterfaceProps = {
  initialMessages?: ChatMessage[];
  className?: string;
  onMessageSent?: (message: ChatMessage) => void;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  initialMessages = [],
  className,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (messages.length > 0 && messages[0].sender === "user") {
      // Scroll to top when user sends a new message
      messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Otherwise scroll to bottom
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      message: input,
      timestamp: new Date().toISOString(),
    };

    // Move the latest user question to the top
    setMessages(prev => [newUserMessage, ...prev]);
    setInput("");
    setIsLoading(true);
    
    // Notify parent component about new message (for chat history in sidebar)
    if (onMessageSent) {
      onMessageSent(newUserMessage);
    }

    // Simulate bot response with fixed welcome message
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        message: "Hi, welcome to VibeSense Bot!",
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [prev[0], botMessage, ...prev.slice(1)]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Check if a message is the welcome message
  const isWelcomeMessage = (message: string) => {
    return message === "Hi, welcome to VibeSence Bot!";
  };

  return (
    <div className={cn("flex flex-col h-full glass-card overflow-hidden", className)}>
      <div className="p-4 border-b border-border bg-primary/5">
        <h2 className="text-lg font-medium">VibeSense Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Share how you're feeling or ask questions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div ref={messagesStartRef} /> {/* Reference to scroll to top */}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start gap-3 max-w-[80%] animate-fade-in",
              msg.sender === "user" ? "ml-auto" : ""
            )}
          >
            {msg.sender === "bot" && (
              <Avatar
                alt="VibeSence"
                size="sm"
                className="bg-primary text-primary-foreground"
              />
            )}

            <div
              className={cn(
                "rounded-xl p-3 text-sm",
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className={isWelcomeMessage(msg.message) ? "welcome-message" : ""}>{msg.message}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {msg.sender === "user" && user && (
              <Avatar src={user.avatar} alt={user.name} size="sm" />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar
              alt="VibeSense"
              size="sm"
              className="bg-primary text-primary-foreground"
            />
            <div className="bg-muted rounded-xl p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="flex-1 min-h-[40px] max-h-32 p-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2 rounded-md button-hover",
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;