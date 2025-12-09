"use client";
import { useNotifications } from "@/hooks/useNotifications";
export default function NotificationsDropdown() {
  const { notifications, loading, markAsRead } = useNotifications();
  if (loading) return <p>Loading notifications...</p>;
  return (
    <div className="bg-white border p-2 rounded shadow-md w-89">
      <h3 className="font-bold mb-2">Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-1">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-2 rounded ${
                n.read ? "bg-gray-100" : "bg-blue-50"
              } cursor-pointer hover:bg-blue-100`}
              onClick={() => markAsRead(n.id)}
            >
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
