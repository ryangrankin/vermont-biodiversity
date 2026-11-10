
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
  title: string | null;
  description: string;
  months: number[] | null;
  suggested_month: string | null;
  information_url: string | null;
  created_at: string;
};

type IdeaReview = {
  title: string;
  interests: string[];
  months: number[];
  requires_lawn: boolean;
  requires_garden: boolean;
};

type DashboardStatus =
  | "loading"
  | "authorized"
  | "denied"
  | "error";

// Keep these identical to the survey answer options.
const INTEREST_OPTIONS = [
  "Hiking",
  "Mountian Biking",
  "Boating",
  "Birdwatching",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


function initialReview(idea: RecommendationIdea): IdeaReview {
  const suggested = idea.suggested_month?.trim().toLowerCase();

  const monthIndex = MONTH_NAMES.findIndex(
    (name) =>
      Boolean(suggested) &&
      (name.toLowerCase() === suggested ||
        name.slice(0, 3).toLowerCase() === suggested?.slice(0, 3))
  );

  return {
    title: idea.title ?? "",
    interests: [],
    months: Array.isArray(idea.months)
      ? idea.months
      : monthIndex >= 0
        ? [monthIndex + 1]
        : [],
    requires_lawn: false,
    requires_garden: false,
  };
}


const cardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 12,
  padding: 20,
};

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 10,
  marginTop: 8,
  border: "1px solid #aaa",
  borderRadius: 8,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 18px",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

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

  const [ideaReviews, setIdeaReviews] =
    useState<Record<string, IdeaReview>>({});

  function updateIdeaReview(
    id: string,
    changes: Partial<IdeaReview>
  ) {
    const idea = ideas.find((item) => item.id === id);

    if (!idea) return;

    setIdeaReviews((previous) => ({
      ...previous,
      [id]: {
        ...(previous[id] ?? initialReview(idea)),
        ...changes,
      },
    }));
  }

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

        // Load both review queues independently.
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
              const loadedIdeas: RecommendationIdea[] =
                result.ideas ?? [];

              setIdeas(loadedIdeas);

              const initial: Record<string, IdeaReview> = {};

              loadedIdeas.forEach((idea) => {
                initial[idea.id] = initialReview(idea);
              });

              setIdeaReviews(initial);
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
  // APPROVE OR REJECT WILDLIFE SIGHTINGS
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
  // APPROVE OR REJECT RECOMMENDATION IDEAS
  // ============================================================

  async function moderateIdea(
    id: string,
    newStatus: "approved" | "rejected"
  ) {
    const idea = ideas.find((item) => item.id === id);

    if (!idea) return;

    const review =
      ideaReviews[id] ?? initialReview(idea);

    if (newStatus === "approved" && !review.title.trim()) {
      setIdeaError(
        "Please enter a title before approving the recommendation."
      );
      return;
    }

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

      const body =
        newStatus === "approved"
          ? {
              status: "approved",
              title: review.title.trim(),
              interests: review.interests,
              months: review.months,
              requires_lawn: review.requires_lawn,
              requires_garden: review.requires_garden,
            }
          : {
              status: "rejected",
            };

      const response = await fetch(
        `/api/admin/recommendation-ideas/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify(body),
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
        previous.filter((item) => item.id !== id)
      );

      setIdeaReviews((previous) => {
        const updated = { ...previous };
        delete updated[id];
        return updated;
      });
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
          WILDLIFE SIGHTINGS
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
              <article key={sighting.id} style={cardStyle}>
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
                      ...buttonStyle,
                      backgroundColor: "#276749",
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
                      ...buttonStyle,
                      backgroundColor: "#9b2c2c",
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
          RECOMMENDATION IDEAS
      ====================================================== */}

      <section style={{ marginTop: 56 }}>
        <h2>Pending Recommendation Ideas</h2>

        <p>
          Review submitted ideas and assign categories before
          approving them. Approved recommendations will be
          eligible for the personalized dashboard once the
          public recommendation integration is complete.
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
            {ideas.map((idea) => {
              const review =
                ideaReviews[idea.id] ?? initialReview(idea);

              return (
                <article key={idea.id} style={cardStyle}>
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

                  {/* ------------------------------------------
                      ADMIN CATEGORIZATION
                  ------------------------------------------ */}

                  <div
                    style={{
                      marginTop: 24,
                      padding: 20,
                      backgroundColor: "#f3f6f2",
                      borderRadius: 10,
                      color: "#222",
                    }}
                  >
                    <h4>Prepare Recommendation for Publishing</h4>

                    <p>
                      Choose who should receive this recommendation
                      and when it should appear.
                    </p>

                    {/* TITLE */}

                    <label
                      htmlFor={`title-${idea.id}`}
                      style={{ fontWeight: 600 }}
                    >
                      Recommendation Title
                    </label>

                    <input
                      id={`title-${idea.id}`}
                      type="text"
                      maxLength={150}
                      placeholder="Enter a short title"
                      value={review.title}
                      onChange={(event) =>
                        updateIdeaReview(idea.id, {
                          title: event.target.value,
                        })
                      }
                      style={fieldStyle}
                    />

                    {/* INTERESTS */}

                    <fieldset
                      style={{
                        marginTop: 24,
                        border: "none",
                        padding: 0,
                      }}
                    >
                      <legend style={{ fontWeight: 600 }}>
                        Relevant Interests
                      </legend>

                      <p>
                        Select all that apply. Leave everything
                        unchecked if this idea is relevant to
                        everyone.
                      </p>

                      {INTEREST_OPTIONS.map((interest) => (
                        <label
                          key={interest}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={review.interests.includes(
                              interest
                            )}
                            onChange={(event) => {
                              const updated = event.target.checked
                                ? [...review.interests, interest]
                                : review.interests.filter(
                                    (item) => item !== interest
                                  );

                              updateIdeaReview(idea.id, {
                                interests: updated,
                              });
                            }}
                          />

                          {interest}
                        </label>
                      ))}
                    </fieldset>

                    {/* MONTHS */}

                    <fieldset
                      style={{
                        marginTop: 24,
                        border: "none",
                        padding: 0,
                      }}
                    >
                      <legend style={{ fontWeight: 600 }}>
                        Applicable Months
                      </legend>

                      <p>
                        Select all months when this recommendation
                        is relevant. Leave all unchecked for
                        year-round recommendations.
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(120px, 1fr))",
                          gap: 10,
                        }}
                      >
                        {MONTH_NAMES.map((month, index) => {
                          const monthNumber = index + 1;

                          return (
                            <label
                              key={month}
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={review.months.includes(
                                  monthNumber
                                )}
                                onChange={(event) => {
                                  const updated =
                                    event.target.checked
                                      ? [
                                          ...review.months,
                                          monthNumber,
                                        ]
                                      : review.months.filter(
                                          (value) =>
                                            value !== monthNumber
                                        );

                                  updateIdeaReview(idea.id, {
                                    months: updated.sort(
                                      (a, b) => a - b
                                    ),
                                  });
                                }}
                              />

                              {month}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* LAWN AND GARDEN */}

                    <fieldset
                      style={{
                        marginTop: 24,
                        border: "none",
                        padding: 0,
                      }}
                    >
                      <legend style={{ fontWeight: 600 }}>
                        Space Requirements
                      </legend>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 12,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={review.requires_lawn}
                          onChange={(event) =>
                            updateIdeaReview(idea.id, {
                              requires_lawn: event.target.checked,
                            })
                          }
                        />

                        Requires a lawn
                      </label>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 12,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={review.requires_garden}
                          onChange={(event) =>
                            updateIdeaReview(idea.id, {
                              requires_garden: event.target.checked,
                            })
                          }
                        />

                        Requires a garden
                      </label>
                    </fieldset>
                  </div>

                  {/* ------------------------------------------
                      APPROVAL BUTTONS
                  ------------------------------------------ */}

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
                        processingIdeaId !== null ||
                        !review.title.trim()
                      }
                      onClick={() =>
                        moderateIdea(idea.id, "approved")
                      }
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#276749",
                      }}
                    >
                      {processingIdeaId === idea.id
                        ? "Processing..."
                        : "Approve Recommendation"}
                    </button>

                    <button
                      type="button"
                      disabled={processingIdeaId !== null}
                      onClick={() =>
                        moderateIdea(idea.id, "rejected")
                      }
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#9b2c2c",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
