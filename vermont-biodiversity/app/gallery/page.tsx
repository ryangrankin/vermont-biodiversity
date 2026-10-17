
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Sighting = {
  id: string;
  species: string;
  description: string | null;
  observed_at: string;
  location: string;
};

export default function GalleryPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
          "Something went wrong while loading the gallery."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSightings();
  }, []);

  return (
    <main className="container">
      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1>Vermont Wildlife Gallery</h1>

      <p>
        Explore the animals and plants spotted by our LEGO Club
        community! Every sighting has been reviewed before
        appearing here.
      </p>

      {loading && <p>Loading wildlife sightings...</p>}

      {errorMessage && (
        <p role="alert">{errorMessage}</p>
      )}

      {!loading && !errorMessage && sightings.length === 0 && (
        <div className="info-card">
          <h2>No sightings yet!</h2>
          <p>
            Once wildlife sightings are approved, they will
            appear here.
          </p>
        </div>
      )}

      {!loading && !errorMessage && sightings.length > 0 && (
        <div className="wildlife-gallery-grid">
          {sightings.map((sighting) => (
            <article
  key={sighting.id}
  className="wildlife-gallery-card"
>
  <img
    src={`/api/gallery/${sighting.id}/photo`}
    alt={`Wildlife sighting of ${sighting.species}`}
    className="wildlife-gallery-photo"
    loading="lazy"
    onError={(event) => {
      event.currentTarget.style.display = "none";
    }}
  />

  <h2>{sighting.species}</h2>

              {sighting.description && (
                <p>{sighting.description}</p>
              )}

              <p>
                <strong>Location:</strong> {sighting.location}
              </p>

              <p>
                <strong>Date observed:</strong>{" "}
                {sighting.observed_at.slice(0, 10)}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
