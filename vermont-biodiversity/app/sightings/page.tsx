
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export default function SightingsPage() {
  const [species, setSpecies] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [today, setToday] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
  const now = new Date();
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  setToday(localDate);
}, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    setErrorMessage("");
    setSuccessMessage("");

    if (photo && photo.size > MAX_PHOTO_SIZE) {
      setErrorMessage("Photographs must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();

    formData.append("species", species.trim());
    formData.append("description", description.trim());
    formData.append("date", date);
    formData.append("location", location.trim());

    if (photo) {
      formData.append("photo", photo);
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/sightings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to submit your sighting."
        );
      }

      setSuccessMessage(
        "Your wildlife sighting was submitted! The LEGO Club will review it before it appears publicly."
      );

      // Reset the form.
      setSpecies("");
      setDescription("");
      setDate("");
      setLocation("");
      setPhoto(null);

      const photoInput = document.getElementById(
        "photo"
      ) as HTMLInputElement | null;

      if (photoInput) {
        photoInput.value = "";
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <h1>Share a Wildlife Sighting</h1>

      <p>
        Help the LEGO Club learn about biodiversity by sharing
        an animal or plant you spotted in Vermont!
      </p>

      <div className="info-card">
        <h2>Submit a Sighting</h2>

        <p>
          Submissions will be reviewed before appearing
          publicly on the website.
        </p>

        <p>
          Please share only a town or general area.
          Do not include home addresses, names, or other
          personal information.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="species">
            Animal or Plant Name
          </label>

          <input
            id="species"
            type="text"
            value={species}
            onChange={(event) =>
              setSpecies(event.target.value)
            }
            maxLength={100}
            required
          />

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            maxLength={1000}
            rows={4}
          />

          <label htmlFor="date">
            Date Observed
          </label>

          <input
            id="date"
            type="date"
            value={date}
            max={today}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
          />

          <label htmlFor="location">
            Approximate Location in Vermont
          </label>

          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="Town or general area (no exact address)"
            maxLength={150}
            required
          />

          <label htmlFor="photo">
            Wildlife Photograph (Optional)
          </label>

          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const selectedPhoto =
                event.target.files?.[0] ?? null;

              setPhoto(selectedPhoto);
              setErrorMessage("");

              if (
                selectedPhoto &&
                selectedPhoto.size > MAX_PHOTO_SIZE
              ) {
                setErrorMessage(
                  "Photographs must be smaller than 5 MB."
                );
              }
            }}
          />

          {photo && (
            <p>
              Selected photograph: {photo.name}
            </p>
          )}

          {errorMessage && (
            <p
              role="alert"
              style={{
                color: "#b91c1c",
                marginTop: 16,
              }}
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              style={{
                color: "#276749",
                marginTop: 16,
              }}
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Sighting"}
          </button>
        </form>
      </div>
    </main>
  );
}
