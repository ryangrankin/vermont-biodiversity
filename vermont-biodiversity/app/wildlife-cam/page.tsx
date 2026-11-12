
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { wildlifeContent } from "@/data/studentContent";

type Sighting = {
  id: string;
  species: string;
  description: string | null;
  observed_at: string;
  location: string;
};

export default function WildlifePage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // LOAD APPROVED WILDLIFE SIGHTINGS
  // ==========================================

  useEffect(() => {
    async function loadSightings() {
      try {
        const response = await fetch("/api/gallery", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load sightings.");
        }

        const data = await response.json();
        setSightings(data.sightings ?? []);
      } catch {
        setErrorMessage(
          "Something went wrong while loading wildlife sightings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSightings();
  }, []);

  return (
    <main className="container">

      {/* BACK TO DASHBOARD */}

      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      {/* PAGE HEADER */}

      <h1>Wildlife Cam</h1>

      <p>[STUDENTS: WRITE AN INTRODUCTION TO THIS PAGE]</p>

      {/* ==========================================
          APPROVED COMMUNITY WILDLIFE SIGHTINGS
      ========================================== */}

      <section className="section">
        <h2>Community Wildlife Sightings</h2>

        <p>
          Explore wildlife sightings submitted by our community
          and approved by the LEGO Club!
        </p>

        {loading && <p>Loading wildlife sightings...</p>}

        {errorMessage && (
          <p role="alert">{errorMessage}</p>
        )}

        {!loading &&
          !errorMessage &&
          sightings.length === 0 && (
            <div className="info-card">
              <p>
                No approved wildlife sightings yet.
                Check back soon!
              </p>
            </div>
          )}

        {!loading &&
          !errorMessage &&
          sightings.length > 0 && (
            <div className="wildlife-gallery-grid">
              {sightings.map((sighting) => (
                <article
                  key={sighting.id}
                  className="wildlife-gallery-card"
                >
                  <img
                    src={`/api/gallery/${encodeURIComponent(
                      sighting.id
                    )}/photo`}
                    alt={`Wildlife sighting of ${sighting.species}`}
                    className="wildlife-gallery-photo"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <h3>{sighting.species}</h3>

                  {sighting.description && (
                    <p>{sighting.description}</p>
                  )}

                  <p>
                    <strong>Location:</strong>{" "}
                    {sighting.location}
                  </p>

                  <p>
                    <strong>Date observed:</strong>{" "}
                    {sighting.observed_at.slice(0, 10)}
                  </p>
                </article>
              ))}
            </div>
          )}
      </section>

      {/* ==========================================
          STUDENT-CREATED WILDLIFE CONTENT
      ========================================== */}

      <section className="section">
        <h2>LEGO Club Wildlife Content</h2>

        <div className="card-grid">
          {wildlifeContent.map((wildlife, index) => (
            <article className="info-card" key={index}>

              {/* IMAGE OR PLACEHOLDER */}

              {wildlife.image ? (
                <Image
                  src={wildlife.image}
                  alt={wildlife.title}
                  width={400}
                  height={250}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <div className="wildlife-image-placeholder">
                  [STUDENTS: CHOOSE A WILDLIFE IMAGE]
                </div>
              )}

              {/* STUDENT TITLE */}

              <h2>{wildlife.title}</h2>

              {/* STUDENT DESCRIPTION */}

              <h3>About This Wildlife</h3>
              <p>{wildlife.description}</p>

              {/* STUDENT SOURCE */}

              <h3>Image / Information Source</h3>
              <p>{wildlife.source}</p>

            </article>
          ))}
        </div>
      </section>

    </main>
  );
}
