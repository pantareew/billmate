"use client";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Loader } from "lucide-react";
export default function NotificationsDropdown() {
  const { notifications, loading, markAsRead } = useNotifications();
  {
    /*calculate time ago from bill created  date*/
  }
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };
  return (
    <div className="w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      {/*header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 p-4">
        <div className="flex items-center gap-2">
          <Bell className="text-orange-500" size={20} />
          <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
        </div>
      </div>
      {/*content */}
      <div className="max-h-96 overflow-y-auto bg-gray-50">
        {loading ? (
          <div className="p-8 text-center">
            {/*loading */}
            <div className="inline-flex items-center gap-2 text-gray-400">
              <Loader className="animate-spin" size={20} />
              <span>Loading...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-white">
            {/*no notifications */}
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-orange-300" size={28} />
            </div>
            <p className="text-gray-800 font-medium mb-1">All caught up!</p>
            <p className="text-gray-500 text-sm">No new notifications</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  n.read
                    ? "bg-white hover:bg-gray-50'"
                    : "bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/*noti content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-relaxed mb-1 ${
                        n.read ? "text-gray-500" : "text-gray-900 font-medium"
                      }`}
                    >
                      {n.message}
                    </p>
                    {/*date & unread */}
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xs ${
                          n.read ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {getTimeAgo(n.created_at)}
                      </p>
                      {!n.read && (
                        <span className="text-xs text-orange-600 font-semibold">
                          • New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
