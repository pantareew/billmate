"use client";

import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();
  const router = useRouter();

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();

    //required field
    if (!groupName) {
      alert("Please enter a group name.");
      return;
    }
    //ensure user is log
    if (!currentUser) {
      alert("You must be logged in to create a group.");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.from("groups").insert([
      {
        name: groupName,
        created_by: currentUser.id, //link to the logged-in user
        created_at: new Date(),
      },
    ]);
    setLoading(false);
    if (error) {
      alert(`Error creating group: ${error.message}`);
    } else {
      alert(`Group "${groupName}" created successfully!`);
      setGroupName(""); //reset create group form
      router.push("/groups"); //go to groups page
    }
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create a New Group</h1>
      <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-2 rounded"
        >
          {loading ? "Creating" : "Create Group"}
        </button>
      </form>
    </div>
  );
}
