"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  user_id: string;
  users: { id: string; name: string };
}

interface Group {
  id: string;
  name: string;
  code: string;
  members?: User[];
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
      const groupsData = await apiFetch<Group[]>(
        `/groups?user_id=${currentUser.id}`
      );
      const groupMembers = await Promise.all(
        groupsData.map(async (group) => {
          const members = await apiFetch<User[]>(`/groups/${group.id}/members`);
          return { ...group, members };
        })
      );
      setGroups(groupMembers);
      console.log(groupMembers);
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
        <h1 className="text-lg sm:text-2xl font-bold text-gray-600">
          My Groups
        </h1>
        <div className="flex sm:gap-5 gap-2">
          <Link
            href="/groups/new"
            className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white p-1 sm:px-4 sm:py-2 rounded-full font-semibold shadow-md text-sm sm:text-md"
          >
            Create Group
          </Link>

          <Link
            href="/groups/join"
            className="border-1 border-[#956bff] text-[#956bff] bg-white hover:bg-[#956bff] hover:text-white p-1 sm:px-4 sm:py-2 rounded-full font-semibold shadow-md text-sm sm:text-md"
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
              <div className="sm:flex sm:justify-between sm:items-center sm:w-full">
                <div className="flex-1">
                  <p className="font-semibold text-md text-[#7a46ff]">
                    {group.name}
                  </p>
                  <p className="text-sm text-gray-400/80 tracking-wide">
                    Joining Code: {group.code}
                  </p>
                </div>
                <div className="sm:mt-0 mt-2">
                  <div className="flex space-x-5 items-center">
                    {group.members?.slice(0, 4).map((user) => (
                      <p
                        key={user.user_id}
                        className="text-xs py-1 px-2 text-white bg-violet-500 rounded-full"
                      >
                        {user.users.name}
                      </p>
                    ))}
                    {group.members && group.members.length > 4 && (
                      <p className="text-sm text-gray-400">
                        +{group.members.length - 4} more
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
