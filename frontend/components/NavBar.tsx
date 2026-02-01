"use client";

import { useUser } from "@/context/UserContext";
import { BellRing, LogOut } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import { useState } from "react";
import Image from "next/image";

export default function NavBar() {
  const { currentUser, logout } = useUser();
  const [showNoti, setShowNoti] = useState(false);
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={120}
            className="rounded-xl"
          />
          {currentUser && (
            <div className="hidden md:flex items-center gap-2">
              {/*notifications */}
              <div className="relative">
                <button
                  className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    showNoti ? "bg-orange-100 shadow-sm" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setShowNoti((prev) => !prev)}
                >
                  <BellRing
                    className={`transition-colors ${
                      showNoti ? "text-orange-600" : "text-gray-600"
                    }`}
                    size={25}
                  />
                </button>
                {showNoti && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNoti(false)}
                    />
                    <div className="absolute right-0 mt-3 z-50">
                      <NotificationsDropdown />
                    </div>
                  </>
                )}
              </div>
              {/*logout */}
              <button
                onClick={logout}
                className="p-2.5 hover:bg-red-50 rounded-xl transition-all duration-300 group relative"
              >
                <LogOut
                  className="text-gray-600 group-hover:text-red-600 transition-colors"
                  size={25}
                />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none">
                  Sign out
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
