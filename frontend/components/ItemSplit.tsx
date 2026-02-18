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
  //track which members are assigned to which item
  const [assign, setAssign] = useState<
    Record<string, string[]> //itemId, members
  >(() => Object.fromEntries(items.map((item) => [item.id, []]))); //{itemId: []}
}
