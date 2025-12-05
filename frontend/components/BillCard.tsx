"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";

type Share = {
  user_id: string;
  user_name: string;
  amount_owed: number;
  paid: "paid" | "unpaid" | "pending"; //shares can only have one of these status
};

type BillCardProps = {
  bill: {
    id: string;
    title: string;
    group_name: string;
    total_amount: number;
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
  const isPayer = bill.payer_id === currentUserId; //check if currentUser is payer of the bill
  //approve receipt as a payer
  const handleApproveReceipt = async (share: Share) => {
    //call backend to mark paid for this share
    try {
      const res = await apiFetch<{ paid: "paid" | "unpaid" | "pending" }>(
        `/bills/${bill.id}/approve`,
        {
          method: "POST",
          body: JSON.stringify({ user_id: share.user_id }),
        }
      );
      //update UI
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
  const handlePayNow = async () => {
    //upload receipt then mark as pending
    try {
      const res = await apiFetch<{ paid: "pending" }>(`/bills/${bill.id}/pay`, {
        method: "POST",
        body: JSON.stringify({ user_id: currentUserId, receipt: "dummy_url" }),
      });
      setMyStatus(res.paid);
    } catch (err: any) {
      alert(err.message);
    }
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
          )}
        </div>
      </div>

      {isPayer && shares.length > 0 && (
        <div className="mt-3">
          <ul className="space-y-1">
            {shares.map((s) => (
              <li key={s.user_id} className="flex justify-between items-center">
                <span>
                  {s.user_name}: {s.paid} {/*show shares status */}
                </span>
                {/*approve pending status */}
                {s.paid === "pending" && (
                  <button
                    className="text-blue-600 text-sm underline"
                    onClick={() => handleApproveReceipt(s)}
                  >
                    Approve
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/*show Pay now button for ower bill */}
      {!isPayer && myStatus === "unpaid" && (
        <div className="mt-3">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={handlePayNow}
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
