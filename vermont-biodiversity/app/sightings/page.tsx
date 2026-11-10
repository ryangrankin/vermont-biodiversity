
"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const MONTHS = [
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

export default function SightingsPage() {
  // ============================================================
  // WILDLIFE SIGHTING FORM
  // ============================================================

  const [species, setSpecies] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [today, setToday] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================
  // RECOMMENDATION IDEA FORM
  // ============================================================

  const [ideaDescription, setIdeaDescription] = useState("");
  const [ideaMonth, setIdeaMonth] = useState("");
  const [ideaUrl, setIdeaUrl] = useState("");

  const [ideaSubmitting, setIdeaSubmitting] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");

  // ============================================================
  // SET TODAY'S DATE
  // ============================================================

  useEffect(() => {
    const now = new Date();

    const localDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
  }, []);

  // ============================================================
  // SUBMIT WILDLIFE SIGHTING
  // ============================================================

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

      // Reset wildlife form
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

  // ============================================================
  // SUBMIT RECOMMENDATION IDEA
  // ============================================================

  async function handleIdeaSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (ideaSubmitting) return;

    setIdeaError("");
    setIdeaSuccess("");
    setIdeaSubmitting(true);

    try {
      const response = await fetch(
        "/api/recommendation-ideas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: ideaDescription.trim(),
            suggested_month: ideaMonth || null,
            information_url: ideaUrl.trim() || null,
          }),
        }
      );

      // Safely handle API responses
      const responseText = await response.text();

      let result: {
        success?: boolean;
        error?: string;
      } = {};

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          "The server returned an invalid response. Please try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to submit your recommendation idea."
        );
      }

      setIdeaSuccess(
        "Thank you for sharing your idea! The LEGO Club will review it and decide whether to add it to the app."
      );

      // Reset recommendation form
      setIdeaDescription("");
      setIdeaMonth("");
      setIdeaUrl("");
    } catch (error) {
      setIdeaError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIdeaSubmitting(false);
    }
  }

  // ============================================================
  // PAGE CONTENT
  // ============================================================

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

      {/* ======================================================
          WILDLIFE SIGHTING FORM
      ====================================================== */}

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

      {/* ======================================================
          SHARE A RECOMMENDATION IDEA
          Visitors can suggest biodiversity activities.
          LEGO Club admins review ideas before publication.
      ====================================================== */}

      <div
        className="info-card"
        style={{ marginTop: 32 }}
      >
        <h2>Share a Recommendation Idea</h2>

        <p>
          Have an idea for an activity, project, or way to
          help Vermont&apos;s biodiversity? Share it with
          the LEGO Club!
        </p>

        <p>
          The LEGO Club will review your recommendation
          and decide whether to add it to the app.
          Please do not include personal information.
        </p>

        <form onSubmit={handleIdeaSubmit}>
          {/* IDEA DESCRIPTION */}

          <label htmlFor="idea-description">
            Describe Your Idea
          </label>

          <textarea
            id="idea-description"
            value={ideaDescription}
            onChange={(event) =>
              setIdeaDescription(event.target.value)
            }
            placeholder="Describe your activity or recommendation idea..."
            maxLength={2000}
            rows={5}
            required
          />

          {/* SUGGESTED MONTH */}

          <label htmlFor="idea-month">
            Suggested Month (Optional)
          </label>

          <select
            id="idea-month"
            value={ideaMonth}
            onChange={(event) =>
              setIdeaMonth(event.target.value)
            }
          >
            <option value="">
              Any Month / Not Sure
            </option>

            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* INFORMATION URL */}

          <label htmlFor="idea-url">
            URL for More Information (Optional)
          </label>

          <input
            id="idea-url"
            type="url"
            value={ideaUrl}
            onChange={(event) =>
              setIdeaUrl(event.target.value)
            }
            placeholder="https://example.com"
            maxLength={2000}
          />

          <p>
            You can include a link to an article,
            educational resource, or website that
            explains your idea.
          </p>

          {/* ERROR MESSAGE */}

          {ideaError && (
            <p
              role="alert"
              style={{
                color: "#b91c1c",
                marginTop: 16,
              }}
            >
              {ideaError}
            </p>
          )}

          {/* SUCCESS MESSAGE */}

          {ideaSuccess && (
            <p
              role="status"
              style={{
                color: "#276749",
                marginTop: 16,
              }}
            >
              {ideaSuccess}
            </p>
          )}

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="primary-button"
            disabled={ideaSubmitting}
          >
            {ideaSubmitting
              ? "Submitting..."
              : "Submit Recommendation Idea"}
          </button>
        </form>
      </div>
    </main>
  );
}
