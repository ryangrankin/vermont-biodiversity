
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import WildlifeSightingForm from "@/app/components/WildlifeSightingForm";

export default function AdminNewSightingPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function verifyAdmin() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          router.replace("/admin/login");
          return;
        }

        const response = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Administrator access required.");
        }

        const result = await response.json();

        if (!result.authorized) {
          throw new Error("Administrator access required.");
        }

        if (!cancelled) setAuthorized(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to verify administrator."
          );
        }
      }
    }

    verifyAdmin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return <main style={{ padding: 24 }}><p>{error}</p></main>;
  }

  if (!authorized) {
    return <main style={{ padding: 24 }}><p>Checking administrator access...</p></main>;
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <button
        type="button"
        onClick={() => router.push("/admin")}
        style={{ marginBottom: 24 }}
      >
        ← Back to Admin Dashboard
      </button>

      <h1>Upload Wildlife Sighting</h1>
      <p>
        Add wildlife photographs or videos to the LEGO Club gallery.
      </p>

      <WildlifeSightingForm />
    </main>
  );
}
