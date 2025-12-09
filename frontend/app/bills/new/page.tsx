"use client";

import BillForm from "@/components/BillForm";
import { useUser } from "@/context/UserContext";
import { useState, ChangeEvent, useEffect } from "react";
import { Camera, Loader, CircleCheckBig } from "lucide-react";
import { apiFetch } from "@/lib/api";
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
export default function NewBillPage() {
  const { currentUser } = useUser();
  const [file, setFile] = useState<File | null>(null); //temporary store uploaded file
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"manual" | "upload">("upload"); //toggling between two modes: upload bill and create bill manually
  const [aiResult, setAiResult] = useState<any>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [splitting, setSplitting] = useState(false);
  const router = useRouter();
  //upload bill to backend
  useEffect(() => {
    if (!file || !currentUser) return;
    const uploadBill = async () => {
      try {
        setLoading(true);
        //create formdata to send file
        const formData = new FormData();
        formData.append("receipt", file);
        formData.append("user_id", currentUser.id);

        //call backend to upload receipt file to storage
        const data = await apiFetch<{
          bill_id: string;
          total_amount: number;
          title: string;
        }>("/bills/upload", {
          method: "POST",
          body: formData,
        });
        setAiResult(data);
        console.log("bill uploaded: ", data);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    uploadBill();
  }, [file]);
  //get groups after have aiResult
  useEffect(() => {
    if (!aiResult) return;
    const loadGroups = async () => {
      const data = await apiFetch<Group[]>(`/groups?user_id=${currentUser.id}`);
      setGroups(data);
    };
    loadGroups();
  }, [aiResult]);
  //load group's members when group is selected
  useEffect(() => {
    if (!selectedGroup) return;
    const loadMembers = async () => {
      const data = await apiFetch<User[]>( //api returns array of users obj
        `/groups/${selectedGroup}/members`
      );
      //set all members of the group for rendering
      setMembers(data.map((item: any) => item.users));
      //get only user id of all members
      const allUserIds = data.map((item: any) => item.users.id);
      //pre-select all members in the group
      setSelectedMembers(allUserIds);
    };
    loadMembers();
  }, [selectedGroup]);

  //handle splitting bill and update database
  const handleSplit = async () => {
    try {
      setSplitting(true);
      const payload = {
        bill_id: aiResult.bill_id,
        group_id: selectedGroup,
        total_amount: aiResult.total_amount,
        shared_users: selectedMembers.filter(
          (id) => id !== currentUser.id //exclude payer
        ),
        title: aiResult.title,
      };
      await apiFetch("/bills/split", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSplitting(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-6 space-y-6 pt-6 pb-40">
      {/*upload mode */}
      {mode === "upload" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Upload Bill</h2>
            {/*toggle to manual mode */}
            <button
              onClick={() => setMode("manual")}
              className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              Create Bill Manually
            </button>
          </div>
          <p className="text-gray-600 mb-4">Upload an image of your receipt</p>
          {/*upload area */}
          {/*when this div box is clicked, it will open (from .click()) element with id fileInput (which is input type file)*/}
          <div
            className="border-2 border-dashed border-gray-400 p-20 flex flex-col items-center justify-center cursor-pointer mb-6"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {/*preview the selected file or upload the file*/}
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Receipt Preview"
                className="max-h-64"
              />
            ) : (
              <div>
                <p className="text-gray-400">
                  <Camera size={25} />
                  Click to upload receipt
                </p>
                <p className="text-gray-500">
                  Only accept image file type (PNG, JPG, JPEG)
                </p>
              </div>
            )}
            {loading && (
              <p className="text-amber-700 flex items-center gap-2 my-4">
                <Loader size={25} /> Processing with Open AI
              </p>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {/*when have data from AI */}
          {aiResult && (
            <>
              {/*show data from AI */}
              <div className="bg-orange-100 border border-orange-300 rounded-xl p-4 mt-4">
                <div className="text-amber-700 flex items-center gap-2 mb-2 font-semibold">
                  <CircleCheckBig size={25} />
                  <h3>Receipt Extracted</h3>
                </div>
                <p className="text-orange-900 flex justify-between">
                  <span className="font-medium">Merchant: </span>
                  <span>{aiResult.title}</span>
                </p>
                <p className="text-orange-900 flex justify-between">
                  <span className="font-medium">Total: </span>
                  <span>${aiResult.total_amount}</span>
                </p>
              </div>
              {/*show groups for selection */}
              <select onChange={(e) => setSelectedGroup(e.target.value)}>
                <option>Select a group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {/*select users */}
              {members.map((member) => (
                <label key={member.id} className="block">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)} //tick the box if user is in selectedMembers array
                    onChange={() =>
                      setSelectedMembers(
                        (prev) =>
                          prev.includes(member.id) //check if current array has this user
                            ? prev.filter((id) => id !== member.id) //remove user if already selected
                            : [...prev, member.id] //add user if not selected
                      )
                    }
                  />
                  {member.name}
                </label>
              ))}
              {/*split and create bill button*/}
              {selectedGroup && selectedMembers.length > 0 && (
                <button
                  className="bg-cyan-500 p-4 rounded text-white cursor-pointer hover:bg-cyan-600"
                  onClick={handleSplit}
                >
                  {splitting ? "Processing the bill..." : "Split & Create Bill"}
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/*manual mode */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create a new bill</h2>
            {/*switch to upload mode */}
            <button
              onClick={() => setMode("upload")}
              className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              Upload Bill
            </button>
          </div>
          <p className="text-gray-400 mb-4">
            Fill out all these required fields
          </p>
          <BillForm />
        </div>
      )}
    </div>
  );
}
