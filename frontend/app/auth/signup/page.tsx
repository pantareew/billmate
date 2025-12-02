"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
