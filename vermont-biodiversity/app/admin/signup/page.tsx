
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminSignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
     // Try signing in first if the student already has an account.
const { data: loginData, error: authError } =
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

let session = loginData.session;

if (authError || !session) {
  const signup = await supabase.auth.signUp({
    email,
    password,
  });

  if (signup.error) {
    throw new Error(signup.error.message);
  }

  session = signup.data.session;
}

if (!session) {
  throw new Error(
    "No active session. Please check your account and try again."
  );
}

      // Email confirmation may be required.
      if (!session) {
  throw new Error(
    "Account created, but no session was returned. Please sign in."
  );
}

      // Redeem the shared administrator code.
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to activate admin access.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Signup failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-signup-container">
      <h1>LEGO Club Administrator Signup</h1>

      <p>
        Create an account using the administrator code
        provided by your teacher.
      </p>

      <form onSubmit={handleSignup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />

        <label htmlFor="code">Teacher-provided admin code</label>
        <input
          id="code"
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoComplete="off"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Admin Account"}
        </button>
      </form>

      {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
      {message && <p role="status">{message}</p>}

      <p>
        Already have an account?{" "}
        <Link href="/admin/login">Sign in</Link>
      </p>
    </main>
  );
}
