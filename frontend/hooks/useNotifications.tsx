import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";

export type Notification = {
  id: string;
  bill_id: string;
  type: "new_bill" | "receipt_upload";
  message: string;
  read: boolean;
  created_at: string;
};

export function useNotifications() {
  const { currentUser } = useUser();
  const [notifcations, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true); //data is being fetched right after the component mounts
  //fetch notifications from db
  const fetchNotifications = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ notifications: Notification[] }>( //api returns {notifications: Notification[]}
        `/notifications?user_id=${currentUser.id}`
      );
      setNotifications(data.notifications); //set notifications var as an array of notifications
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  //call fetchNotifications when currentUser is changed
  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);
  //mark notification as read
  const markAsRead = async (notifcationId: string) => {
    try {
      //update read in backend
      await apiFetch(`/notifications/${notifcationId}/read`, {
        method: "POST",
      });
      //update read in frontend thru state var
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notifcationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };
  return { notifcations, loading, markAsRead };
}
