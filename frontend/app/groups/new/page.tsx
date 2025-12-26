"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

//function to generate random group's code
{
  /*function generateGroup(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}*/
}

export default function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser();
  const router = useRouter();

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();

    //required field
    if (!groupName) {
      return alert("Please enter a group name.");
    }
    //ensure user is login
    if (!currentUser) {
      return alert("You must be logged in to create a group.");
    }
    setLoading(true);
    try {
      //get group's code
      //const code = generateGroup();
      //create group
      {
        /*const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert([
          {
            name: groupName,
            created_by: currentUser.id, //link to the logged-in user
            code,
          },
        ])
        .select()
        .single();
      if (groupError) throw groupError;
      //add group's creator to the group
      const { error: memberError } = await supabase
        .from("group_members")
        .insert([
          {
            group_id: group.id,
            user_id: currentUser.id,
          },
        ]);
      if (memberError) throw memberError;
      alert(`Group "${groupName}" created successfully!`);
      setGroupName(""); //reset create group form
      router.push("/groups"); //go to groups page */
      }
      await apiFetch("/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          user_id: currentUser.id, //logged-in user
        }),
      });
      alert("Group created!");
      setGroupName("");
      router.push("/groups"); //go to groups page
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex gap-5 float-right">
        <Link
          href="/groups/join"
          className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white px-4 py-2 rounded-full font-semibold shadow-md"
        >
          Join Group
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
          Create a New Group
        </h1>
        <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border border-[#6238cc] p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7a46ff] text-white p-2 rounded"
          >
            {loading ? "Creating" : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
