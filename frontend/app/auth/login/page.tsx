"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, TriangleAlert } from "lucide-react";
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
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-slate-800 via-purple-800 to-indigo-800
 relative overflow-hidden"
      >
        {/*content */}
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
      {/*login form */}
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
              <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-600">Sign in to continue</p>
            </div>

            {/*error msg*/}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
                <TriangleAlert size={20} />
                <span>{error}</span>
              </div>
            )}

            {/*form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/*email input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/*password input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/*submit btn */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>
            {/*divider */}
            <div className="relative">
              {/*horizontal line */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  New to BillMate?
                </span>
              </div>
            </div>

            {/*link to sign up*/}
            <div className="text-center">
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
