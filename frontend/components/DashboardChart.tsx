"use client";

import { useUser } from "@/context/UserContext";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type PersonAmount = {
  name: string;
  amount: number;
};

type SummaryDetail = {
  you_owe: PersonAmount[];
  owed_you: PersonAmount[];
};

export default function DashboardChart() {
  const { currentUser } = useUser();
  const [summary, setSummary] = useState<SummaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  //get data from database
  useEffect(() => {
    if (!currentUser) return;
    async function loadSummary() {
      try {
        const data = await apiFetch<SummaryDetail>(
          `/bills/summary?user_id=${currentUser.id}`
        );
        setSummary(data);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [currentUser]); //update summary when user changes

  if (!currentUser) return;
  if (loading)
    return <p className="text-sm text-gray-500">Loading bill summary...</p>;
  if (!summary) return <p>No bill summary found</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full pt-6">
      {/*user owes others */}
      <div className="flex-1 w-full bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-2 text-[#4f46e5] text-center">
          You Owe Others
        </h3>
        {summary.you_owe.length === 0 ? (
          <p className="text-gray-500 text-sm">You owe nobody!</p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.you_owe}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "$ Amount",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  labelFormatter={(label) => (
                    <span className="text-gray-400 font-medium">{label}</span>
                  )}
                />
                <Bar dataKey="amount" fill="#4f46e5" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/*others owe you */}
      <div className="flex-1 w-full bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-2 text-[#ec4899] text-center">
          Others Owe You
        </h3>
        {summary.owed_you.length === 0 ? (
          <p className="text-gray-500 text-sm">Nobody owes you!</p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.owed_you}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "$ Amount",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  labelFormatter={(label) => (
                    <span className="text-gray-400 font-medium">{label}</span>
                  )}
                />{" "}
                <Bar dataKey="amount" fill="#ec4899" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
