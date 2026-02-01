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
    <div className="w-96 bg-yellow-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
      {/*header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-slate-700 p-4 ">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-400" size={20} />
          <h3 className="font-bold text-white text-lg">Notifications</h3>
        </div>
      </div>
      {/*content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-slate-400">
              <Loader className="animate-spin" size={20} />
              <span>Loading...</span>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-slate-500" size={28} />
            </div>
            <p className="text-slate-400 font-medium mb-1">All caught up!</p>
            <p className="text-slate-500 text-sm">No new notifications</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  n.read
                    ? "bg-slate-700/30 hover:bg-slate-700/50"
                    : "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-500/20"
                }`}
              >
                {/* Unread indicator */}
                {!n.read && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                )}

                <div className="flex items-start gap-3">
                  {/*noti content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-relaxed mb-1 ${
                        n.read ? "text-slate-400" : "text-slate-200 font-medium"
                      }`}
                    >
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xs ${
                          n.read ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {getTimeAgo(n.created_at)}
                      </p>
                      {!n.read && (
                        <span className="text-xs text-blue-400 font-medium">
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
