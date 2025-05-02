import React, { useState } from "react";
import { Bell, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "../common/Avatar";
import { notifications } from "@/data/mockData";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  const [unreadCount,setUnreadCount]=useState(notifications.filter((n) => !n.read).length);












































































  

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <header className="h-16 px-6 border-b border-border flex items-center justify-between gap-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative hidden md:flex items-center">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4 py-1.5 rounded-full bg-muted/50 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20 w-48 lg:w-64"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            className={cn(
              "relative p-2 rounded-full hover:bg-muted/60 transition-colors",
              notificationsOpen ? "bg-muted/60" : ""
            )}
            onClick={toggleNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto bg-card rounded-lg shadow-lg border border-border z-50">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-primary hover:underline" onClick={()=>setUnreadCount(0)}>
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="divide-y divide-border">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 hover:bg-muted/30 transition-colors",
                        !notification.read ? "bg-primary/5" : ""
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          alt={notification.employeeName}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {notification.employeeName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <Avatar src={user.avatar_url} alt={user.name} size="sm" />
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.role === "hr" ? "HR Manager" : "Employee"}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
