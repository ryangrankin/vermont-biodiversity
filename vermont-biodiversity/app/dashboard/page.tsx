
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  recommendations,
  individualAnimals,
  individualPlants,
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

const VALID_INTERESTS = [
  "Hiking",
  "Mountian Biking",
  "Boating",
  "Birdwatching",
];

function matchesSurvey(
  tip: DisplayRecommendation,
  answers: SurveyAnswers,
  currentMonth: number
) {
  // An empty month list means year-round.
  if (
    tip.months.length > 0 &&
    !tip.months.includes(currentMonth)
  ) {
    return false;
  }

  if (tip.requiresLawn && answers.lawn === "No") {
    return false;
  }

  if (tip.requiresGarden && answers.garden === "No") {
    return false;
  }

  // Ignore unfinished student interest placeholders.
  const interests = tip.interests.filter((interest) =>
    VALID_INTERESTS.includes(interest)
  );

  if (interests.length > 0) {
    const selected = Array.isArray(answers.interests)
      ? answers.interests
      : typeof answers.interests === "string"
        ? [answers.interests]
        : [];

    if (
      selected.length > 0 &&
      !interests.some((interest) =>
        selected.includes(interest)
      )
    ) {
      return false;
    }
  }

  return true;
}

export default function DashboardPage() {
  // ============================================================
  // SURVEY ANSWERS AND COMPLETED ACTIVITIES
  // ============================================================

  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ============================================================
  // COMMUNITY RECOMMENDATIONS
  // ============================================================

  const [communityRecommendations, setCommunityRecommendations] =
    useState<CommunityRecommendation[]>([]);

  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [communityError, setCommunityError] = useState("");

  const [currentMonth, setCurrentMonth] = useState(0);

  // ============================================================
  // LOAD LOCAL DATA
  // ============================================================

  useEffect(() => {
    const savedAnswers = localStorage.getItem(
      "biodiversitySurvey"
    );

    const savedCompleted = localStorage.getItem(
      "completedActivities"
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

    if (savedCompleted) {
      try {
        const parsed: unknown = JSON.parse(savedCompleted);

        if (Array.isArray(parsed)) {
          setCompleted(
            parsed
              .filter(
                (id): id is string | number =>
                  typeof id === "string" ||
                  typeof id === "number"
              )
              .map((id) =>
                typeof id === "number"
                  ? `student-${id}`
                  : id
              )
          );
        }
      } catch {
        setCompleted([]);
      }
    }

    setCurrentMonth(new Date().getMonth() + 1);
    setLoaded(true);
  }, []);

  // ============================================================
  // FETCH APPROVED COMMUNITY RECOMMENDATIONS
  // ============================================================

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

    loadCommunityRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // MARK ACTIVITIES AS COMPLETED
  // ============================================================

  function toggleCompleted(id: string) {
    const updated = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];

    setCompleted(updated);

    localStorage.setItem(
      "completedActivities",
      JSON.stringify(updated)
    );
  }

  // ============================================================
  // CONVERT STUDENT RECOMMENDATIONS
  // ============================================================

  const studentRecommendations: DisplayRecommendation[] =
    recommendations
      .filter(
        (tip) =>
          tip.title.trim() !== "" &&
          tip.description.trim() !== ""
      )
      .map((tip) => {
        const tipWithLinks = tip as typeof tip & {
          learnMore?: LearnMoreItem;
          learnMoreLinks?: LearnMoreItem[];
          sources?: NamedSource[];
        };

        const links =
          Array.isArray(tipWithLinks.learnMoreLinks) &&
          tipWithLinks.learnMoreLinks.length > 0
            ? tipWithLinks.learnMoreLinks
            : tipWithLinks.learnMore
              ? [tipWithLinks.learnMore]
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
          sources: tipWithLinks.sources ?? [],
        };
      });

  // ============================================================
  // CONVERT APPROVED COMMUNITY RECOMMENDATIONS
  // ============================================================

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

  // ============================================================
  // COMBINE AND FILTER RECOMMENDATIONS
  // ============================================================

  const allRecommendations = [
    ...studentRecommendations,
    ...approvedRecommendations,
  ];

  const matchedRecommendations = allRecommendations.filter(
    (tip) => matchesSurvey(tip, answers, currentMonth)
  );

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (!loaded) {
    return (
      <main className="container dashboard-background">
        <p>Loading...</p>
      </main>
    );
  }

  // ============================================================
  // DASHBOARD PAGE
  // ============================================================

  return (
    <main className="container dashboard-background">
      {/* DASHBOARD HEADER */}

      <section className="dashboard-header">
        <h1>Your Biodiversity Dashboard</h1>

        <p>[STUDENTS: WRITE DASHBOARD WELCOME MESSAGE]</p>

        <Link
          href="/survey"
          className="secondary-button"
        >
          Edit My Survey Answers
        </Link>
      </section>

      {/* PERSONALIZED RECOMMENDATIONS */}

      <section className="section">
        <h2>Your Recommendations</h2>

        {loadingCommunity && (
          <p>Loading community recommendations...</p>
        )}

        {communityError && (
          <p role="alert">
            Community recommendations could not be loaded.
            Student recommendations are still available.
          </p>
        )}

        {matchedRecommendations.length === 0 ? (
          <div className="empty-state">
            <h3>No Recommendations Available Right Now</h3>

            <p>
              [STUDENTS: YOUR BIODIVERSITY RECOMMENDATIONS
              WILL APPEAR HERE]
            </p>

            <p>
              Try editing your survey answers or checking
              again during another month.
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {matchedRecommendations.map((tip) => {
              // Resolve links to student animal and plant pages.
              const resolvedLinks = tip.learnMoreLinks.flatMap(
                (item) => {
                  if (
                    !item.id?.trim() ||
                    !item.label?.trim()
                  ) {
                    return [];
                  }

                  if (item.type === "animal") {
                    const animal = individualAnimals.find(
                      (entry) => entry.id === item.id
                    );

                    return animal
                      ? [
                          {
                            href: `/animals/${animal.category}#${animal.id}`,
                            label: item.label,
                          },
                        ]
                      : [];
                  }

                  if (item.type === "plant") {
                    const plant = individualPlants.find(
                      (entry) => entry.id === item.id
                    );

                    return plant
                      ? [
                          {
                            href: `/plants/${plant.category}#${plant.id}`,
                            label: item.label,
                          },
                        ]
                      : [];
                  }

                  return [];
                }
              );

              // Display only valid clickable sources.
              const validSources = tip.sources.filter(
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
                  {/* RECOMMENDATION TITLE */}

                  <h3>{tip.title}</h3>

                  {/* DESCRIPTION */}

                  <p>{tip.description}</p>

                  {/* WHY IT MATTERS */}

                  {tip.whyItMatters && (
                    <>
                      <h4>Why This Matters</h4>
                      <p>{tip.whyItMatters}</p>
                    </>
                  )}

                  {/* RESEARCH SOURCES */}

                  {validSources.length > 0 && (
                    <div className="recommendation-sources">
                      <h4>Sources</h4>

                      <ul>
                        {validSources.map(
                          (source, index) => (
                            <li
                              key={`${source.url}-${index}`}
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

                  {/* ANIMAL AND PLANT LINKS */}

                  {resolvedLinks.length > 0 && (
                    <div className="recommendation-learn-more">
                      {resolvedLinks.map((item, index) => (
                        <Link
                          key={`${item.href}-${index}`}
                          href={item.href}
                          className="learn-more-link"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* COMPLETION BUTTON */}

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      toggleCompleted(tip.id)
                    }
                  >
                    {completed.includes(tip.id)
                      ? "✓ Completed"
                      : "Mark as Completed"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* COMPLETED ACTIVITIES */}

      <section className="section">
        <h2>Your Progress</h2>

        <div className="info-card">
          <p>
            Activities Completed:{" "}
            <strong>{completed.length}</strong>
          </p>
        </div>
      </section>

      {/* EXPLORE MORE */}

      <section className="section">
        <h2>Explore More</h2>

        <div className="card-grid">
          <div className="info-card">
            <h3>Animals</h3>
            <p>[STUDENTS: ANIMAL CONTENT]</p>

            <Link
              href="/animals"
              className="secondary-button"
            >
              Explore Animals →
            </Link>
          </div>

          <div className="info-card">
            <h3>Plants & Gardens</h3>
            <p>[STUDENTS: PLANT CONTENT]</p>

            <Link
              href="/plants"
              className="secondary-button"
            >
              Explore Plants & Gardens →
            </Link>
          </div>

          <div className="info-card">
            <h3>Wildlife Cam</h3>
            <p>[STUDENTS: WILDLIFE CONTENT]</p>

            <Link
              href="/wildlife-cam"
              className="secondary-button"
            >
              Explore Wildlife Photos & Videos →
            </Link>
          </div>

          <div className="info-card">
            <h3>Wildlife Sightings Gallery</h3>

            <p>
              Explore wildlife sightings shared by the
              community and approved by the LEGO Club!
            </p>

            <Link
              href="/gallery"
              className="secondary-button"
            >
              View Wildlife Gallery →
            </Link>
          </div>

          <div className="info-card">
            <h3>Share a Wildlife Sighting or Recommendation</h3>

            <p>
              Spotted an animal or plant in Vermont?
              Have a useful tip for other Vermonters?
              Share your tip or upload a wildlife photograph!
            </p>

            <Link
              href="/sightings"
              className="secondary-button"
            >
              Submit a Sighting →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
