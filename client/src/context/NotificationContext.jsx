import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getMyNotificationsApi,
  getUnreadNotificationCountApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
} from "../api/notificationApi";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";
import { toast } from "sonner";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, authChecked, user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isLoadingUnreadCount, setIsLoadingUnreadCount] = useState(false);

  const resetNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      resetNotifications();
      return;
    }

    try {
      setIsLoadingNotifications(true);
      const data = await getMyNotificationsApi();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("fetchNotifications error:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [isAuthenticated, resetNotifications]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoadingUnreadCount(true);
      const data = await getUnreadNotificationCountApi();
      setUnreadCount(Number(data.unreadCount || 0));
    } catch (error) {
      console.error("fetchUnreadCount error:", error);
    } finally {
      setIsLoadingUnreadCount(false);
    }
  }, [isAuthenticated]);

  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  const markOneAsRead = useCallback(async (id) => {
    try {
      await markNotificationAsReadApi(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("markOneAsRead error:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsReadApi();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("markAllAsRead error:", error);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;

    if (!isAuthenticated || !user) {
      resetNotifications();
      disconnectSocket();
      return;
    }

    refreshNotifications();
  }, [authChecked, isAuthenticated, user, refreshNotifications, resetNotifications]);

  useEffect(() => {
    if (!authChecked || !isAuthenticated || !user?._id) return;

    const socket = connectSocket();

    const handleConnect = () => {
      socket.emit("join:user", user._id);
    };

    const handleNewNotification = (notification) => {
      if (!notification?._id) return;

      let isNewNotification = false;

      setNotifications((prev) => {
        const exists = prev.some((item) => item._id === notification._id);
        if (exists) return prev;

        isNewNotification = true;
        return [notification, ...prev];
      });

      if (isNewNotification) {
        setUnreadCount((prev) => prev + 1);

        const showToastTypes = ["order", "seller", "account", "product"];

        if (showToastTypes.includes(notification.type)) {
          toast.success(notification.title || "New notification", {
            description: notification.message || "You have a new update.",
          });
        }
      }
    };
    socket.on("connect", handleConnect);
    socket.on("notification:new", handleNewNotification);

    if (socket.connected) {
      socket.emit("join:user", user._id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification:new", handleNewNotification);
    };
  }, [authChecked, isAuthenticated, user]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoadingNotifications,
      isLoadingUnreadCount,
      fetchNotifications,
      fetchUnreadCount,
      refreshNotifications,
      markOneAsRead,
      markAllAsRead,
      resetNotifications,
    }),
    [
      notifications,
      unreadCount,
      isLoadingNotifications,
      isLoadingUnreadCount,
      fetchNotifications,
      fetchUnreadCount,
      refreshNotifications,
      markOneAsRead,
      markAllAsRead,
      resetNotifications,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return context;
}