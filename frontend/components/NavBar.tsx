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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Image src="/logo.png" alt="Logo" width={120} height={120} />
        {/*<h1 className="text-xl font-bold text-gray-800">BillMate</h1>*/}
        {currentUser && (
          <div className="inline-flex items-center">
            <div
              className={`relative px-4 py-2 rounded-lg cursor-pointer transition group
               ${showNoti ? "bg-orange-100" : "hover:bg-orange-50"}`}
              onClick={() => setShowNoti((prev) => !prev)}
            >
              <BellRing className="text-[#eb5432]" size={25} />
              <span
                className="absolute mt-2 left-1/2 -translate-x-1/2 
                   opacity-0 group-hover:opacity-100 
                   bg-gray-800 text-white text-xs px-2 py-1 
                   rounded whitespace-nowrap transition-opacity"
              >
                Notifications
              </span>
            </div>
            {showNoti && <NotificationsDropdown />}
            <div
              onClick={logout}
              className="relative px-4 py-2 text-sm hover:bg-red-50 rounded-lg transition cursor-pointer group"
            >
              <LogOut className="text-[#df654a]" size={25} />
              <span
                className="absolute mt-2 left-1/2 -translate-x-1/2 
                   opacity-0 group-hover:opacity-100 
                   bg-gray-800 text-white text-xs px-2 py-1 
                   rounded whitespace-nowrap transition-opacity"
              >
                Sign out
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
