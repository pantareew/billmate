import { supabase } from "@/lib/supabaseClient";

async function handleSignup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert(error.message);
  } else {
    alert("Signup successful! Check your email to confirm.");
  }
}
