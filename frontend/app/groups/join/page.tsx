"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import { group } from "console";
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
      {
        /*
      //find group by code
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("id, name")
        .eq("code", groupCode)
        .single(); //check if entered code match with group's code
      // group not found
      if (groupError || !group) {
        setLoading(false);
        return alert("Group not found");
      }
      //check if user already joined
      const { data: existing, error: existingError } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", group.id)
        .eq("user_id", currentUser.id)
        .single(); //check if group_id and user_id match
      if (existing) {
        setLoading(false);
        return alert("You are already a member of this group.");
      }
      //insert into group_members
      const { error: joinError } = await supabase.from("group_members").insert([
        {
          group_id: group.id,
          user_id: currentUser.id,
        },
      ]);
      setLoading(false);
      if (joinError) {
        return alert(joinError.message);
      }
      //success
      alert(`You have joined "${group.name}" successfully`);
      //reset
      setGroupCode("");
      //redirect
      router.push("/groups"); */
      }
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
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Join Group</h1>
      <form onSubmit={handleJoinGroup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter group code"
          className="border p-2"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
      </form>
    </div>
  );
}
