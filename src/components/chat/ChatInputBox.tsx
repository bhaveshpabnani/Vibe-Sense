import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';

interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const { collapsed } = useSidebar();

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div 
      className={cn(
        'fixed bottom-6 glass-card p-4 z-50 transition-all duration-300 ease-in-out',
        collapsed ? 'left-24 right-4' : 'left-68 right-4',
        'max-w-[1200px] mx-auto'
      )}
      style={{
        width: collapsed ? 'calc(100% - 6rem)' : 'calc(100% - 17rem)',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: collapsed ? '5rem' : '16rem',
        right: '1rem'
      }}
    >
      <div className="flex items-center gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none h-16"
        />
        <button
          onClick={handleSendMessage}
          className="p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;