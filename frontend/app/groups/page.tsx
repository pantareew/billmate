"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Group {
  id: string;
  name: string;
  code: string;
}

export default function GroupsPage() {
  const { currentUser } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  //fetch groups from database
  useEffect(() => {
    //check logged-in user for database
    if (!currentUser) return;
    async function fetchGroups() {
      setLoading(true);
      const data = await apiFetch<Group[]>(`/groups?user_id=${currentUser.id}`);
      setGroups(data);
      setLoading(false);
    }
    fetchGroups();
  }, [currentUser]); //run useEffect if the currentUser is changed
  //check user for UI rendering
  if (!currentUser) {
    return <p>Please login to see your groups.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-2 items-end">
        <h1 className="text-2xl font-bold text-gray-600">My Groups</h1>
        <div className="flex gap-5">
          <Link
            href="/groups/new"
            className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white px-4 py-2 rounded-full font-semibold shadow-md"
          >
            Create Group
          </Link>

          <Link
            href="/groups/join"
            className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white px-4 py-2 rounded-full font-semibold shadow-md"
          >
            Join Group
          </Link>
        </div>
      </div>
      {loading && <p className="text-gray-600">Loading groups...</p>}
      {/*no groups */}
      {!loading && groups.length === 0 ? (
        <p>You are not in any groups yet.</p>
      ) : (
        <ul className="space-y-5 my-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="border border-gray-200 shadow-sm p-4 rounded-lg flex justify-between bg-white"
            >
              <div>
                <p className="font-semibold text-md text-[#7a46ff]">
                  {group.name}
                </p>
                <p className="text-sm text-gray-400/80 tracking-wide">
                  Joining Code: {group.code}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
