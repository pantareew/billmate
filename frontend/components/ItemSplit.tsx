"use client";

import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";

type Member = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  name: string;
  price: number;
};

type ItemSplitProps = {
  items: Item[];
  members: Member[];
  onComplete: (result: Record<string, number>) => void; //passing {member:total} to parent
};

export default function ItemSplit({
  items,
  members,
  onComplete,
}: ItemSplitProps) {
  //state var to track which members are assigned to an item
  const [assign, setAssign] = useState<
    Record<string, string[]> //itemId, members
  >(() => Object.fromEntries(items.map((item) => [item.id, []]))); //{itemId: []}
  const [expandSum, setExpandSum] = useState(true);
  //toggle assign when click a member on an item
  const toggleAssign = (itemId: string, memberId: string) => {
    //update assign var
    setAssign((prev) => {
      const current = prev[itemId] || []; //get current members of that item
      const updated = current.includes(memberId) //check if clicked member is already selected
        ? current.filter((id) => id !== memberId) //remove member if already selected
        : [...current, memberId]; //add member if not
      return { ...prev, [itemId]: updated }; //crete a new state object (to re render UI) and overwrite value for itemId with updated members
    });
  };

  //calculate totals for each person
  const totals = useMemo(() => {
    //use useMemo to calculates and returns a value
    const result: Record<string, number> = {}; //initiate var
    members.forEach((m) => (result[m.id] = 0)); //set initial totals for each member
    items.forEach((item) => {
      const assigned = assign[item.id]; //get members[] assigned to an item
      if (!assigned || assigned.length === 0) return; //no members assigned to an item
      const splitAmount = item.price / assigned.length; //price divided by amount of assigned members
      assigned.forEach((memberId) => {
        result[memberId] += splitAmount; //add splitAmount of an item to totals of each person
      });
    });
    return result;
  }, [assign, items, members]); //recalculate when dependencies change
  //send totals to parent component after finish assigning items
  const handleConfirm = () => {
    onComplete(totals);
  };
  //member initials
  const getMemberInitial = (name: string) => name.charAt(0).toUpperCase();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/*header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Assign Items</h1>
          <p className="text-gray-600">
            Tap each person's name to assign them to an item
          </p>
        </div>
        {/*item list */}
        <div className="space-y-4">
          {items.map((item) => {
            const assignedMembers = assign[item.id] || [];
            const isAssigned = assignedMembers.length > 0;
            const sharePerPerson = isAssigned
              ? item.price / assignedMembers.length
              : item.price;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 border-2 ${
                  isAssigned
                    ? "border-purple-200 shadow-purple-100"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {/*item info */}
                <div className="px-6 py-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    {/*item name */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      {isAssigned && (
                        <p className="text-sm text-gray-500">
                          ${sharePerPerson.toFixed(2)} per person ×{" "}
                          {assignedMembers.length}
                        </p>
                      )}
                    </div>
                    {/*item price */}
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                      {!isAssigned && (
                        <p className="text-xs text-red-500 font-semibold flex items-center gap-1 justify-end mt-1">
                          <AlertCircle size={14} />
                          Not assigned
                        </p>
                      )}
                    </div>
                  </div>
                  {/*member selection */}
                  <div className="flex flex-wrap gap-3">
                    {members.map((member) => {
                      const selected = assign[item.id]?.includes(member.id); //check if a member is in assigned item member's array
                      return (
                        <button
                          key={member.id}
                          onClick={() => toggleAssign(item.id, member.id)}
                          className={`group flex items-center gap-2.5 px-4 py-2 rounded-full font-semibold transition-all duration-200
                      ${
                        selected
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                              selected
                                ? "bg-white/20 text-white"
                                : `bg-gradient-to-br from-orange-500 to-pink-600 text-white`
                            }`}
                          >
                            {getMemberInitial(member.name)}
                          </div>
                          <span className="text-sm">{member.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/*summary */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border-2 border-gray-100 overflow-hidden">
        <button
          onClick={() => setExpandSum(!expandSum)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900">Split Summary</h3>
              <p className="text-sm text-gray-500">Per person breakdown</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900">Split Summary</h3>
          {members.map((member) => (
            <div key={member.id} className="flex justify-between text-gray-700">
              <span>{member.name}</span>
              <span className="font-semibold">
                ${totals[member.id].toFixed(2)}
              </span>
            </div>
          ))}
        </button>
      </div>
      {/*confirm btn */}
      <div className="text-center">
        <button
          onClick={handleConfirm}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
        >
          Confirm Split
        </button>
      </div>
    </div>
  );
}
