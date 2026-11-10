
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
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send all three fields to our signup API.
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          code,
        }),
      });

      // Safely handle empty or invalid server responses.
      const responseText = await response.text();

      let result: {
        success?: boolean;
        error?: string;
      } = {};

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The signup server returned an invalid response."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Unable to create admin account."
        );
      }

      // Sign in with the newly created credentials.
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw new Error(
          "Account created, but automatic login failed. " +
          "Please sign in using the login page."
        );
      }

      // Open the administrator dashboard.
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

        <label htmlFor="code">
          Teacher-provided admin code
        </label>
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

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <p>
        Already have an account?{" "}
        <Link href="/admin/login">Sign in</Link>
      </p>
    </main>
  );
}
