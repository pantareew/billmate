"use client";

import BillForm from "@/components/BillForm";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, useEffect } from "react";
import { Camera } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function NewBillPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null); //temporary store uploaded file
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"manual" | "upload">("upload"); //toggling between two modes: upload bill and create bill manually

  //const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //if (!e.target.files || e.target.files.length === 0) return;
  //const selectedFile = e.target.files[0];
  //setFile(selectedFile);
  //setPreview(URL.createObjectURL(selectedFile));
  //};

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
        const data = await apiFetch<{ bill_id: string; receipt: string }>(
          "/bills/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        console.log("bill uploaded: ", data);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    uploadBill();
  }, [file]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
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
            {/*preview the selected file or ask user to upload the file*/}
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
                  Only accept image file type (PNG, JPG)
                </p>
              </div>
            )}
          </div>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
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
