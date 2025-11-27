"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  //set state variables and functions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //handle login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    //supabase checks credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    //credentials are correct
    else {
      localStorage.setItem("token", data.session?.access_token!);
      alert("Logged in!");
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
}
