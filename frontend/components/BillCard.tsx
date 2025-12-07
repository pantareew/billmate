"use client";

import { apiFetch } from "@/lib/api";
import { Camera } from "lucide-react";
import { useState } from "react";

type Share = {
  user_id: string;
  user_name: string;
  amount_owed: number;
  paid: "paid" | "unpaid" | "pending"; //shares can only have one of these status
  receipt?: string;
};

type BillCardProps = {
  bill: {
    id: string;
    title: string;
    group_name: string;
    total_amount: number;
    amount_owed: number;
    created_at: string;
    payer_id: string;
    payer_name: string;
    my_status?: "paid" | "unpaid" | "pending"; //ower status
    shares?: Share[]; //for payer
  };
  currentUserId: string;
};
export default function BillCard({ bill, currentUserId }: BillCardProps) {
  const [shares, setShares] = useState<Share[]>(bill.shares || []);
  const [myStatus, setMyStatus] = useState(bill.my_status || "unpaid"); //currentUser status for owing bill
  //receipt as ower
  const [showUpload, setShowUpload] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  //receipt as approver(payer)
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const isPayer = bill.payer_id === currentUserId; //check if currentUser is payer of the bill
  //approve receipt as a payer
  const handleApproveReceipt = async (share: Share) => {
    //call backend to mark paid for this share
    try {
      const res = await apiFetch<{ paid: "paid" }>(
        `/bills/${bill.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: share.user_id }),
        }
      );
      //update status for UI
      setShares((prev) =>
        prev.map((s) =>
          s.user_id === share.user_id ? { ...s, paid: res.paid } : s
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };
  //upload receipt as an ower to pay share
  const handleUploadReceipt = async () => {
    //check for receipt file
    if (!receiptFile) {
      alert("Please upload receipt");
      return;
    }
    //create form data to send to backend
    const formData = new FormData();
    formData.append("file", receiptFile); //actual receipt file
    formData.append("user_id", currentUserId); //user id of current user
    //upload receipt then mark as pending
    try {
      const res = await apiFetch<{ paid: "pending"; receipt_url: string }>(
        `/bills/${bill.id}/upload_receipt`,
        {
          method: "POST",
          body: formData,
        }
      );
      setMyStatus(res.paid); //set payment status for frontend
      closeUpload();
    } catch (err: any) {
      alert(err.message);
    }
  };
  //close upload popup
  const closeUpload = () => {
    setShowUpload(false); // close modal
    setReceiptFile(null); // reset selected file
  };
  return (
    <div className="border p-4 rounded-md shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold">{bill.title}</h3>
          <p className="text-sm text-gray-500">{bill.group_name}</p>
          <p className="text-sm">
            Total: ${bill.total_amount.toFixed(2)} | Created:{" "}
            {new Date(bill.created_at).toLocaleDateString()}
          </p>
          {bill.payer_id !== currentUserId && <p>Payer: {bill.payer_name}</p>}
        </div>
        <div>
          {isPayer ? (
            <p className="text-sm font-medium text-blue-600">
              {/*show how many ppl have paid */}
              {shares.filter((s) => s.paid === "paid").length} / {shares.length}{" "}
              paid
            </p>
          ) : (
            <div>
              {/*showing how much currentUser owed in ower bill */}
              <p className="text-sm text-gray-600 mt-1">
                ${bill.amount_owed.toFixed(2)} per person
              </p>
              <p
                className={`text-sm font-medium ${
                  myStatus === "paid"
                    ? "text-green-600"
                    : myStatus === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {/*show my status as an ower */}
                {myStatus.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
      {/*show approve option for pending shares */}
      {isPayer && shares.length > 0 && (
        <div className="mt-3">
          <ul className="space-y-1">
            {shares.map((s) => (
              <li key={s.user_id} className="flex justify-between items-center">
                <span>
                  {s.user_name}: ${s.amount_owed.toFixed(2)} - {s.paid}{" "}
                  {/*show shares status */}
                </span>
                {/*approve pending status */}
                {s.paid === "pending" && (
                  <button
                    className="text-blue-600 text-sm underline"
                    onClick={() => {
                      console.log("Selected share:", s);
                      console.log("Receipt URL:", s.receipt);
                      setSelectedShare(s); //update share user
                      setShowReceipt(true); //show receipt popup
                    }}
                  >
                    Approve
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/*show receipt popup for approval */}
      {showReceipt && selectedShare && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-cyan-500 p-4 rounded-md max-w-md w-full relative">
            <h3 className="text-lg font-semibold text-center mb-4">
              Receipt from {selectedShare.user_name}
            </h3>
            <div className="border-2 border-dashed border-gray-300 p-4 flex flex-col items-center">
              <img
                src={selectedShare.receipt}
                alt="Receipt"
                className="max-h-96 object-contain mb-4"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="ml-2 bg-red-300 px-3 py-1 rounded mx-3 cursor-pointer"
                onClick={() => setShowReceipt(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                onClick={async () => {
                  await handleApproveReceipt(selectedShare);
                  setShowReceipt(false);
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
      {/*show Pay now button for ower bill */}
      {!isPayer && myStatus === "unpaid" && (
        <div className="mt-3">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
            onClick={() => setShowUpload(true)}
          >
            Pay Now
          </button>
        </div>
      )}
      {/*show popup to upload receipt */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-cyan-500 w-[400px] rounded-xl p-5 shadow-lg relative">
            {/*title */}
            <h2 className="text-lg font-semibold text-center mb-4">
              Upload Receipt
            </h2>
            {/*upload box */}
            <label
              htmlFor="receipt-upload"
              className="border-2 border-dashed border-gray-300 rounded-lg h-52 flex flex-col items-center justify-center cursor-pointer"
            >
              {/*show uploaded file if exists */}
              {receiptFile ? (
                <img
                  src={URL.createObjectURL(receiptFile)}
                  alt="Receipt preview"
                  className="max-h-48 object-contain rounded-md"
                />
              ) : (
                <>
                  <Camera size={28} />
                  <p className="text-sm text-gray-100 my-3">
                    Click to upload receipt
                  </p>
                </>
              )}
            </label>
            {/*upload file */}
            <input
              id="receipt-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)} //file is File or null
            />
            {/*action button */}
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={closeUpload}
                className="px-4 py-2 rounded-md bg-red-400 text-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUploadReceipt}
                className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50 cursor-pointer"
              >
                Upload Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
