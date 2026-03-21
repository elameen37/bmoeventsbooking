import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications, useUnreadCount, useMarkAsRead, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: "text-blue-400",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    markAsRead.mutate(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {(unreadCount || 0) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount! > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {(unreadCount || 0) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || Info;
              const colorClass = typeColors[notification.type] || "text-muted-foreground";

              return (
                <button
                  key={notification.id}
                  className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 ${
                    !notification.is_read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={`mt-0.5 shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${!notification.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
