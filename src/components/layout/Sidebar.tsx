import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import {
  BarChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  HelpCircle,
  LineChart,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import Avatar from "../common/Avatar";
import { cn } from "@/lib/utils";

// Context for chat history
import { useContext, createContext } from "react";

// Type for chat history
interface ChatHistoryItem {
  id: number | string;
  title: string;
  date: string;
}

// Context definition
interface ChatHistoryContextType {
  chatHistory: ChatHistoryItem[];
  addChatToHistory: (chat: ChatHistoryItem) => void;
}

// Create chat history context
export const ChatHistoryContext = createContext<ChatHistoryContextType>({
  chatHistory: [],
  addChatToHistory: () => {},
});

// Hook to use chat history
export const useChatHistory = () => useContext(ChatHistoryContext);

// Mock chat history data
const mockChatHistory = [
  { id: 1, title: "Work-life balance discussion", date: "2023-03-20" },
  { id: 2, title: "Stress management", date: "2023-03-18" },
  { id: 3, title: "Team collaboration feedback", date: "2023-03-15" },
  { id: 4, title: "Career growth concerns", date: "2023-03-10" },
];

const HRSidebarItems = [
  { label: "Dashboard", path: "/hr/dashboard", icon: Home },
  { label: "Employees", path: "/hr/employees", icon: Users },
  { label: "Calendar", path: "/hr/calendar", icon: Calendar },
  { label: "Reports", path: "/hr/reports", icon: BarChart },
  { label: "Settings", path: "/hr/settings", icon: Settings },
];

const EmployeeSidebarItems = [
  { label: "Dashboard", path: "/employee/dashboard", icon: Home },
  { label: "Chat", path: "/employee/chat", icon: MessageSquare },
  { label: "Q&A", path: "/employee/qa", icon: HelpCircle },
  { label: "History", path: "/employee/history", icon: LineChart },
  { label: "Settings", path: "/employee/settings", icon: Settings },
];

// Chat history provider component
export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retrieve any previously saved chat history from localStorage
  const getSavedHistory = (): ChatHistoryItem[] => {
    try {
      const saved = localStorage.getItem('chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Problem loading chat history:', error);
      return [];
    }
  };

  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(getSavedHistory());

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Problem saving chat history:', error);
    }
  }, [chatHistory]);

  const addChatToHistory = (chat: ChatHistoryItem) => {
    // Update existing chat or add new chat
    setChatHistory((prev) => {
      const existingChatIndex = prev.findIndex((item) => item.id === chat.id);
      if (existingChatIndex !== -1) {
        const updatedHistory = [...prev];
        updatedHistory[existingChatIndex] = chat;
        return updatedHistory;
      } else {
        console.log('New chat added:', chat.title);
        return [chat, ...prev];
      }
    });
  };

  return (
    <ChatHistoryContext.Provider value={{ chatHistory, addChatToHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

const Sidebar: React.FC = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const [showChatHistory, setShowChatHistory] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { chatHistory } = useChatHistory();

  // Show chat history only when on the chat page
  useEffect(() => {
    if (location.pathname === "/employee/chat" || location.pathname.includes('/employee/chat/')) {
      setShowChatHistory(true);
    } else {
      setShowChatHistory(false);
    }
  }, [location.pathname]);

  if (!user) return null;

  const sidebarItems = user.role === "hr" ? HRSidebarItems : EmployeeSidebarItems;

  // To add chat history to sidebar items
  const renderSidebarItems = () => {
    return sidebarItems.map((item, index) => {
      const isActive = location.pathname === item.path ||
        (item.path !== `/${user.role}/dashboard` && location.pathname.includes(item.path));

      // To show Chat button and history below it
      if (item.label === "Chat" && user.role === "employee") {
        return (
          <React.Fragment key={item.path}>
            {/* Chat button */}
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:text-white",
                isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
              )}
              onClick={(e) => {
                if (location.pathname === item.path || location.pathname.includes('/employee/chat/')) {
                  e.preventDefault();
                  setShowChatHistory(!showChatHistory);
                }
              }}
            >
              <item.icon size={20} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {(location.pathname === item.path || location.pathname.includes('/employee/chat/')) && (
                    showChatHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </>
              )}
            </Link>

            {/* Chat history */}
            {!collapsed && showChatHistory && (location.pathname === "/employee/chat" || location.pathname.includes('/employee/chat/')) && (
              <div className="pl-9 pr-2 space-y-1 py-1">
                <p className="text-xs font-semibold text-gray-400 py-1">Recent Chats</p>
                {chatHistory.length > 0 ? (
                  chatHistory.map((chat) => (
                    <Link
                      key={chat.id}
                      to={`/employee/chat/${chat.id}`}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-gray-300 hover:text-white transition-colors",
                        location.pathname === `/employee/chat/${chat.id}` ? "bg-gray-800 text-white" : "hover:bg-gray-800/50"
                      )}
                    >
                      <Clock size={14} />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-gray-500 px-2 py-1.5">No recent chats</div>
                )}
              </div>
            )}
          </React.Fragment>
        );
      }

      // Other items
      return (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:text-white",
            isActive ? "bg-gray-800" : "hover:bg-gray-800/50"
          )}
        >
          <item.icon size={20} />
          {!collapsed && <span>{item.label}</span>}
        </Link>
      );
    });
  };

  return (
    <div
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-black border-r border-gray-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="font-bold text-xl text-white flex items-baseline">
              VibeSense<span className="inline-block w-2 h-2 rounded-full bg-[#43d13b] ml-[0.5px]"></span>
            </span>
          )}
          {collapsed && (
            <div className="flex items-baseline">
              <span className="font-bold text-2xl text-white">V</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#006400] ml-[1px]"></div>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-800 text-gray-300"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-1 px-3">
          {renderSidebarItems()}
        </div>

        <div className="px-3 mt-auto">
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg text-white transition-colors",
              collapsed ? "justify-center" : "",
              location.pathname === "/profile" 
                ? "bg-white/10" 
                : "hover:bg-white/5"
            )}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="sm"
              className={cn(
                "rounded-full",
                user.role === "hr" ? "bg-white text-black border-2 border-white" : "bg-white text-black border-2 border-white"
              )}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {user.role === "hr" ? "HR Manager" : "Employee"}
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={logout}
            className="w-full mt-3 menu-item menu-item-inactive border-t border-gray-800 pt-3 text-gray-300 hover:text-white"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;