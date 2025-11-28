"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

interface Group {
  id: string; //uuid
  name: string;
}
export default function BillForm() {
  const { currentUser } = useUser();
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState("");
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
    //currentUser is empty
    if (!currentUser) {
      alert("User not logged in.");
      return;
    }
    //validating total amount
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number for total amount.");
      return;
    }

    setLoading(true); //start creating form

    //create bill by inserting to db
    const { error } = await supabase.from("bills").insert([
      {
        title,
        total_amount: amount,
        group_id: selectedGroup,
        category,
        payer_id: currentUser.id, //who uploaded/paid this bill
      },
    ]);
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert("Bill created successfully!");
      //reset form
      setTitle("");
      setTotalAmount("");
      setSelectedGroup("");
      setCategory("");
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <input
        className="border p-2"
        placeholder="Bill title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2"
        type="number"
        placeholder="Total amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <select
        className="border p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Category (optional)</option>
        <option value={"utilities"}>Utilities</option>
        <option value={"dining"}>Food</option>
      </select>
      <select
        className="border p-2"
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
      >
        <option value="">Select Group</option>
        {/*render all user's groupd */}
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      <button disabled={loading} className="bg-black text-white p-2 rounded">
        {loading ? "Creating..." : "Create Bill"}
      </button>
    </form>
  );
}
