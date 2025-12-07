"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

type BillSummary = {
  you_owe: number;
  owed_you: number;
};

export default function DashboardChart() {
  const { currentUser } = useUser();
  const [summary, setSummary] = useState<BillSummary | null>(null);
  //get data from database
  useEffect(() => {
    if (!currentUser) return;
    async function loadSummary() {
      try {
        const data = await apiFetch<BillSummary>(
          `/bills/summary?user_id=${currentUser.id}`
        );
        setSummary(data);
      } catch (err: any) {
        alert(err.message);
      }
    }
    loadSummary();
  }, [currentUser]); //update summary when user changes
  if (!currentUser) return;
  if (!summary) return null;
  return (
    <div className="grid grid-cols-2 gap-4">
      {/*amount thae user owe*/}
      <div className="rounded-xl border p-4 bg-white shadow-sm">
        <p className="text-sm text-gray-500 mb-1">You owe others</p>
        <p className="text-2xl font-bold text-red-500">
          ${summary.you_owe.toFixed(2)}
        </p>
      </div>

      {/*amount others owed user */}
      <div className="rounded-xl border p-4 bg-white shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Others owe you</p>
        <p className="text-2xl font-bold text-green-600">
          ${summary.owed_you.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
