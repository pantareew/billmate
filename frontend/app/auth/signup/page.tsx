"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    //create user in auth.users
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
    if (error) {
      alert(error.message);
      return;
    }
    //check for valid user before inserting into public.users
    if (!data.user) {
      alert("Signup failed: No user returned");
      return;
    }
    //insert user into public.users
    await supabase.from("users").insert({
      id: data.user.id, //get id of the newly created user
      name: displayName,
    });
    alert("Signup successful!");
  }
  return (
    <div className="min-h-screen flex items-center justify-center grid grid-cols-1 xl:grid-cols-2">
      {/*left visual section */}
      <div className="hidden xl:flex bg-gradient-to-br from-violet-600 to-[#ea6149] text-white p-10 xl:h-full">
        <LeftVisual />
      </div>
      {/*signup form */}
      <div className="flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-md flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Display Name"
            className="border p-2"
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

function LeftVisual() {
  return (
    <div className="max-w-md flex flex-col justify-center gap-8">
      <h2 className="text-3xl font-bold leading-tight">
        Split bills
        <br />
        Track debts
        <br />
        <span className="flex items-center">
          Processed by AI <Sparkles size={25} className="mx-3" />
        </span>
      </h2>
      <div className="flex gap-10">
        {/*receipt */}
        <div className="bg-white/10 p-5 rounded-xl flex-1 space-y-3 min-w-[300px] space-y-3">
          <p className="font-semibold text-white text-lg">Gigi's Party</p>
          <p className="text-sm text-gray-200">12/12/2025</p>
          <div className="border-t border-white/30 pt-2 space-y-1">
            <div className="flex justify-between text-white text-sm">
              <span>Pizzas</span>
              <span>$45.00</span>
            </div>
            <div className="flex justify-between text-white text-sm">
              <span>Coca Cola</span>
              <span>$20</span>
            </div>
            <div className="flex justify-between text-white text-sm">
              <span>Garlic Bread</span>
              <span>$24.50</span>
            </div>
          </div>
          <div className="border-t border-white/50 pt-2 flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>$89.50</span>
          </div>
        </div>
        {/*charts */}
        <div className="bg-white/10 p-5 rounded-xl space-y-4 flex-1 space-y-3 min-w-[300px]">
          <TrackBar label="Chris owes you" value={26.5} />
          <TrackBar label="You owe Ann" value={16.4} />
          <TrackBar label="Movie night" value={38.0} />
        </div>
      </div>
    </div>
  );
}

function TrackBar({ label, value }: { label: string; value: number }) {
  const maxValue = 50;
  const widthPercent = Math.min((value / maxValue) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm opacity-90">
        <span>{label}</span>
        <span>${value.toFixed(2)}</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full">
        <div
          className="h-2 bg-white rounded-full"
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}
