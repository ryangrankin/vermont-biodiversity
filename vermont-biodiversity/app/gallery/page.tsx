
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Sighting = {
  id: string;
  species: string;
  description: string | null;
  observed_at: string;
  location: string;
  photo_path?: string | null;
  video_path?: string | null;
  media_type?: "none" | "photo" | "video";
};

export default function GalleryPage() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedSighting, setSelectedSighting] =
    useState<Sighting | null>(null);

  // ============================================================
  // LOAD APPROVED WILDLIFE SIGHTINGS
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function loadSightings() {
      try {
        const response = await fetch("/api/gallery", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load sightings.");
        }

        const data = await response.json();

        if (!cancelled) {
          setSightings(data.sightings ?? []);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage(
            "Something went wrong while loading the gallery."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSightings();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // PHOTO VIEWER KEYBOARD AND SCROLL HANDLING
  // ============================================================

  useEffect(() => {
    if (!selectedSighting) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSighting(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSighting]);

  // ============================================================
  // GALLERY
  // ============================================================

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

      {!loading &&
        !errorMessage &&
        sightings.length === 0 && (
          <div className="info-card">
            <h2>No sightings yet!</h2>
            <p>
              Once wildlife sightings are approved, they
              will appear here.
            </p>
          </div>
        )}

      {!loading &&
        !errorMessage &&
        sightings.length > 0 && (
          <div className="wildlife-gallery-grid">
            {sightings.map((sighting) => {
              const hasVideo =
                sighting.media_type === "video" &&
                Boolean(sighting.video_path);

              const hasPhoto =
                Boolean(sighting.photo_path) &&
                !hasVideo;

              return (
                <article
                  key={sighting.id}
                  className="wildlife-gallery-card"
                >
                  {/* =====================================
                      VIDEO PLAYER
                  ===================================== */}

                  {hasVideo && (
                    <div>
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={`Wildlife video of ${sighting.species}`}
                        className="wildlife-gallery-photo"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "auto",
                          maxHeight: 350,
                          objectFit: "contain",
                          backgroundColor: "#111",
                          borderRadius: 10,
                        }}
                      >
                        <source
                          src={`/api/gallery/${encodeURIComponent(
                            sighting.id
                          )}/video`}
                        />
                        Your browser does not support video
                        playback.
                      </video>

                      <p
                        style={{
                          fontSize: 13,
                          marginTop: 8,
                          opacity: 0.8,
                        }}
                      >
                        Wildlife video
                      </p>
                    </div>
                  )}

                  {/* =====================================
                      CLICKABLE PHOTO
                  ===================================== */}

                  {hasPhoto && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSighting(sighting)
                      }
                      aria-label={`Enlarge photograph of ${sighting.species}`}
                      title="Click to enlarge photograph"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: 0,
                        margin: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "zoom-in",
                      }}
                    >
                      <img
                        src={`/api/gallery/${encodeURIComponent(
                          sighting.id
                        )}/photo`}
                        alt={`Wildlife sighting of ${sighting.species}`}
                        className="wildlife-gallery-photo"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </button>
                  )}

                  {/* =====================================
                      SIGHTING DETAILS
                  ===================================== */}

                  <h2>{sighting.species}</h2>

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
              );
            })}
          </div>
        )}

      {/* ======================================================
          FULL-SIZE PHOTO VIEWER
      ====================================================== */}

      {selectedSighting && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph of ${selectedSighting.species}`}
          onClick={() => setSelectedSighting(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.94)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedSighting(null)}
            aria-label="Close enlarged photograph"
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              zIndex: 10000,
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              fontSize: 28,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "100%",
              maxHeight: "100%",
              gap: 14,
            }}
          >
            <img
              src={`/api/gallery/${encodeURIComponent(
                selectedSighting.id
              )}/photo`}
              alt={`Full-size wildlife sighting of ${selectedSighting.species}`}
              style={{
                display: "block",
                maxWidth: "95vw",
                maxHeight: "78vh",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />

            <div
              style={{
                color: "white",
                textAlign: "center",
                maxWidth: 600,
              }}
            >
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "white",
                }}
              >
                {selectedSighting.species}
              </h2>

              <p style={{ margin: 0, opacity: 0.85 }}>
                {selectedSighting.location}
                {" • "}
                {selectedSighting.observed_at.slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
