"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader, CircleCheckBig } from "lucide-react";
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
  | "group"
  | "splitType"
  | "even"
  | "item"
  | "review";

export default function NewBillPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload"); //first step is to upload
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
  //upload receipt
  useEffect(() => {
    if (!file || !currentUser) return;
    const upload = async () => {
      try {
        setLoading(true);
        //create formdata to send file
        const formData = new FormData();
        formData.append("receipt", file);
        formData.append("user_id", currentUser.id);
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
  //get groups after ai extraction
  useEffect(() => {
    if (!billData || !currentUser) return;
    const loadGroups = async () => {
      const data = await apiFetch<Group[]>(`/groups?user_id=${currentUser.id}`);
      setGroups(data);
    };

    loadGroups();
  }, [billData, currentUser]);
  //load group's members when group is selected
  useEffect(() => {
    if (!selectedGroup) return; //need to select group first

    const loadMembers = async () => {
      //api returns array of users obj
      const data = await apiFetch<User[]>(`/groups/${selectedGroup}/members`);
      //set all members of the group for rendering
      setMembers(data.map((item: any) => item.users));
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
                  {file ? (
                    <div className="space-y-4">
                      {/*show uploaded img */}
                      <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img
                          src={URL.createObjectURL(file)}
                          className="max-h-80 w-full object-contain bg-white"
                          alt="Receipt preview"
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}

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

        {/* ========== SUMMARY ========== */}

        {step === "summary" && billData && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Receipt Summary</h2>

            <input
              className="w-full border p-2 rounded"
              value={billData.title}
              onChange={(e) =>
                setBillData((p) => p && { ...p, title: e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded"
              type="number"
              value={billData.total}
              onChange={(e) =>
                setBillData(
                  (p) =>
                    p && {
                      ...p,
                      total: Number(e.target.value),
                    }
                )
              }
            />

            <button
              className="btn-primary"
              onClick={() => setStep("splitType")}
            >
              Continue
            </button>
          </div>
        )}

        {/* ========== SPLIT TYPE ========== */}

        {step === "splitType" && (
          <div className="space-y-4 text-center">
            <h2 className="font-semibold text-lg">How do you want to split?</h2>

            <button className="btn" onClick={() => setStep("even")}>
              Evenly
            </button>

            <button className="btn" onClick={() => setStep("item")}>
              By Item
            </button>
          </div>
        )}

        {/* ========== ITEM EDIT ========== */}

        {step === "item" && billData && (
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

        {/* ========== REVIEW ========== */}

        {step === "review" && billData && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Review</h2>

            <p>Merchant: {billData.title}</p>
            <p>Total: ${billData.total}</p>

            <h3 className="font-medium mt-3">Select Group</h3>

            {groups.map((g) => (
              <div
                key={g.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedGroup === g.id ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setSelectedGroup(g.id)}
              >
                {g.name}
              </div>
            ))}

            {selectedGroup && (
              <button
                disabled={saving}
                onClick={handleSave}
                className="btn-primary"
              >
                {saving ? "Saving..." : "Confirm & Save"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
