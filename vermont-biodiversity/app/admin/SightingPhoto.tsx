
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  sightingId: string;
  onLoaded?: () => void;
};

export default function SightingPhoto({
  sightingId,
  onLoaded,
}: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadPhoto() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError || !data.session) {
          throw new Error("Please sign in to view this photograph.");
        }

        const response = await fetch(
          `/api/admin/sightings/${encodeURIComponent(sightingId)}/photo`,
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load photograph.");
        }

        const blob = await response.blob();

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load photograph."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPhoto();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [sightingId]);

  if (loading) {
    return <p>Loading photograph...</p>;
  }

  if (error) {
    return <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>;
  }

  if (!photoUrl) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <img
        src={photoUrl}
        alt="Submitted wildlife sighting photograph"
        onLoad={onLoaded}
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: 350,
          objectFit: "contain",
          borderRadius: 8,
        }}
      />
    </div>
  );
}
