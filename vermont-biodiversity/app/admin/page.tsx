
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

type RecommendationIdea = {
  id: string;
  description: string;
  suggested_month: string | null;
  information_url: string | null;
  created_at: string;
};

type DashboardStatus =
  | "loading"
  | "authorized"
  | "denied"
  | "error";

export default function AdminPage() {
  const router = useRouter();

  // ============================================================
  // ADMIN AUTHENTICATION
  // ============================================================

  const [status, setStatus] =
    useState<DashboardStatus>("loading");

  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // WILDLIFE SIGHTINGS
  // ============================================================

  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loadingSightings, setLoadingSightings] = useState(true);
  const [processingId, setProcessingId] =
    useState<string | null>(null);
  const [reviewedPhotos, setReviewedPhotos] =
    useState<string[]>([]);
  const [moderationError, setModerationError] = useState("");

  // ============================================================
  // RECOMMENDATION IDEAS
  // ============================================================

  const [ideas, setIdeas] = useState<RecommendationIdea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [processingIdeaId, setProcessingIdeaId] =
    useState<string | null>(null);
  const [ideaError, setIdeaError] = useState("");

  // ============================================================
  // LOAD ADMIN DASHBOARD
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (error || !data.session) {
          router.replace("/admin/login");
          return;
        }

        const token = data.session.access_token;

        // Verify administrator permissions.
        const verifyResponse = await fetch(
          "/api/admin/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

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

        if (!cancelled) setStatus("authorized");

        // Load wildlife sightings and recommendation ideas
        // independently so one failure does not hide the other.
        const [sightingsResult, ideasResult] =
          await Promise.allSettled([
            fetch("/api/admin/sightings", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }),
            fetch("/api/admin/recommendation-ideas", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }),
          ]);

        // Wildlife sightings
        if (sightingsResult.status === "fulfilled") {
          try {
            const response = sightingsResult.value;
            const result = await response.json();

            if (!response.ok) {
              throw new Error(
                result.error || "Unable to load sightings."
              );
            }

            if (!cancelled) {
              setSightings(result.sightings ?? []);
            }
          } catch (error) {
            if (!cancelled) {
              setModerationError(
                error instanceof Error
                  ? error.message
                  : "Unable to load sightings."
              );
            }
          }
        } else if (!cancelled) {
          setModerationError("Unable to load sightings.");
        }

        // Recommendation ideas
        if (ideasResult.status === "fulfilled") {
          try {
            const response = ideasResult.value;
            const result = await response.json();

            if (!response.ok) {
              throw new Error(
                result.error ||
                  "Unable to load recommendation ideas."
              );
            }

            if (!cancelled) {
              setIdeas(result.ideas ?? []);
            }
          } catch (error) {
            if (!cancelled) {
              setIdeaError(
                error instanceof Error
                  ? error.message
                  : "Unable to load recommendation ideas."
              );
            }
          }
        } else if (!cancelled) {
          setIdeaError("Unable to load recommendation ideas.");
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
        if (!cancelled) {
          setLoadingSightings(false);
          setLoadingIdeas(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // ============================================================
  // APPROVE OR REJECT WILDLIFE SIGHTING
  // ============================================================

  async function moderateSighting(
    id: string,
    newStatus: "approved" | "rejected"
  ) {
    const action =
      newStatus === "approved" ? "approve" : "reject";

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
      const { data, error } =
        await supabase.auth.getSession();

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
            Authorization:
              `Bearer ${data.session.access_token}`,
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

      setSightings((previous) =>
        previous.filter((sighting) => sighting.id !== id)
      );

      setReviewedPhotos((previous) =>
        previous.filter((reviewedId) => reviewedId !== id)
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

  // ============================================================
  // APPROVE OR REJECT RECOMMENDATION IDEA
  // ============================================================

  async function moderateIdea(
    id: string,
    newStatus: "approved" | "rejected"
  ) {
    const action =
      newStatus === "approved" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this recommendation?`
      )
    ) {
      return;
    }

    setProcessingIdeaId(id);
    setIdeaError("");

    try {
      const { data, error } =
        await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch(
        `/api/admin/recommendation-ideas/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to review recommendation idea."
        );
      }

      setIdeas((previous) =>
        previous.filter((idea) => idea.id !== id)
      );
    } catch (error) {
      setIdeaError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setProcessingIdeaId(null);
    }
  }

  // ============================================================
  // AUTHENTICATION STATES
  // ============================================================

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
        <p>
          Your account is not an authorized administrator.
        </p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Something went wrong</h1>
        <p role="alert">
          {errorMessage ||
            "Unable to load the administrator dashboard."}
        </p>
      </main>
    );
  }

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  return (
    <main
      style={{
        maxWidth: 950,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1>LEGO Club Administration</h1>

        <p>
          Review wildlife sightings and recommendation ideas
          submitted by visitors.
        </p>
      </header>

      {/* ======================================================
          WILDLIFE SIGHTINGS SECTION
      ====================================================== */}

      <section>
        <h2>Pending Wildlife Sightings</h2>

        {moderationError && (
          <p role="alert" style={{ color: "#b91c1c" }}>
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
                    <SightingPhoto
                      sightingId={sighting.id}
                    />

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
                        checked={reviewedPhotos.includes(
                          sighting.id
                        )}
                        onChange={(event) => {
                          setReviewedPhotos((previous) =>
                            event.target.checked
                              ? [...previous, sighting.id]
                              : previous.filter(
                                  (id) => id !== sighting.id
                                )
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

      {/* ======================================================
          RECOMMENDATION IDEAS SECTION
      ====================================================== */}

      <section style={{ marginTop: 56 }}>
        <h2>Pending Recommendation Ideas</h2>

        <p>
          Review activity and project ideas submitted by
          visitors. Approved ideas can be added to the app
          by LEGO Club students.
        </p>

        {ideaError && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {ideaError}
          </p>
        )}

        {loadingIdeas ? (
          <p>Loading recommendation ideas...</p>
        ) : ideas.length === 0 ? (
          <p>No pending recommendation ideas yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 20,
              marginTop: 20,
            }}
          >
            {ideas.map((idea) => (
              <article
                key={idea.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <h3>Recommendation Idea</h3>

                <p style={{ whiteSpace: "pre-wrap" }}>
                  {idea.description}
                </p>

                <p>
                  <strong>Suggested Month:</strong>{" "}
                  {idea.suggested_month || "Any month"}
                </p>

                {idea.information_url && (
                  <p>
                    <strong>More Information:</strong>{" "}
                    <a
                      href={idea.information_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resource
                    </a>
                  </p>
                )}

                <p>
                  <strong>Submitted:</strong>{" "}
                  {new Date(
                    idea.created_at
                  ).toLocaleDateString()}
                </p>

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
                    disabled={processingIdeaId !== null}
                    onClick={() =>
                      moderateIdea(idea.id, "approved")
                    }
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#276749",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                    }}
                  >
                    {processingIdeaId === idea.id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={processingIdeaId !== null}
                    onClick={() =>
                      moderateIdea(idea.id, "rejected")
                    }
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#9b2c2c",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
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
