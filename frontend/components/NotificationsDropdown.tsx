"use client";
import { useNotifications } from "@/hooks/useNotifications";
export default function NotificationsDropdown() {
  const { notifications, loading, markAsRead } = useNotifications();
  //if (loading) return <p className="text-black">Loading notifications...</p>;
  return (
    <div className="bg-white border p-2 rounded shadow-md w-89">
      <h3 className="font-bold mb-2 text-[#db6162]">Notifications</h3>
      {loading && <p className="text-gray-600">Loading notifications...</p>}
      {!loading && notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-2 rounded ${
                n.read ? "bg-gray-50" : "bg-orange-50"
              } cursor-pointer hover:bg-gray-100`}
              onClick={() => markAsRead(n.id)}
            >
              <p
                className={`text-sm ${
                  n.read ? "text-gray-500" : "text-gray-600"
                }`}
              >
                {n.message}
              </p>
              <p
                className={`text-xs ${
                  n.read ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
