"use client";
import BillCard from "@/components/BillCard";
import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";

type BillShare = {
  user_id: string;
  user_name: string;
  amount_owed: number;
  paid: "paid" | "unpaid" | "pending";
  paid_at: string | null;
  receipt: string | null;
};

type BillCardData = {
  id: string;
  title: string;
  group_name: string;
  total_amount: number;
  created_at: string;
  payer_id: string;
  payer_name: string;
  my_status?: "paid" | "unpaid" | "pending"; //ower status
  shares?: BillShare[]; //for payer to view owers
};

export default function DashboardPage() {
  const { currentUser } = useUser();
  const [bills, setBills] = useState<BillCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    async function loadDashboard() {
      try {
        //call backend
        const data = await apiFetch<{ bills: BillCardData[] }>(
          `/bills?user_id=${currentUser.id}`
        );
        setBills(data.bills);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [currentUser]);
  if (!currentUser) return <p>Please log in</p>;
  if (loading) return <p>Loading dashboard...</p>;
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* recent bills */}
      <div>
        <h2 className="text-lg font-bold mb-3">Recent Bills</h2>

        {bills.length === 0 ? (
          <p className="text-sm text-gray-500">No bills found</p>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                currentUserId={currentUser.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
