"use client";

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
  onComplete: (result: Record<string, number>) => void; //member, totals
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
}
