"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

export default function BillForm() {
  interface Group {
    id: string; //uuid
    name: string;
  }
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState("utilities");
  const [groups, setGroups] = useState<Group[]>([]); //for render all groups of the user
  const [selectedGroup, setSelectedGroup] = useState("");
  const [loading, setLoading] = useState(false); //for form subsmission progress
  //fetch groups that the user belongs to
  useEffect(() => {
    async function fetchGroups() {
      const { data, error } = await supabase.from("groups").select("id, name"); //get id and name of each group
      if (error) console.error("Error fetching groups:", error);
      else setGroups(data);
    }
    fetchGroups();
  }, []);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    //these fields must not be null
    if (!title || !totalAmount || !selectedGroup) {
      alert("Please fill all required fields.");
      return;
    }
    setLoading(true);
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          placeholder="Bill title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Total amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select>Category</select>
        <select>Group</select>
        <button type="submit">Create Bill</button>
      </form>
    );
  }
}
