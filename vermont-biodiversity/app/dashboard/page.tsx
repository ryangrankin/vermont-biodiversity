
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

export default function DashboardPage() {
  // ==========================================
  // LOAD USER'S SURVEY ANSWERS
  // ==========================================

  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("biodiversitySurvey");
    const savedCompleted = localStorage.getItem("completedActivities");

    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch {
        setAnswers({});
      }
    }

    if (savedCompleted) {
      try {
        setCompleted(JSON.parse(savedCompleted));
      } catch {
        setCompleted([]);
      }
    }

    setLoaded(true);
  }, []);

  // ==========================================
  // MARK ACTIVITIES AS COMPLETED
  // ==========================================

  function toggleCompleted(id: number) {
    const updated = completed.includes(id)
      ? completed.filter((item) => item !== id)
      : [...completed, id];

    setCompleted(updated);

    localStorage.setItem(
      "completedActivities",
      JSON.stringify(updated)
    );
  }

  // ==========================================
  // FILTER RECOMMENDATIONS
  // ==========================================

  // For now, show all recommendations students have written.
  // Survey-based filtering can be added when the matching rules
  // are finalized.

  const matchedRecommendations = recommendations.filter(
    (tip) =>
      tip.title.trim() !== "" &&
      tip.description.trim() !== ""
  );

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (!loaded) {
    return (
      <main className="container dashboard-background">
        <p>Loading...</p>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD PAGE
  // ==========================================

  return (
    <main className="container dashboard-background">

      {/* DASHBOARD HEADER */}

      <section className="dashboard-header">
        <h1>Your Biodiversity Dashboard</h1>

        <p>[STUDENTS: WRITE DASHBOARD WELCOME MESSAGE]</p>

        <Link href="/survey" className="secondary-button">
          Edit My Survey Answers
        </Link>
      </section>

      {/* PERSONALIZED RECOMMENDATIONS */}

      <section className="section">
        <h2>Your Recommendations</h2>

        {matchedRecommendations.length === 0 ? (
          <div className="empty-state">
            <h3>Recommendations Coming Soon!</h3>
            <p>
              [STUDENTS: YOUR BIODIVERSITY RECOMMENDATIONS
              WILL APPEAR HERE]
            </p>
          </div>
        ) : (
          <div className="card-grid">
            {matchedRecommendations.map((tip) => {

              // Support both the old single link and
              // the new multiple-link format.
              const tipWithLinks = tip as typeof tip & {
                learnMore?: LearnMoreItem;
                learnMoreLinks?: LearnMoreItem[];
                sources?: NamedSource[];
              };

              const links: LearnMoreItem[] =
                Array.isArray(tipWithLinks.learnMoreLinks) &&
                tipWithLinks.learnMoreLinks.length > 0
                  ? tipWithLinks.learnMoreLinks
                  : tipWithLinks.learnMore
                    ? [tipWithLinks.learnMore]
                    : [];

              // Find the matching animal or plant page.
              const resolvedLinks = links.flatMap((item) => {
                if (!item.id?.trim() || !item.label?.trim()) {
                  return [];
                }

                if (item.type === "animal") {
                  const animal = individualAnimals.find(
                    (entry) => entry.id === item.id
                  );

                  return animal
                    ? [{
                        href: `/animals/${animal.category}#${animal.id}`,
                        label: item.label,
                      }]
                    : [];
                }

                if (item.type === "plant") {
                  const plant = individualPlants.find(
                    (entry) => entry.id === item.id
                  );

                  return plant
                    ? [{
                        href: `/plants/${plant.category}#${plant.id}`,
                        label: item.label,
                      }]
                    : [];
                }

                return [];
              });

              // Only show valid clickable source names.
              const validSources = (
                tipWithLinks.sources ?? []
              ).filter(
                (source) =>
                  source.name?.trim() &&
                  /^https?:\/\//i.test(source.url?.trim() ?? "")
              );

              return (
                <article className="info-card" key={tip.id}>

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

                  {/* CLICKABLE RESEARCH SOURCES */}
                  {validSources.length > 0 && (
                    <div className="recommendation-sources">
                      <h4>Sources</h4>

                      <ul>
                        {validSources.map((source, index) => (
                          <li key={`${source.url}-${index}`}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {source.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* LINKS TO RELATED ANIMALS AND PLANTS */}
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

                  {/* MARK AS COMPLETED */}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => toggleCompleted(tip.id)}
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

            <Link href="/animals" className="secondary-button">
              Explore Animals →
            </Link>
          </div>

          <div className="info-card">
            <h3>Plants & Gardens</h3>
            <p>[STUDENTS: PLANT CONTENT]</p>

            <Link href="/plants" className="secondary-button">
              Explore Plants & Gardens →
            </Link>
          </div>

          <div className="info-card">
            <h3>Wildlife Cam</h3>
            <p>[STUDENTS: WILDLIFE CONTENT]</p>

            <Link href="/wildlife-cam" className="secondary-button">
              Explore Wildlife Photos & Videos →
            </Link>
          </div>

          <div className="info-card">
            <h3>Wildlife Sightings Gallery</h3>

            <p>
              Explore wildlife sightings shared by the community
              and approved by the LEGO Club!
            </p>

            <Link href="/gallery" className="secondary-button">
              View Wildlife Gallery →
            </Link>
          </div>

          <div className="info-card">
            <h3>Share a Wildlife Sighting</h3>

            <p>
              Spotted an animal or plant in Vermont?
              Share your discovery and upload a wildlife photograph!
            </p>

            <Link href="/sightings" className="secondary-button">
              Submit a Sighting →
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
