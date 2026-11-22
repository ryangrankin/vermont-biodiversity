
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  recommendations,
  individualAnimals,
  individualPlants,
  dashboardContent,
  HOBBIES,
} from "@/data/studentContent";

type SurveyAnswers = Record<string, string | string[]>;

type LearnMoreItem = {
  type: string;
  id: string;
  label: string;
};

type NamedSource = {
  name: string;
  url: string;
};

type CommunityRecommendation = {
  id: string;
  title: string | null;
  description: string;
  interests: string[] | null;
  months: number[] | null;
  requires_lawn: boolean | null;
  requires_garden: boolean | null;
  information_url: string | null;
};

type DisplayRecommendation = {
  id: string;
  title: string;
  description: string;
  whyItMatters?: string;
  interests: string[];
  months: number[];
  requiresLawn: boolean;
  requiresGarden: boolean;
  learnMoreLinks: LearnMoreItem[];
  sources: NamedSource[];
};

type ProgressRow = {
  id: string;
  recommendation_id: string;
  status: "completed" | "removed";
  activity_year: number;
  completed_at: string | null;
};



const VALID_INTERESTS: string[] = Object.values(HOBBIES);


function matchesSurvey(
  tip: DisplayRecommendation,
  answers: SurveyAnswers,
  currentMonth: number
) {
  // Only show recommendations for the relevant months.
  if (
    tip.months.length > 0 &&
    !tip.months.includes(currentMonth)
  ) {
    return false;
  }

  // Get the hobbies selected in the survey.
  const selectedInterests = Array.isArray(answers.interests)
    ? answers.interests
    : typeof answers.interests === "string"
      ? [answers.interests]
      : [];

  // Only use interests from the new survey.
  const validSelectedInterests = selectedInterests.filter(
    (interest) => VALID_INTERESTS.includes(interest)
  );

  // Get the hobbies assigned to this recommendation.
  const recommendationInterests = tip.interests.filter(
    (interest) => VALID_INTERESTS.includes(interest)
  );

  // Recommendations without assigned hobbies remain visible
  // while the LEGO Club finishes assigning them.
  if (recommendationInterests.length === 0) {
    return true;
  }

  // Recommendations with assigned hobbies require a match.
  return recommendationInterests.some((interest) =>
    validSelectedInterests.includes(interest)
  );
}


