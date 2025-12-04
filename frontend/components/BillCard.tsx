"use client";

import { useRouter } from "next/navigation";

type Bill = {
  id: string;
  title: string;
  group_name: string;
  total_amount: number;
  created_at: string;
  payer_id: string;
  payer_name: string;
  total_owers: number; //amount of ppl who share the bill
  paid_count: number; //amount of ppl who already paid
  my_status?: "paid" | "unpaid" | "pending"; //ower status
};
type BillCardProps = {
  bill: Bill;
  currentUserId: string;
};
export default function BillCard({ bill, currentUserId }: BillCardProps) {
  const router = useRouter();
  const isPayer = bill.payer_id === currentUserId;
  return (
    <div
      onClick={() => router.push(`/bills/${bill.id}`)} //route to bill detail page
      className="rounded-xl border bg-white p-4 shadow hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{bill.title}</h3>
        <span className="text-sm text-gray-500">{bill.group_name}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span>Total: ${bill.total_amount.toFixed(2)}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Paid by <span className="font-medium">{bill.payer_name}</span>
      </p>
      {/*determine if the currentUser is payer or ower */}
      {isPayer ? (
        <p className="text-sm font-medium text-blue-600">
          {bill.paid_count} / {bill.total_owers} paid{" "}
          {/*show how many ppl have paid out of total amount*/}
        </p>
      ) : (
        <p
          className={`text-sm font-medium ${
            bill.my_status === "paid"
              ? "text-green-600"
              : bill.my_status === "pending"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          Status: {bill.my_status}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-2">
        {new Date(bill.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
