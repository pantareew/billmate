"use client";

import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

//group data type
interface Group {
  id: string; //uuid
  name: string;
}

//user data type
interface User {
  id: string;
  name: string;
}
export default function BillForm() {
  const { currentUser } = useUser();
  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [category, setCategory] = useState("");
  const [groups, setGroups] = useState<Group[]>([]); //for render all groups of the user
  const [selectedGroup, setSelectedGroup] = useState(""); //specific group the bill belongs to
  const [groupMembers, setGroupMembers] = useState<User[]>([]); //all group members
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]); //particular members that share the bill
  const [loading, setLoading] = useState(false); //for form subsmission progress
  const router = useRouter();
  //fetch user's groups for bill creation
  useEffect(() => {
    //check logged-in user on db
    if (!currentUser) return;
    //fetch user's groups
    async function fetchGroups() {
      try {
        const groups = await apiFetch<Group[]>(
          `/groups?user_id=${currentUser.id}`
        );
        setGroups(groups);
      } catch (error: any) {
        console.error(error);
        alert("Failed to load groups");
      }
    }
    fetchGroups();
  }, [currentUser]);
  //fetch members when group is selected
  useEffect(() => {
    //check for logged in user and selectedGroup
    if (!currentUser || !selectedGroup) return;
    async function fetchMembers() {
      {
        /* const { data, error } = await supabase
        .from("group_members")
        .select("user_id, users(id,name)")
        .eq("group_id", selectedGroup);
      if (!error && data) {
        setGroupMembers(data.map((item: any) => item.users));
        //pre-select current user (payer/person who create the bill)
        setSelectedMembers([currentUser!.id]); //selectedMember array has currentUser included
      }*/
      }
      try {
        const members = await apiFetch<User[]>( //api returns array of users obj
          `/groups/${selectedGroup}/members`
        );
        setGroupMembers(members.map((item: any) => item.users));
        //pre-select current user (bill's payer)
        setSelectedMembers([currentUser.id]);
      } catch (error: any) {
        console.error("Failed to fetch members:", error);
      }
    }
    fetchMembers();
  }, [selectedGroup, currentUser]); //only runs when selectedGroup or currentUser changes
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    //these fields must not be null
    if (
      !title ||
      !totalAmount ||
      !selectedGroup ||
      selectedMembers.length === 0
    ) {
      alert("Please fill all required fields.");
      return;
    }

    //validating total amount
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid number for total amount.");
      return;
    }

    setLoading(true); //start creating form

    try {
      //inserting new bill to db
      {
        /*const { data: bill, error: billError } = await supabase
        .from("bills")
        .insert([
          {
            title,
            total_amount: amount,
            group_id: selectedGroup,
            category,
            created_by: currentUser.id, //who uploaded/paid this bill
          },
        ])
        .select()
        .single(); //to get bill id of the inserted bill
      if (billError || !bill) {
        throw billError || new Error("Bill creation failed");
      }
      //auto-split amount among all members
      const numMembers = selectedMembers.length;
      const splitAmount = parseFloat((amount / numMembers).toFixed(2));

      //insert shares of a bill
      const { error: shareError } = await supabase.from("bill_shares").insert(
        selectedMembers.map((userId) => ({
          bill_id: bill.id,
          user_id: userId,
          paid: userId === currentUser.id ? true : false, //person who create a bil is already paid, others are not
          amount_owed: splitAmount,
          receipt: null,
        }))
      );
      if (shareError) throw shareError;
      alert("Bill created successfully!");*/
      }
      const bill = await apiFetch<{ id: string }>("/bills", {
        //return created bill as string
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          payer_id: currentUser.id,
          group_id: selectedGroup,
          total_amount: amount,
          category,
          shared_user_ids: selectedMembers.filter(
            (id) => id !== currentUser.id //exclude payer
          ),
        }),
      });
      //reset state variables
      setTitle("");
      setTotalAmount("");
      setSelectedGroup("");
      setCategory("");
      setSelectedMembers([]);
      setGroupMembers([]);
      router.push("/dashboard"); //navigate to dashboard
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error creating bill");
    } finally {
      setLoading(false);
    }
  }
  if (!currentUser) {
    return <p>Please log in to create a bill.</p>;
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      <input
        type="text"
        className="border p-2"
        placeholder="Bill title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="border p-2"
        type="number"
        placeholder="Total amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
        required
      />
      <select
        className="border p-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Category (optional)</option>
        <option value={"utilities"}>Utilities</option>
        <option value={"food"}>Food</option>
        <option value={"rent"}>Rent</option>
        <option value={"rent"}>Entertainment</option>
      </select>
      <select
        className="border p-2"
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        required
      >
        <option value="">Select Group</option>
        {/*render all user's groupd */}
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      {groupMembers.length > 0 && (
        <div className="flex flex-col gap-1">
          <p>Split Among:</p>
          {groupMembers.map((member) => (
            <label key={member.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={member.id}
                checked={selectedMembers.includes(member.id)} //checked if member is in the array
                onChange={(e) => {
                  const userId = e.target.value;
                  //get the latest state of the checkbox
                  setSelectedMembers(
                    (
                      prev //prev is the current state value
                    ) =>
                      prev.includes(userId) //check if user already exists in the array
                        ? prev.filter((id) => id !== userId) //remove user from the array (uncheck box)
                        : [...prev, userId] //add user to the array
                  );
                }}
              />
              {member.name}
            </label>
          ))}
        </div>
      )}
      <button disabled={loading} className="bg-black text-white p-2 rounded">
        {loading ? "Creating..." : "Create Bill"}
      </button>
    </form>
  );
}
