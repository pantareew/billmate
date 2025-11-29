"use client";

import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";

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
        setGroups(mappedGroups);
      }
      setLoading(false);
    }
    fetchGroups();
  }, [currentUser]); //run useEffect if the currentUser is changed
  //check user for UI rendering
  if (!currentUser) {
    return <p>Please login to see your groups.</p>;
  }
  if (loading) {
    return <p>Loading groups...</p>;
  }
  return (
    <div>
      <h1>My Groups</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.name} - <span>{group.code}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
