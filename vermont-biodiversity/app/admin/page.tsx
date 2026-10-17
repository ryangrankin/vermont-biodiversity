
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SightingPhoto from "./SightingPhoto";

type Sighting = {
  id: string;
  species: string;
  description: string | null;
  observed_at: string;
  location: string;
  photo_path: string | null;
  created_at: string;
};

type DashboardStatus =
  | "loading"
  | "authorized"
  | "denied"
  | "error";

export default function AdminPage() {
    const router = useRouter();

  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loadingSightings, setLoadingSightings] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewedPhotos, setReviewedPhotos] = useState<string[]>([]);
  const [moderationError, setModerationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Verify administrator permissions and load pending sightings.
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          router.replace("/admin/login");
          return;
        }

        const token = data.session.access_token;

        const verifyResponse = await fetch("/api/admin/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!verifyResponse.ok) {
          if (!cancelled) {
            setStatus(
              verifyResponse.status === 401 ||
                verifyResponse.status === 403
                ? "denied"
                : "error"
            );
            setErrorMessage(
              `Administrator verification failed (${verifyResponse.status}).`
            );
          }
          return;
        }

        const verification = await verifyResponse.json();

        if (!verification.authorized) {
          if (!cancelled) setStatus("denied");
          return;
        }

        const sightingsResponse = await fetch(
          "/api/admin/sightings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (!sightingsResponse.ok) {
          const result = await sightingsResponse
            .json()
            .catch(() => ({}));

          throw new Error(
            `Sightings API (${sightingsResponse.status}): ${
              result.error || "Unknown error"
            }`
          );
        }

        const result = await sightingsResponse.json();

        if (!cancelled) {
          setSightings(result.sightings ?? []);
          setStatus("authorized");
        }
      } catch (error) {
        console.error("Admin dashboard error:", error);

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unknown error"
          );
          setStatus("error");
        }
      } finally {
        if (!cancelled) setLoadingSightings(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Approve or reject a pending wildlife sighting.
  async function moderateSighting(
    id: string,
    newStatus: "approved" | "rejected"
  ) {
    const action = newStatus === "approved" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this sighting?`
      )
    ) {
      return;
    }

    setProcessingId(id);
    setModerationError("");

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch(
        `/api/admin/sightings/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({
  status: newStatus,
  photoReviewed: reviewedPhotos.includes(id),
}),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update sighting."
        );
      }

      // Remove reviewed submissions from the pending list.
      setSightings((previous) =>
        previous.filter((sighting) => sighting.id !== id)
      );
    } catch (error) {
      setModerationError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (status === "loading") {
    return (
      <main style={{ padding: 24 }}>
        <p>Checking administrator access...</p>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Access denied</h1>
        <p>Your account is not an authorized administrator.</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Something went wrong</h1>
        <p role="alert">
          {errorMessage || "Unable to load the administrator dashboard."}
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 950,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1>Wildlife Sightings Administration</h1>
        <p>
          Review wildlife sightings submitted by visitors before
          they appear publicly.
        </p>
      </header>

      <section>
        <h2>Pending Submissions</h2>

        {moderationError && (
          <p
            role="alert"
            style={{
              color: "#b91c1c",
              marginTop: 12,
            }}
          >
            {moderationError}
          </p>
        )}

        {loadingSightings ? (
          <p>Loading sightings...</p>
        ) : sightings.length === 0 ? (
          <p>No pending wildlife sightings yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 20,
              marginTop: 20,
            }}
          >
            {sightings.map((sighting) => (
              <article
                key={sighting.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h3>{sighting.species}</h3>

                <p>
                  <strong>Location:</strong>{" "}
                  {sighting.location}
                </p>

                <p>
                  <strong>Observed:</strong>{" "}
                  {new Date(
                    sighting.observed_at
                  ).toLocaleDateString()}
                </p>

                {sighting.description && (
                  <p>
                    <strong>Description:</strong>{" "}
                    {sighting.description}
                  </p>
                )}

                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(
                    sighting.created_at
                  ).toLocaleDateString()}
                </p>

                
{sighting.photo_path && (
  <div>
    <SightingPhoto sightingId={sighting.id} />

    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 16,
      }}
    >
      <input
        type="checkbox"
        checked={reviewedPhotos.includes(sighting.id)}
        onChange={(event) => {
          setReviewedPhotos((previous) =>
            event.target.checked
              ? [...previous, sighting.id]
              : previous.filter((id) => id !== sighting.id)
          );
        }}
      />
      I have reviewed this wildlife photograph.
    </label>
  </div>
)}


                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    disabled={
  processingId !== null ||
  (Boolean(sighting.photo_path) &&
    !reviewedPhotos.includes(sighting.id))
}
                    onClick={() =>
                      moderateSighting(
                        sighting.id,
                        "approved"
                      )
                    }
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#276749",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor:
                        processingId !== null
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {processingId === sighting.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() =>
                      moderateSighting(
                        sighting.id,
                        "rejected"
                      )
                    }
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#9b2c2c",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor:
                        processingId !== null
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
