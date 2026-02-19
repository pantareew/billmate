"use client";

import { useState } from "react";

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
}
