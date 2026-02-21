"use client";
import { useMemo } from "react";

type Member = {
  id: string;
  name: string;
};

type EvenSplitProps = {
  members: Member[];
  selectedMembers: string[];
  totalAmount: number;
  onComplete: (result: Record<string, number>) => void;
  onBack: () => void;
};

export default function EvenSplit({
  members,
  selectedMembers,
  totalAmount,
  onComplete,
  onBack,
}: EvenSplitProps) {
  //calculate totals
  const totals = useMemo(() => {
    const result: Record<string, number> = {};
    //no members selected
    if (selectedMembers.length === 0) return result;

    const perPerson = Number((totalAmount / selectedMembers.length).toFixed(2));
    selectedMembers.forEach((id) => {
      result[id] = perPerson;
    });
    return result;
  }, [selectedMembers, totalAmount]);
  //send totals to parent
  const handleConfirm = () => {
    onComplete(totals);
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Even Split Preview</h2>

      <div className="space-y-3">
        {members
          .filter((m) => selectedMembers.includes(m.id))
          .map((member) => (
            <div
              key={member.id}
              className="flex justify-between bg-gray-50 p-4 rounded-xl"
            >
              <span>{member.name}</span>
              <span className="font-semibold">
                ${totals[member.id]?.toFixed(2) ?? "0.00"}
              </span>
            </div>
          ))}
      </div>

      {/* buttons */}
      <div className="flex gap-4">
        <button onClick={onBack} className="flex-1 border rounded-xl py-3">
          Back
        </button>

        <button
          onClick={handleConfirm}
          className="flex-1 bg-blue-600 text-white rounded-xl py-3"
        >
          Confirm Split
        </button>
      </div>
    </div>
  );
}
