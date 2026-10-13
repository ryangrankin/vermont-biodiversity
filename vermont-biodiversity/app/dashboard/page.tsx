"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recommendations } from "@/data/studentContent";

type SurveyAnswers = Record<string, string | string[]>;

export default function DashboardPage() {
  // ==========================================
  // LOAD USER'S SURVEY ANSWERS
  // ==========================================

  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  useEffect(() => {
  setCurrentMonth(new Date().getMonth() + 1);
}, []);

  useEffect(() => {
    // Load previously saved survey answers.
    const savedAnswers = localStorage.getItem("biodiversitySurvey");

    // Load previously completed activities.
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
  // FILTER PERSONALIZED RECOMMENDATIONS
  // ==========================================
  //
  // This is the basic recommendation system.
  //
  // STUDENTS: You do NOT need to edit this code.
  //
  // Recommendations are written in:
  // src/data/studentContent.ts
  //
  // We will finalize the matching rules after
  // students write their survey questions.
  // ==========================================


  const matchedRecommendations = recommendations.filter((tip) => {
    // Hide recommendations that have not been written yet.
    if (!tip.title.trim() || !tip.description.trim()) {
      return false;
    }

    // Check whether the recommendation applies this month.
    if (
  currentMonth !== null &&
  tip.months.length > 0 &&
  !tip.months.includes(currentMonth)
) {
  return false;
}

    // Temporary lawn and garden matching.
    // We will update this after students choose their answers.
    if (tip.requiresLawn && answers.lawn !== "Yes") {
      return false;
    }

    if (tip.requiresGarden && answers.garden !== "Yes") {
      return false;
    }

    // Match recommendations to selected outdoor interests.
    const tipInterests = tip.interests.filter(
      (interest) => interest.trim() !== ""
    );

    if (tipInterests.length > 0) {
      const savedInterests = answers.interests;

      const userInterests = Array.isArray(savedInterests)
        ? savedInterests
        : typeof savedInterests === "string"
          ? savedInterests.split(",")
          : [];

      const matches = tipInterests.some((interest) =>
        userInterests.includes(interest)
      );

      if (!matches) {
        return false;
      }
    }

    return true;
  });

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (!loaded) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD PAGE
  // ==========================================

  return (
    <main className="container">

      {/* ======================================
          DASHBOARD HEADER
          ====================================== */}

      <section className="dashboard-header">
        <h1>Your Biodiversity Dashboard</h1>

        {/* STUDENTS: Dashboard introduction */}
        <p>[STUDENTS: WRITE DASHBOARD WELCOME MESSAGE]</p>

        <Link href="/survey" className="secondary-button">
          Edit My Survey Answers
        </Link>
      </section>

      {/* ======================================
          PERSONALIZED RECOMMENDATIONS
          ====================================== */}

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
            {matchedRecommendations.map((tip) => (
              <article className="info-card" key={tip.id}>

                {/* Recommendation title */}
                <h3>{tip.title}</h3>

                {/* Recommendation description */}
                <p>{tip.description}</p>

                {/* Why the recommendation matters */}
                {tip.whyItMatters && (
                  <>
                    <h4>Why This Matters</h4>
                    <p>{tip.whyItMatters}</p>
                  </>
                )}

                {/* Mark recommendation completed */}
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
            ))}
          </div>
        )}
      </section>

      {/* ======================================
          COMPLETED ACTIVITIES
          ====================================== */}

      <section className="section">
        <h2>Your Progress</h2>

        <div className="info-card">
          <p>
            Activities Completed:{" "}
            <strong>{completed.length}</strong>
          </p>
        </div>
      </section>

      {/* ======================================
          EXPLORE MORE
          ====================================== */}

      <section className="section">
        <h2>Explore More</h2>

        <div className="card-grid">

          {/* ==================================
              ANIMALS
              ================================== */}

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

          {/* ==================================
    PLANTS & GARDENS
    ================================== */}

<div className="info-card">
  <h3>Plants & Gardens</h3>

  <p>[STUDENTS: PLANT CONTENT]</p>

  <Link href="/plants" className="secondary-button">
    Explore Plants & Gardens →
  </Link>
</div>

          {/* ==================================
              WILDLIFE CAM
              ================================== */}

          <div className="info-card">
  <h3>Wildlife Cam</h3>

  <p>[STUDENTS: WILDLIFE CONTENT]</p>

  <Link href="/wildlife-cam" className="secondary-button">
    Explore Wildlife Photos & Videos →
  </Link>
</div>

        </div>
      </section>

    </main>
  );
}