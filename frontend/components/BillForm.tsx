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
        //get only user id of all members
        const allUserIds = members.map((item: any) => item.users.id);
        //pre-select all members in the group
        setSelectedMembers(allUserIds);
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
  const categories = ["Utilities", "Food", "Rent", "Entertainment"];
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-full mx-auto"
    >
      <div>
        <h3 className="text-md font-semibold mb-1 text-gray-700">
          Enter bill's name
        </h3>
        <input
          type="text"
          className="border border-indigo-800 p-2 rounded-md w-full"
          placeholder="Bill title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <h3 className="text-md font-semibold mb-1 text-gray-700">
          Enter bill's total amount
        </h3>
        <input
          className="border border-indigo-700 p-2 rounded-md w-full"
          type="number"
          placeholder="Total amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />
      </div>
      {/*select category */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-700">
          Select Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const value = c.toLowerCase();
            const isActive = category === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`px-4 py-1 rounded-full border text-sm transition cursor-pointer
                ${
                  isActive
                    ? "bg-[#cc8cb6] text-white border-[#cc8cb6]"
                    : "bg-white text-[#8f627f] border-[#8f627f] hover:bg-[#cc8cb6] hover:text-white"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
      {/*show groups for selection */}
      <div>
        <h3 className="text-md font-semibold mb-2 text-gray-700">
          Select a group
        </h3>
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`py-2.5 px-4 rounded-lg cursor-pointer border-1 transition shadow-sm text-[15px] ${
                selectedGroup === group.id
                  ? "border-violet-500 bg-violet-600/80 text-white"
                  : "border-violet-600/80 bg-white hover:bg-violet-600/80 hover:border-violet-500 hover:text-white text-violet-700"
              }`}
              onClick={() => setSelectedGroup(group.id)}
            >
              <p className="font-medium">{group.name}</p>
            </div>
          ))}
        </div>
      </div>
      {/*select users */}
      {groupMembers.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mt-1 mb-2 text-gray-700">
            Split Among
          </h3>
          <div className="flex space-x-6">
            {groupMembers.map((member) => {
              const isChecked = selectedMembers.includes(member.id); //check if user is in selectedMembers array
              return (
                <label
                  key={member.id}
                  className={`px-4 py-1 rounded-full cursor-pointer shadow-sm border text-sm ${
                    isChecked
                      ? "bg-[#25aded] text-white border-[#25aded] hover:bg-white hover:text-[#25aded]"
                      : "bg-white text-[#25a3dd] hover:bg-[#25aded] hover:text-white hover:border-[#25a3dd]"
                  }`}
                >
                  <input
                    hidden
                    className="mr-2"
                    type="checkbox"
                    checked={isChecked} //tick the box if user is in selectedMembers
                    onChange={() =>
                      setSelectedMembers(
                        (prev) =>
                          isChecked //check if current array has this user
                            ? prev.filter((id) => id !== member.id) //remove user if already selected
                            : [...prev, member.id] //add user if not selected
                      )
                    }
                  />
                  {member.name}
                </label>
              );
            })}
          </div>
        </div>
      )}
      <button
        disabled={loading}
        className="bg-indigo-500 text-white p-2 mt-2 rounded-lg cursor-pointer hover:bg-indigo-600"
      >
        {loading ? "Creating..." : "Create Bill"}
      </button>
    </form>
  );
}
