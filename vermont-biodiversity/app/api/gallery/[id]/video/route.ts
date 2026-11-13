
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};


export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    // ============================================================
    // VALIDATE SIGHTING ID
    // ============================================================

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "Invalid sighting ID." },
        { status: 400 }
      );
    }

    // ============================================================
    // ONLY ALLOW APPROVED VIDEO SIGHTINGS
    // ============================================================

    const { data: sighting, error: lookupError } =
      await supabaseAdmin
        .from("wildlife_sightings")
        .select("video_path, media_type")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();

    if (lookupError) {
      console.error("Gallery video lookup error:", lookupError);

      return NextResponse.json(
        { error: "Unable to load video." },
        { status: 500 }
      );
    }

    if (
      !sighting ||
      sighting.media_type !== "video" ||
      !sighting.video_path
    ) {
      return NextResponse.json(
        { error: "Video not found." },
        { status: 404 }
      );
    }

    // ============================================================
    // VALIDATE STORAGE PATH
    // ============================================================

    if (
      !/^pending\/[0-9a-f-]{36}\.(mp4|webm)$/.test(
        sighting.video_path
      )
    ) {
      return NextResponse.json(
        { error: "Invalid video storage path." },
        { status: 500 }
      );
    }

    // ============================================================
    // CREATE SHORT-LIVED VIDEO ACCESS LINK
    // ============================================================

    const { data, error: signedUrlError } =
      await supabaseAdmin.storage
        .from("wildlife-videos")
        .createSignedUrl(sighting.video_path, 60);

    if (signedUrlError || !data?.signedUrl) {
      console.error(
        "Unable to create gallery video URL:",
        signedUrlError
      );

      return NextResponse.json(
        { error: "Video temporarily unavailable." },
        { status: 503 }
      );
    }

    // ============================================================
    // REDIRECT BROWSER TO PRIVATE STORAGE VIDEO
    // ============================================================

    const response = NextResponse.redirect(
      data.signedUrl,
      307
    );

    response.headers.set(
      "Cache-Control",
      "no-store, private"
    );

    return response;
  } catch (error) {
    console.error("Gallery video error:", error);

    return NextResponse.json(
      { error: "Unable to load video." },
      { status: 500 }
    );
  }
}
