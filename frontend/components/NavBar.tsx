"use client";

import { useUser } from "@/context/UserContext";

export default function NavBar() {
  const { currentUser, logout } = useUser();
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">BillMate</h1>
        {currentUser && (
          <div className="inline-flex items-center">
            <p className="text-black">Notification</p>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
