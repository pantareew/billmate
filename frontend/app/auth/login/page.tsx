"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  //set state variables and functions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  //handle login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true); //loading user
    setError("");
    //supabase checks credentials
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center grid grid-cols-1 xl:grid-cols-2">
      {/*left visual section */}
      <div className="hidden xl:flex bg-gradient-to-br from-violet-600 to-[#ea6149] text-white p-10 xl:h-full">
        <LeftVisual />
      </div>
      {/*login form */}
      <div className="flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-md flex flex-col gap-4"
        >
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto mb-4"
            />
          </Link>
          {/*error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="border border-[#6e3fe6] p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-[#6e3fe6] p-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-md py-2 font-semibold cursor-pointer">
            Login
          </button>
          <p>
            Not a member?{" "}
            <Link
              href={"/auth/signup"}
              className="font-semibold text-violet-500 hover:text-violet-600"
            >
              Register Now
            </Link>
          </p>
        </form>
      </div>
      {/*<form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 flex flex-col gap-4"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-[#6e3fe6] p-2 rounded-md"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-[#6e3fe6] p-2 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="cursor-pointer bg-[#7a46ff] text-white p-2 rounded-md">
          Login
        </button>
      </form>*/}
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
          <p className="font-semibold text-white text-lg">Supermarket</p>
          <p className="text-sm text-gray-200">12/12/2025</p>
          <div className="border-t border-white/30 pt-2 space-y-1">
            <div className="flex justify-between text-white text-sm">
              <span>Apples</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-white text-sm">
              <span>Bread</span>
              <span>$3.50</span>
            </div>
            <div className="flex justify-between text-white text-sm">
              <span>Milk</span>
              <span>$2.80</span>
            </div>
          </div>
          <div className="border-t border-white/50 pt-2 flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>$11.30</span>
          </div>
        </div>
        {/*charts */}
        <div className="bg-white/10 p-5 rounded-xl space-y-4 flex-1 space-y-3 min-w-[300px]">
          <TrackBar label="Alex owes you" value={24.5} />
          <TrackBar label="You owe Sam" value={18.2} />
          <TrackBar label="Shared dinner" value={42.0} />
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
