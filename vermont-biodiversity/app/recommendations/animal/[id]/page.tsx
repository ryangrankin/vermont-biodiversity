
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  individualAnimals,
  recommendations,
} from "@/data/studentContent";

type RecommendationLink = {
  type: string;
  id: string;
  label: string;
};

type ProgressRow = {
  recommendation_id: string;
  status: "completed" | "removed";
  activity_year: number;
  completed_at: string | null;
};

function getLinkedRecommendations(animalId: string) {
  return recommendations.filter((recommendation) => {
    const item = recommendation as typeof recommendation & {
      learnMore?: RecommendationLink;
      learnMoreLinks?: RecommendationLink[];
    };

    const links = [
      ...(item.learnMore ? [item.learnMore] : []),
      ...(item.learnMoreLinks ?? []),
    ];

    return links.some(
      (link) =>
        link.type === "animal" &&
        link.id === animalId
    );
  });
}

function AnimalRecommendationsContent() {
  const params = useParams();
  const animalId = decodeURIComponent(
    String(params.id ?? "")
  );

  const animal = individualAnimals.find(
    (item) => item.id === animalId
  );

  const animalRecommendations =
    getLinkedRecommendations(animalId);

  const [userId, setUserId] = useState<string | null>(
    null
  );
  const [progress, setProgress] = useState<
    ProgressRow[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (cancelled) return;

      if (authError || !authData.user) {
        setError(
          "Sign in to save and view your completed recommendations."
        );
        setLoading(false);
        return;
      }

      setUserId(authData.user.id);

      const { data, error: progressError } =
        await supabase
          .from("recommendation_progress")
          .select(
            "recommendation_id,status,activity_year,completed_at"
          )
          .eq("user_id", authData.user.id)
          .eq("activity_year", currentYear);

      if (cancelled) return;

      if (progressError) {
        setError(progressError.message);
      } else {
        setProgress((data ?? []) as ProgressRow[]);
      }

      setLoading(false);
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [currentYear]);

  async function markCompleted(recommendationId: string) {
    if (!userId || savingId) return;

    setSavingId(recommendationId);
    setError("");

    const completedAt = new Date().toISOString();

    const { data, error: saveError } = await supabase
      .from("recommendation_progress")
      .upsert(
        {
          user_id: userId,
          recommendation_id: recommendationId,
          status: "completed",
          activity_year: currentYear,
          completed_at: completedAt,
          updated_at: completedAt,
        },
        {
          onConflict:
            "user_id,recommendation_id,activity_year",
        }
      )
      .select(
        "recommendation_id,status,activity_year,completed_at"
      )
      .single();

    if (saveError) {
      setError(saveError.message);
    } else {
      setProgress((previous) => [
        ...previous.filter(
          (item) =>
            item.recommendation_id !== recommendationId
        ),
        data as ProgressRow,
      ]);
    }

    setSavingId(null);
  }

  if (!animal) {
    return (
      <main className="container">
        <h1>Animal Not Found</h1>
        <Link href="/animals">Back to Animals</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <Link
        href={`/animals/${animal.category}#${animal.id}`}
        className="back-link"
      >
        ← Back to {animal.name}
      </Link>

      <section className="section">
        <h1>{animal.name} Recommendations</h1>

        <p>
          Explore ways to help {animal.name} and
          support biodiversity in Vermont.
        </p>

        <p>
          These recommendations are shown here
          year-round for reference. Your main
          dashboard still follows the monthly
          recommendation schedule.
        </p>

        {loading && <p>Loading your progress...</p>}

        {error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}{" "}
            {!userId && (
              <Link href="/login">Sign in</Link>
            )}
          </p>
        )}

        {!loading && (
          <div className="card-grid">
            {animalRecommendations.map((tip) => {
              const recommendationId =
                `student-${tip.id}`;

              const completed = progress.some(
                (item) =>
                  item.recommendation_id ===
                    recommendationId &&
                  item.status === "completed"
              );

              return (
                <article
                  key={tip.id}
                  className="info-card"
                >
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>

                  {tip.whyItMatters && (
                    <>
                      <h4>Why This Matters</h4>
                      <p>{tip.whyItMatters}</p>
                    </>
                  )}

                  {tip.months.length > 0 && (
                    <p>
                      <strong>Recommended months:</strong>{" "}
                      {tip.months
                        .map((month) =>
                          new Date(
                            2026,
                            month - 1,
                            1
                          ).toLocaleString(
                            "en-US",
                            { month: "long" }
                          )
                        )
                        .join(", ")}
                    </p>
                  )}

                  {completed ? (
                    <p style={{ color: "#276749" }}>
                      ✓ Completed this year
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={
                        !userId || savingId !== null
                      }
                      onClick={() =>
                        void markCompleted(
                          recommendationId
                        )
                      }
                    >
                      {savingId === recommendationId
                        ? "Saving..."
                        : "Mark as Completed"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!loading &&
          animalRecommendations.length === 0 && (
            <p>
              No recommendations are linked to
              this animal yet.
            </p>
          )}
      </section>
    </main>
  );
}

export default function AnimalRecommendationsPage() {
  return (
    <Suspense fallback={<p>Loading recommendations...</p>}>
      <AnimalRecommendationsContent />
    </Suspense>
  );
}
