import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useChatHistory } from "@/components/layout/Sidebar";

interface Message {
  type: 'user' | 'bot';
  content: string;
}

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { addChatToHistory } = useChatHistory();

  // Message state variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentChatTitle, setCurrentChatTitle] = useState<string>('New Chat');

  // Load messages from chat history
  useEffect(() => {
    // Only set new chat state - do not use mock data
    if (!chatId) {
      setMessages([]);
      setCurrentChatTitle('New Chat');
    }
  }, [chatId]);

  // Handler to start a new chat
  const handleNewChat = () => {
    navigate('/employee/chat');
  };

  // Handle send function - to send messages
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (inputText.trim()) {
      const newUserMessage: Message = { type: 'user', content: inputText };

      // Keep messages at the top
      setMessages([newUserMessage, ...messages]);

      // Update header for all new questions
      // Use the first part of the question as the title
      const newTitle = inputText.slice(0, 30) + (inputText.length > 30 ? '...' : '');
      setCurrentChatTitle(newTitle);

      // Generate a new unique ID - always create a new ID
      const newChatId = chatId || `chat_${Date.now()}`;

      // Add a new chat every time (ensures every question shows up in history)
      addChatToHistory({
        id: newChatId,
        title: newTitle,
        date: new Date().toISOString().split('T')[0]
      });

      // Navigate when it's the first message
      if (messages.length === 0 && !chatId) {
        navigate(`/employee/chat/${newChatId}`, { replace: true });
      }

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          type: 'bot',
          content: 'Hi, welcome to VibeSence Bot!'
        };
        // Add bot response after user question
        setMessages(prev => [prev[0], botResponse, ...prev.slice(1)]);
      }, 1000);

      setInputText('');
    }
  };

  // Check if a message is the welcome message
  const isWelcomeMessage = (message: string) => {
    return message === "Hi, welcome to VibeSence Bot!";
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}

        {/* Top Bar with New Chat Button */}
        <div className="h-[65px] border-b border-border flex items-center justify-between px-6 bg-background/50">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleNewChat}
              variant="outline"
              size="icon"
              title="New Chat"
            >
              <PlusCircle size={16} />
            </Button>
            <h1 className="text-xl font-semibold">{currentChatTitle}</h1>
          </div>
          <div>{/* You can add something else here if needed */}</div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex items-center justify-center bg-background/10">
          {messages.length === 0 ? (
            // Welcome Screen - Centered Content with Container Limits
            <div className="max-w-2xl w-full space-y-12 p-6 overflow-hidden">
              {/* Welcome Section */}
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-foreground overflow-hidden text-ellipsis">Welcome to VibeSense</h2>
                <p className="text-muted-foreground text-lg overflow-wrap break-word">
                  Share your thoughts and feelings with our AI assistant. Your feedback helps us improve your workplace experience.
                  The conversation is confidential and will only be used to generate insights for improving the work environment.
                </p>
              </div>

              {/* Input Section */}
              <div className="w-full">
                <form onSubmit={handleSend}>
                  <div className="relative">
                    <textarea
                      className="w-full bg-background rounded-lg border border-border p-4 pr-12 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Ask anything..."
                      rows={3}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 bottom-2 p-2"
                      variant="ghost"
                    >
                      Send
                    </Button>
                  </div>
                </form>
                <div className="text-xs text-center mt-4 text-muted-foreground">
                  Your responses are confidential and help us improve.
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface after messages exist
            <div className="flex-1 flex flex-col h-full w-full">
              {/* Messages Area with Enhanced Wrapping */}
              <div className="flex-1 overflow-y-auto p-4 overflow-x-hidden message-container">
                <div className="space-y-6 w-full max-w-full">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-2xl rounded-lg p-4 text-wrapping-container ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className={`${isWelcomeMessage(message.content) ? "welcome-message" : ""} break-words`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Area - Fixed at bottom with better positioning */}
              <div className="border-t border-border p-4 bg-background sticky bottom-0 left-0 right-0 z-10">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSend}>
                    <div className="relative">
                      <textarea
                        className="w-full bg-background rounded-lg border border-border p-3 pr-12 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Ask anything..."
                        rows={1}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                      <Button
                        type="submit"
                        className="absolute right-2 bottom-2 p-2"
                        variant="ghost"
                      >
                        Send
                      </Button>
                    </div>
                  </form>
                  <div className="text-xs text-center mt-2 text-muted-foreground">
                    Your responses are confidential and help us improve.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;