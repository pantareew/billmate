"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

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
    } else {
      alert("Signup successful! Check your email to confirm.");
    }
  }
  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 p-4 max-w-sm mx-auto"
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
  );
}
