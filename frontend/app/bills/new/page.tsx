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
    <div className="max-w-3xl mx-auto px-6 space-y-6 pt-6 pb-15 mt-5 mb-20 bg-white rounded-xl shadow-md">
      {/*upload mode */}
      {mode === "upload" ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-600">Upload Bill</h2>
            {/*toggle to manual mode */}
            <button
              onClick={() => setMode("manual")}
              className="border-[#146ff7] border-2 text-[#146ff7] hover:bg-[#146ff7] hover:text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Create Bill Manually
            </button>
          </div>
          <p className="text-gray-500 mb-2">
            Just upload your receipt, and our AI will process it for you!
          </p>
          {/*upload area */}
          {/*when this div box is clicked, it will open (from .click()) element with id fileInput (which is input type file)*/}
          <div
            className="border-2 border-dashed border-[#146ff7] bg-blue-50 rounded-md px-20 py-5 flex flex-col items-center justify-center cursor-pointer mb-6"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {/*preview the selected file or upload the file*/}
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Receipt Preview"
                className="max-h-80"
              />
            ) : (
              <div className="text-center py-30">
                <Camera size={40} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 mb-1"> Click to upload receipt</p>
                <p className="text-gray-400/70 text-sm">
                  Only accept image file type (PNG, JPG, JPEG)
                </p>
              </div>
            )}
            {loading && (
              <p className="text-amber-500 flex items-center gap-2 my-4">
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
              <div className="bg-[#5b85f4] border border-[#a1b9f9] rounded-xl p-4 mt-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2 font-semibold text-white">
                  <CircleCheckBig size={20} />
                  <h3 className="text-md">Receipt Extracted</h3>
                </div>
                <p className="text-white flex justify-between text-sm">
                  <span className="font-medium">Merchant: </span>
                  <span>{aiResult.title}</span>
                </p>
                <p className="text-white flex justify-between text-sm mt-1">
                  <span className="font-medium">Total: </span>
                  <span>${aiResult.total_amount}</span>
                </p>
              </div>
              {/*show groups for selection */}
              <div>
                <h3 className="text-md font-semibold mt-3 mb-2 text-gray-700">
                  Select a group
                </h3>
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-4 rounded-lg cursor-pointer border-2 transition shadow-sm text-[15px] ${
                        selectedGroup === group.id
                          ? "border-violet-400/80 bg-violet-400 text-white"
                          : "border-violet-400/80 bg-white hover:bg-violet-400 hover:border-violet-400/80 hover:text-white text-violet-600"
                      }`}
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <p className="font-medium">{group.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/*select users */}
              <div>
                <h3 className="text-md font-semibold mt-3 mb-2 text-gray-700">
                  Split Among
                </h3>
                <div className="flex space-x-6">
                  {members.map((member) => {
                    const isChecked = selectedMembers.includes(member.id); //check if user is in selectedMembers array
                    return (
                      <label
                        key={member.id}
                        className={`px-4 py-1 rounded-full cursor-pointer shadow-sm border text-sm ${
                          isChecked
                            ? "bg-[#cc8cb6] text-white border-[#cc8cb6] hover:bg-white hover:text-[#cc8cb6]"
                            : "bg-white text-[#cc8cb6] hover:bg-[#cc8cb6] hover:text-white hover:border-[#cc8cb6]"
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
              {/*split and create bill button*/}
              {selectedGroup && selectedMembers.length > 0 && (
                <button
                  className="float-right bg-indigo-500 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-indigo-600"
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
              className="border-[#146ff7] border-2 text-[#146ff7] hover:bg-[#216edf] hover:text-white px-4 py-2 rounded cursor-pointer"
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
