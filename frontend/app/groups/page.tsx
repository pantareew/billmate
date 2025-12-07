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
      {
        /*
      const { data, error } = await supabase
        .from("group_members")
        .select(`group_id, groups(name, code)`) //get group's name and code from groups table through FK
        .eq("user_id", currentUser.id);
      if (error) {
        console.error("Error fetching groups:", error.message);
      } else {
        //map data results to an array of groups
        const mappedGroups = data.map((item: any) => ({
          id: item.group_id,
          name: item.groups.name,
          code: item.groups.code,
        }));
        setGroups(mappedGroups);*/
      }
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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Groups</h1>
      <div className="flex gap-4 mb-6">
        <Link
          href="/groups/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Group
        </Link>

        <Link href="/groups/join" className="border px-4 py-2 rounded">
          Join Group
        </Link>
      </div>
      {/*loading groups */}
      {loading && <p>Loading groups...</p>}
      {/*no groups */}
      {!loading && groups.length === 0 ? (
        <p>You are not in any groups yet.</p>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li
              key={group.id}
              className="border p-4 rounded flex justify-between"
            >
              <div>
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm text-gray-500">
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
