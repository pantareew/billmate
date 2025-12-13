"use client";
import { DollarSign, Upload, UsersRound } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function MenuBar() {
  const router = useRouter();
  const pathname = usePathname(); //current url path
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`); //check if tab route is same as current path
  const baseClass = "flex flex-col items-center text-sm cursor-pointer";
  const activeClass = "text-blue-600";
  const inactiveClass = "text-gray-900";
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-white flex justify-around py-2 z-50">
      {/*Dashboard tab */}
      <button
        onClick={() => router.push("/dashboard")}
        className={`${baseClass} ${
          isActive("/dashboard") ? activeClass : inactiveClass
        }`}
      >
        <DollarSign size={22} />
        Dashboard
      </button>
      {/*New Bill tab */}
      <button
        onClick={() => router.push("/bills/new")}
        className={`${baseClass} ${
          isActive("/bills/new") ? activeClass : inactiveClass
        }`}
      >
        <Upload size={22} />
        New Bill
      </button>
      {/*Groups tab */}
      <button
        onClick={() => router.push("/groups")}
        className={`${baseClass} ${
          isActive("/groups") ? activeClass : inactiveClass
        }`}
      >
        <UsersRound size={22} />
        Groups
      </button>
    </div>
  );
}
