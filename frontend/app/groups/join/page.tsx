"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinGroupPage() {
  const { currentUser } = useUser();
  const [groupCode, setGroupCode] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleJoinGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to join a group.");
    if (!groupCode) return alert("Please enter a group code.");
    setLoading(true);
    try {
      await apiFetch("/groups/join", {
        method: "POST",
        body: JSON.stringify({
          code: groupCode,
          user_id: currentUser.id,
        }),
      });
      alert("Joined group!");
      setGroupCode("");
      setLoading(false);
      router.push("/groups");
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong.");
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex gap-5 float-right">
        <Link
          href="/groups/new"
          className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white px-4 py-2 rounded-full font-semibold shadow-md"
        >
          Create Group
        </Link>

        <Link
          href="/groups"
          className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white px-4 py-2 rounded-full font-semibold shadow-md"
        >
          My Group
        </Link>
      </div>
      <div className="max-w-md mx-auto mt-20 p-6 border border-[#6238cc] rounded-md shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-[#6238cc] text-center">
          Join Group
        </h1>
        <form onSubmit={handleJoinGroup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter group code"
            className="border border-[#6238cc] p-2"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7a46ff] text-white p-2 rounded"
          >
            {loading ? "Joining..." : "Join Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
