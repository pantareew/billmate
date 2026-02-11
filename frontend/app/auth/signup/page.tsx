"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
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
      setError(error.message);
      setIsLoading(false);
      return;
    }
    //check for valid user before inserting into public.users
    if (!data.user) {
      alert("Signup failed");
      return;
    } else {
      //insert user into public.users
      await supabase.from("users").insert({
        id: data.user.id, //get id of the newly created user
        name: displayName,
      });
      router.push("/dashboard");
    }
  }
  return (
    <div className="min-h-screen flex">
      {/*left section */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-slate-800 via-purple-800 to-indigo-800
 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/*logo */}
          <div className="mb-8">
            <Link href={"/"}>
              <Image src="/logo-main.png" alt="Logo" width={150} height={150} />
            </Link>
          </div>

          {/*headline */}
          <h1 className="text-5xl font-black leading-tight mb-6">
            Split bills
            <br />
            Track debts
            <br />
            <span className="flex items-center gap-3 bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Powered by AI
              <Sparkles size={32} className="text-pink-300" />
            </span>
          </h1>

          <p className="text-xl text-gray-100 mb-12 max-w-md">
            The smart way to split expenses with friends, roommates, and
            colleagues
          </p>
        </div>
      </div>
      {/*right section*/}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          {/*mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href={"/"}>
              <Image src="/logo-main.png" alt="Logo" width={150} height={150} />
            </Link>
          </div>
          {/*form card */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 space-y-6">
            {/*header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Welcome!</h2>
              <p className="text-gray-600">Let’s set up your account</p>
            </div>

            {/*error msg*/}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
                <TriangleAlert size={20} />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSignup} className="space-y-5">
              {/*inputs */}
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <input
                type="email"
                value={email}
                placeholder="Email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                required
              />
              {/*submit btn */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating an account...</span>
                  </>
                ) : (
                  <>
                    <span>Create an account</span>
                  </>
                )}
              </button>
              <p className="text-gray-700">
                Already a member?
                <Link
                  href={"/auth/login"}
                  className="font-semibold text-violet-500 hover:text-indigo-700 px-2"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