export default function DashboardPage() {
  const [answers, setAnswers] =
    useState<SurveyAnswers>({});

  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] =
    useState<string | null>(null);

  const [progress, setProgress] =
    useState<ProgressRow[]>([]);

  const [progressLoading, setProgressLoading] =
    useState(true);

  const [progressError, setProgressError] =
    useState("");

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [
    communityRecommendations,
    setCommunityRecommendations,
  ] = useState<CommunityRecommendation[]>([]);

  const [loadingCommunity, setLoadingCommunity] =
    useState(true);

  const [communityError, setCommunityError] =
    useState("");

  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);

  // Load survey answers and current date.
  useEffect(() => {
    const savedAnswers = localStorage.getItem(
      "biodiversitySurvey"
    );

    if (savedAnswers) {
      try {
        const parsed: unknown = JSON.parse(savedAnswers);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          setAnswers(parsed as SurveyAnswers);
        }
      } catch {
        setAnswers({});
      }
    }

    const now = new Date();

    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setLoaded(true);
  }, []);

  // Load progress for the signed-in user.
  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      setProgressLoading(true);
      setProgressError("");

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (cancelled) return;

      if (authError || !authData.user) {
        setUserId(null);
        setProgress([]);
        setProgressError(
          "Sign in to save and view your recommendation progress."
        );
        setProgressLoading(false);
        return;
      }

      setUserId(authData.user.id);

      const { data, error } = await supabase
        .from("recommendation_progress")
        .select(
          "id,recommendation_id,status,activity_year,completed_at"
        )
        .eq("user_id", authData.user.id)
        .order("completed_at", {
          ascending: false,
          nullsFirst: false,
        });

      if (cancelled) return;

      if (error) {
        setProgressError(
          `Unable to load your progress: ${error.message}`
        );
      } else {
        setProgress((data ?? []) as ProgressRow[]);
      }

      setProgressLoading(false);
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load admin-approved recommendations.
  useEffect(() => {
    let cancelled = false;

    async function loadCommunityRecommendations() {
      try {
        const response = await fetch(
          "/api/approved-recommendations",
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load community recommendations."
          );
        }

        if (!cancelled) {
          setCommunityRecommendations(
            result.recommendations ?? []
          );
        }
      } catch (error) {
        if (!cancelled) {
          setCommunityError(
            error instanceof Error
              ? error.message
              : "Unable to load community recommendations."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCommunity(false);
        }
      }
    }

    void loadCommunityRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  // Convert built-in recommendations.
  const studentRecommendations: DisplayRecommendation[] =
    recommendations
      .filter(
        (tip) =>
          tip.title.trim() !== "" &&
          tip.description.trim() !== ""
      )
      .map((tip) => {
        const withLinks = tip as typeof tip & {
          learnMore?: LearnMoreItem;
          learnMoreLinks?: LearnMoreItem[];
          sources?: NamedSource[];
        };

        const links =
          Array.isArray(withLinks.learnMoreLinks) &&
          withLinks.learnMoreLinks.length > 0
            ? withLinks.learnMoreLinks
            : withLinks.learnMore
              ? [withLinks.learnMore]
              : [];

        return {
          id: `student-${tip.id}`,
          title: tip.title,
          description: tip.description,
          whyItMatters: tip.whyItMatters,
          interests: tip.interests ?? [],
          months: tip.months ?? [],
          requiresLawn: tip.requiresLawn ?? false,
          requiresGarden: tip.requiresGarden ?? false,
          learnMoreLinks: links,
          sources: withLinks.sources ?? [],
        };
      });

  // Convert approved community recommendations.
  const approvedRecommendations: DisplayRecommendation[] =
    communityRecommendations
      .filter(
        (tip) =>
          Boolean(tip.title?.trim()) &&
          Boolean(tip.description?.trim())
      )
      .map((tip) => ({
        id: `community-${tip.id}`,
        title: tip.title ?? "",
        description: tip.description,
        interests: tip.interests ?? [],
        months: tip.months ?? [],
        requiresLawn: tip.requires_lawn ?? false,
        requiresGarden: tip.requires_garden ?? false,
        learnMoreLinks: [],
        sources:
          tip.information_url &&
          /^https?:\/\//i.test(tip.information_url)
            ? [
                {
                  name: "Community Resource",
                  url: tip.information_url,
                },
              ]
            : [],
      }));

  const allRecommendations = [
    ...studentRecommendations,
    ...approvedRecommendations,
  ];

  // Hide completed or removed recommendations
  // for the current calendar year only.
  const hiddenIds = new Set(
    progress
      .filter(
        (item) => item.activity_year === currentYear
      )
      .map((item) => item.recommendation_id)
  );

  const matchedRecommendations =
    allRecommendations.filter(
      (tip) =>
        matchesSurvey(tip, answers, currentMonth) &&
        !hiddenIds.has(tip.id)
    );

  // Keep completion history across all years.
  const completedHistory = progress
    .filter(
      (item) =>
        item.status === "completed" &&
        item.completed_at
    )
    .sort(
      (a, b) =>
        new Date(b.completed_at!).getTime() -
        new Date(a.completed_at!).getTime()
    );

  // Save completed or removed status to Supabase.
  async function saveProgress(
    id: string,
    status: "completed" | "removed"
  ) {
    if (!userId || progressLoading || savingId) {
      return;
    }

    setSavingId(id);
    setProgressError("");

    const completedAt =
      status === "completed"
        ? new Date().toISOString()
        : null;

    const { data, error } = await supabase
      .from("recommendation_progress")
      .upsert(
        {
          user_id: userId,
          recommendation_id: id,
          status,
          activity_year: currentYear,
          completed_at: completedAt,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict:
            "user_id,recommendation_id,activity_year",
        }
      )
      .select(
        "id,recommendation_id,status,activity_year,completed_at"
      )
      .single();

    if (error) {
      setProgressError(
        `Unable to save your progress: ${error.message}`
      );
    } else {
      setProgress((previous) => [
        ...previous.filter(
          (item) =>
            !(
              item.recommendation_id === id &&
              item.activity_year === currentYear
            )
        ),
        data as ProgressRow,
      ]);
    }

    setSavingId(null);
  }


async function restoreRecommendation(id: string) {
  if (!userId || progressLoading || savingId) return;

  setSavingId(id);
  setProgressError("");

  const { error } = await supabase
    .from("recommendation_progress")
    .delete()
    .eq("user_id", userId)
    .eq("recommendation_id", id)
    .eq("activity_year", currentYear)
    .eq("status", "removed");

  if (error) {
    setProgressError(
      `Unable to restore recommendation: ${error.message}`
    );
  } else {
    setProgress((previous) =>
      previous.filter(
        (item) =>
          !(
            item.recommendation_id === id &&
            item.activity_year === currentYear &&
            item.status === "removed"
          )
      )
    );
  }

  setSavingId(null);
}


async function undoProgress(id: string) {
  if (!userId || progressLoading || savingId) return;

  setSavingId(id);
  setProgressError("");

  const { error } = await supabase
    .from("recommendation_progress")
    .delete()
    .eq("user_id", userId)
    .eq("recommendation_id", id)
    .eq("activity_year", currentYear);

  if (error) {
    setProgressError(
      `Unable to undo progress: ${error.message}`
    );
  } else {
    setProgress((previous) =>
      previous.filter(
        (item) =>
          !(
            item.recommendation_id === id &&
            item.activity_year === currentYear
          )
      )
    );
  }

  setSavingId(null);
}


  if (!loaded) {
    return (
      <main className="container dashboard-background">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container dashboard-background">
      <section className="dashboard-header">
        <h1>Your Biodiversity Dashboard</h1>

        {dashboardContent.welcome && (
          <p>{dashboardContent.welcome}</p>
        )}

        <Link
          href="/survey"
          className="secondary-button"
        >
          Edit My Survey Answers
        </Link>
      </section>

      <section className="section">
        <h2>Your Recommendations</h2>

        {loadingCommunity && (
          <p>Loading community recommendations...</p>
        )}

        {communityError && (
          <p role="alert">
            Community recommendations could not be loaded.
            Other recommendations are still available.
          </p>
        )}

        {progressLoading && (
          <p>Loading your progress...</p>
        )}

        {progressError && (
          <p role="alert">
            {progressError}{" "}
            {!userId && (
              <Link href="/login">Sign in</Link>
            )}
          </p>
        )}

        {!progressLoading &&
        matchedRecommendations.length === 0 ? (
          <div className="empty-state">
            <h3>
              No Recommendations Available Right Now
            </h3>

            <p>
              [STUDENTS: YOUR BIODIVERSITY
              RECOMMENDATIONS WILL APPEAR HERE]
            </p>

            <p>
              Try editing your survey answers or
              checking again during another month.
            </p>
          </div>
        ) : !progressLoading ? (
          <div className="card-grid">
            {matchedRecommendations.map((tip) => {
              const resolvedLinks =
                tip.learnMoreLinks.flatMap((item) => {
                  if (
                    !item.id?.trim() ||
                    !item.label?.trim()
                  ) {
                    return [];
                  }

                  if (item.type === "animal") {
                    const animal =
                      individualAnimals.find(
                        (entry) =>
                          entry.id === item.id
                      );

                    return animal
                      ? [
                          {
                            href:
                              `/animals/${animal.category}` +
                              `#${animal.id}`,
                            label: item.label,
                          },
                        ]
                      : [];
                  }

                  if (item.type === "plant") {
                    const plant =
                      individualPlants.find(
                        (entry) =>
                          entry.id === item.id
                      );

                    return plant
                      ? [
                          {
                            href:
                              `/plants/${plant.category}` +
                              `#${plant.id}`,
                            label: item.label,
                          },
                        ]
                      : [];
                  }

                  return [];
                });

              const validSources =
                tip.sources.filter(
                  (source) =>
                    source.name?.trim() &&
                    /^https?:\/\//i.test(
                      source.url?.trim() ?? ""
                    )
                );

              return (
                <article
                  className="info-card"
                  key={tip.id}
                >
                  <h3>{tip.title}</h3>

                  <p>{tip.description}</p>

                  {tip.whyItMatters && (
                    <>
                      <h4>Why This Matters</h4>
                      <p>{tip.whyItMatters}</p>
                    </>
                  )}

                  {validSources.length > 0 && (
                    <div className="recommendation-sources">
                      <h4>Sources</h4>

                      <ul>
                        {validSources.map(
                          (source, index) => (
                            <li
                              key={
                                `${source.url}-${index}`
                              }
                            >
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {source.name}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {resolvedLinks.length > 0 && (
                    <div className="recommendation-learn-more">
                      {resolvedLinks.map(
                        (item, index) => (
                          <Link
                            key={
                              `${item.href}-${index}`
                            }
                            href={item.href}
                            className="learn-more-link"
                          >
                            {item.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 16,
                    }}
                  >
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={
                        !userId ||
                        savingId !== null
                      }
                      onClick={() =>
                        void saveProgress(
                          tip.id,
                          "completed"
                        )
                      }
                    >
                      {savingId === tip.id
                        ? "Saving..."
                        : "Mark as Completed"}
                    </button>

<button
  type="button"
  disabled={!userId || savingId !== null}
  onClick={() => void saveProgress(tip.id, "removed")}
  style={{
    padding: "7px 12px",
    fontSize: "0.8rem",
    backgroundColor: "transparent",
    color: "#555",
    border: "1px solid #aaa",
    borderRadius: "8px",
    cursor:
      !userId || savingId !== null
        ? "not-allowed"
        : "pointer",
    opacity:
      !userId || savingId !== null ? 0.5 : 1,
  }}
>
  {savingId === tip.id ? "Saving..." : "Ignore"}
</button>

                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>



<section className="section">
  <div className="progress-header">
    <div>
      <h2>Your Progress</h2>
      <p>Keep track of your biodiversity activities.</p>
    </div>

    <div className="progress-counter">
      <strong>{completedHistory.length}</strong>
      <span>Completed</span>
    </div>
  </div>

  <div className="info-card">
    {progress.length > 0 ? (
      <div className="progress-list">
        {[...progress]
          .sort((a, b) => {
            const dateA = a.completed_at
              ? new Date(a.completed_at).getTime()
              : 0;
            const dateB = b.completed_at
              ? new Date(b.completed_at).getTime()
              : 0;
            return dateB - dateA;
          })
          .map((item) => {
            const recommendation = allRecommendations.find(
              (tip) => tip.id === item.recommendation_id
            );

            const isCompleted = item.status === "completed";

            return (
              <div className="progress-item" key={item.id}>
                <div
                  className={`progress-icon ${
                    isCompleted
                      ? "progress-icon-completed"
                      : "progress-icon-ignored"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? "✓" : "–"}
                </div>

                <div className="progress-details">
                  <strong>
                    {recommendation?.title ??
                      "Recommendation no longer available"}
                  </strong>

                  <span
                    className={
                      isCompleted
                        ? "progress-status-completed"
                        : "progress-status-ignored"
                    }
                  >
                    {isCompleted && item.completed_at
                      ? `Completed ${new Date(
                          item.completed_at
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`
                      : "Ignored"}
                  </span>
                </div>

                {item.activity_year === currentYear && (
                  <button
                    type="button"
                    className="progress-action-button"
                    disabled={!userId || savingId !== null}
                    onClick={() =>
                      void undoProgress(item.recommendation_id)
                    }
                  >
                    {savingId === item.recommendation_id
                      ? "Restoring..."
                      : isCompleted
                        ? "Undo"
                        : "Restore"}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    ) : (
      <p className="progress-empty">
        No activity yet. Complete or ignore a recommendation
        to see it here!
      </p>
    )}
  </div>
</section>




<section className="section">
  <h2>Ignored Recommendations</h2>

  {progress.filter(
    (item) =>
      item.status === "removed" &&
      item.activity_year === currentYear
  ).length === 0 ? (
    <p>No ignored recommendations.</p>
  ) : (
    <div className="card-grid">
      {progress
        .filter(
          (item) =>
            item.status === "removed" &&
            item.activity_year === currentYear
        )
        .map((item) => {
          const recommendation = allRecommendations.find(
            (tip) => tip.id === item.recommendation_id
          );

          return (
            <article className="info-card" key={item.id}>
              <h3>
                {recommendation?.title ??
                  "Recommendation no longer available"}
              </h3>

              {recommendation && (
                <p>{recommendation.description}</p>
              )}

              <button
                type="button"
                className="secondary-button"
                disabled={!userId || savingId !== null}
                onClick={() =>
                  void restoreRecommendation(
                    item.recommendation_id
                  )
                }
              >
                {savingId === item.recommendation_id
                  ? "Restoring..."
                  : "Restore Recommendation"}
              </button>
            </article>
          );
        })}
    </div>
  )}
</section>


      <section className="section">
        <h2>Explore More</h2>

        <div className="card-grid">
          <div className="info-card">
            <h3>Animals</h3>

            {dashboardContent.animalsDescription && (
              <p>
                {dashboardContent.animalsDescription}
              </p>
            )}

            <Link
              href="/animals"
              className="secondary-button"
            >
              Explore Animals →
            </Link>
          </div>

          <div className="info-card">
            <h3>Plants &amp; Gardens</h3>

            {dashboardContent.plantsDescription && (
              <p>
                {dashboardContent.plantsDescription}
              </p>
            )}

            <Link
              href="/plants"
              className="secondary-button"
            >
              Explore Plants &amp; Gardens →
            </Link>
          </div>

          <div className="info-card">
            <h3>Wildlife Sightings Gallery</h3>

            <p>
              Explore wildlife sightings shared by
              the community and approved by the
              LEGO Club!
            </p>

            <Link
              href="/gallery"
              className="secondary-button"
            >
              View Wildlife Gallery →
            </Link>
          </div>

<div className="info-card">
  <h3>Share a Wildlife Sighting</h3>

  <p>
    Spotted an animal or plant in Vermont?
    Share your wildlife photos or videos
    with the LEGO Club!
  </p>

  <Link
    href="/sightings"
    className="secondary-button"
  >
    Submit a Wildlife Sighting →
  </Link>
</div>

        </div>
      </section>
    </main>
  );
}
