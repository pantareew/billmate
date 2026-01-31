"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader,
  DollarSign,
  Edit3,
  ArrowRight,
  Users,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";

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

//item type in a bill
interface Item {
  name: string;
  price: number;
}

//ui steps
type Step =
  | "upload"
  | "summary"
  | "splitType"
  | "group"
  | "itemAssign"
  | "review";

type SplitOption = {
  id: "even" | "item";
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  icon: string;
};

export default function NewBillPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload"); //first step is to upload
  const [splitType, setSplitType] = useState<"even" | "item" | null>(null); //split method
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState<{
    //data in a bill
    title: string;
    total: number;
    items: Item[];
  } | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false); //saving data to db
  const splitOptions: SplitOption[] = [
    {
      id: "even",
      title: "Split Evenly",
      description: "Divide the total amount equally among all participants",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200 hover:border-blue-400",
      icon: "👥",
    },
    {
      id: "item",
      title: "Split by Item",
      description: "Assign specific items to each person for precise splitting",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200 hover:border-emerald-400",
      icon: "🧾",
    },
  ];

  //upload receipt
  useEffect(() => {
    if (!file || !currentUser) return;
    const upload = async () => {
      try {
        setLoading(true);
        //create formdata to send file
        const formData = new FormData();
        formData.append("receipt", file);
        //call backend to upload receipt file to storage
        const data = await apiFetch<any>("/bills/upload", {
          method: "POST",
          body: formData,
        });

        //store data from ai extract as editable draft
        setBillData({
          title: data.title,
          total: data.total_amount,
          items: data.items || [],
        });
        setStep("summary"); //data summary from ai extraction
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    upload();
  }, [file, currentUser]);
  //get groups of the user
  useEffect(() => {
    if (step !== "group" || !currentUser) return;
    const loadGroups = async () => {
      const data = await apiFetch<Group[]>(`/groups?user_id=${currentUser.id}`);
      setGroups(data);
    };

    loadGroups();
  }, [step, currentUser]);
  //load group's members when group is selected
  useEffect(() => {
    if (!selectedGroup) return; //need to select group first

    const loadMembers = async () => {
      //api returns array of users obj
      const data = await apiFetch<User[]>(`/groups/${selectedGroup}/members`);
      //set all members of the group for rendering
      const users = data.map((item: any) => item.users);
      setMembers(users);
      //get only user id of all members
      const allUserIds = data.map((item: any) => item.users.id);
      //pre-select all members in the group
      setSelectedMembers(allUserIds);
    };

    loadMembers();
  }, [selectedGroup]);

  //save data to db
  const handleSave = async () => {
    if (!billData || !selectedGroup) return;

    try {
      setSaving(true);

      await apiFetch("/bills/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...billData,
          group_id: selectedGroup,
          shared_users: selectedMembers.filter((id) => id !== currentUser?.id), //exclude payer
        }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/*upload */}
        {step === "upload" && (
          <div className="space-y-6">
            {/*header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent capitalize">
                Upload your bill
              </h2>
              <p className="text-gray-600 text-lg">
                Upload a photo and let AI handle the rest!
              </p>
            </div>
            {/*upload area */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
              <div
                className={`relative border-2 border-dashed rounded-3xl m-6 transition-all duration-300 cursor-pointer ${
                  file
                    ? "border-blue-300 bg-blue-50/30"
                    : "border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/20"
                }`}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <div className="p-12">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-18 h-15 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
                      <Camera className="text-blue-600" size={40} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-gray-900">
                        Click to upload receipt
                      </p>
                      <p className="text-sm text-gray-500">
                        or drag and drop your file here
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <span>PNG, JPG up to 10MB</span>
                    </div>
                  </div>

                  {loading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                      <div className="text-center space-y-4">
                        <div className="relative inline-flex">
                          <Loader
                            className="animate-spin text-blue-600"
                            size={48}
                          />
                          <div className="absolute inset-0 animate-ping">
                            <Loader
                              className="text-blue-400 opacity-20"
                              size={48}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-gray-900">
                            Processing with AI...
                          </p>
                          <p className="text-sm text-gray-500">
                            Extracting bill details
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        )}
        {/*data summary from ai*/}
        {step === "summary" && billData && file && (
          <div className="space-y-4">
            {/*header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Receipt Summary
              </h2>
              <p className="text-gray-600 text-lg">
                Review and edit the extracted details
              </p>
            </div>

            {/*summary card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden mb-8">
              <div className="p-6 space-y-4">
                {/*receipt preview */}
                <img
                  src={URL.createObjectURL(file)}
                  alt="Receipt preview"
                  className="max-h-60 w-full object-contain"
                />
                {/*title input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Edit3 size={16} className="text-gray-400" />
                    Bill Description
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white px-5 py-2 rounded-2xl transition-all duration-300 outline-none text-gray-900 font-medium shadow-sm focus:shadow-md"
                      value={billData.title}
                      onChange={(e) =>
                        setBillData(
                          (item) => item && { ...item, title: e.target.value }
                        )
                      }
                    />
                  </div>
                </div>

                {/*total input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <DollarSign size={16} className="text-gray-400" />
                    Total Amount
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </div>
                    <input
                      className="w-full bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 focus:border-blue-500 focus:bg-white pl-10 py-2 rounded-2xl transition-all duration-300 outline-none text-gray-900 font-medium shadow-sm focus:shadow-md"
                      type="number"
                      step="0.01"
                      value={billData.total}
                      onChange={(e) =>
                        setBillData(
                          (item) =>
                            item && {
                              ...item,
                              total: Number(e.target.value),
                            }
                        )
                      }
                    />
                  </div>
                </div>

                {/*continue button */}
                <div className="mt-4">
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-3 group"
                    onClick={() => setStep("splitType")}
                  >
                    Continue to Split Options
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/*split type*/}
        {step === "splitType" && (
          <div className="space-y-8">
            {/*header */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Choose Split Method
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                How would you like to divide this bill?
              </p>
            </div>
            {/*split options */}
            <div className="space-y-4">
              {splitOptions.map((option) => {
                return (
                  <button
                    key={option.id}
                    className={`w-full bg-white border-2 ${option.borderColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden`}
                    onClick={() => {
                      setSplitType(option.id);
                      setStep("group");
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-5">
                        {/*content */}
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                            {option.title}
                            <span className="text-2xl">{option.icon}</span>
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {option.description}
                          </p>
                        </div>

                        {/*arrow */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300">
                            <ArrowRight
                              className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                              size={20}
                            />
                          </div>
                        </div>
                      </div>

                      {/*decorative gradient bar */}
                      <div
                        className={`h-1 bg-gradient-to-r ${option.gradient} mt-6 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/*select group */}
        {step === "group" && (
          <div className="space-y-4">
            {/*header */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Select Group & Participants
              </h2>
              <p className="text-gray-600 text-lg">
                Choose your group and who's splitting the bill
              </p>
            </div>

            {/*groups selection */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 px-8 py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Your Groups
              </h3>
              <div className="space-y-3">
                {groups.map((group) => {
                  const isSelected = selectedGroup === group.id;
                  return (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`px-4 py-2 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
            ${
              isSelected
                ? "showdow-lg border-purple-500"
                : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
            }`}
                    >
                      <div className="flex items-center gap-4">
                        {/*user icon */}
                        <div
                          className={`w-10 h-10 ${
                            isSelected
                              ? "bg-gradient-to-br from-purple-500 to-pink-600"
                              : "bg-gray-100"
                          } rounded-xl flex items-center justify-center transition-all duration-300 ${
                            !isSelected && "group-hover:bg-gray-200"
                          }`}
                        >
                          <Users
                            className={
                              isSelected ? "text-white" : "text-gray-400"
                            }
                            size={24}
                          />
                        </div>
                        {/*group name */}
                        <h4
                          className={`font-bold text-lg ${
                            isSelected ? "text-purple-600" : "text-gray-900"
                          }`}
                        >
                          {group.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/*members selection*/}
            {selectedGroup && members.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 px-8 py-6 space-y-4">
                {/*header */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Select Participants
                  </h3>
                  <p className="text-sm text-gray-500">
                    Choose who's sharing this bill ({selectedMembers.length}{" "}
                    selected)
                  </p>
                </div>
                {/*members name */}
                <div className="flex flex-wrap gap-3">
                  {members.map((m) => {
                    const checked = selectedMembers.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() =>
                          setSelectedMembers((prev) =>
                            checked
                              ? prev.filter((id) => id !== m.id)
                              : [...prev, m.id]
                          )
                        }
                        className={`group relative px-5 py-2 rounded-2xl border-2 font-medium transition-all duration-300 flex items-center gap-3 ${
                          checked
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/*continue btn */}
            {selectedGroup && selectedMembers.length > 0 && (
              <button
                className="w-full bg-gradient-to-b from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-3 group"
                onClick={() => {
                  if (splitType === "even") {
                    setStep("review");
                  }

                  if (splitType === "item") {
                    setStep("itemAssign");
                  }
                }}
              >
                Continue
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            )}
          </div>
        )}
        {/*edit items */}
        {step === "itemAssign" && billData && (
          <div className="space-y-3">
            {billData.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="border p-1 flex-1"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...billData.items];
                    copy[i].name = e.target.value;

                    setBillData({
                      ...billData,
                      items: copy,
                    });
                  }}
                />

                <input
                  className="border p-1 w-24"
                  type="number"
                  value={item.price}
                  onChange={(e) => {
                    const copy = [...billData.items];
                    copy[i].price = Number(e.target.value);

                    setBillData({
                      ...billData,
                      items: copy,
                    });
                  }}
                />
              </div>
            ))}

            <button className="btn-primary" onClick={() => setStep("review")}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
