"use client";
import MenuBar from "@/components/MenuBar";
import NavBar from "@/components/NavBar";
import { useUser } from "@/context/UserContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useUser();

  return (
    <>
      {currentUser && <NavBar />}
      {children}
      {currentUser && <MenuBar />}
    </>
  );
}
