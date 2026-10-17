
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "Your password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        router.replace("/survey");
        router.refresh();
      } else {
        setSuccessMessage(
          "Account request received! Check your email for a confirmation link, then return to the login page."
        );
      }
    } catch {
      setErrorMessage(
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div
        className="info-card"
        style={{ maxWidth: 450, margin: "60px auto" }}
      >
        <h1>Create an Account</h1>

        <p>
          Join the Vermont Biodiversity community!
          Create an account to explore wildlife,
          complete the survey, and share sightings.
        </p>

        <form onSubmit={handleSignup}>
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            minLength={8}
            required
          />

          {errorMessage && (
            <p role="alert" style={{ color: "#b91c1c" }}>
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p role="status" style={{ color: "#276749" }}>
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/login">Sign In</Link>
        </p>
        <p style={{ marginTop: 12 }}>
  Helping manage the LEGO Club?{" "}
  <Link href="/admin/signup">
    Create an Administrator Account
  </Link>
</p>
      </div>
    </main>
  );
}
