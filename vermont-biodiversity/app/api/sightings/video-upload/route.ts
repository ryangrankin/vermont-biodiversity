
import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
];

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SIGHTING_RATE_LIMIT_SECRET;

    if (!secret) {
      throw new Error("Rate-limit secret is not configured.");
    }

    // Only trust the IP header supplied by Vercel.
    const forwardedFor =
      process.env.NODE_ENV === "development"
        ? "127.0.0.1"
        : request.headers.get("x-vercel-forwarded-for");

    if (!forwardedFor) {
      return NextResponse.json(
        { error: "Unable to verify request." },
        { status: 503 }
      );
    }

    const clientIp = forwardedFor.split(",")[0].trim();

    if (!clientIp) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    // Never store the visitor's raw IP address.
    const uploadIdentifier = createHash("sha256")
      .update(`${secret}:video:${clientIp}`)
      .digest("hex");

    const body = await request.json();

    const { fileSize, fileType } = body;

    if (
      !Number.isSafeInteger(fileSize) ||
      fileSize <= 0 ||
      fileSize > MAX_VIDEO_SIZE ||
      !ALLOWED_VIDEO_TYPES.includes(fileType)
    ) {
      return NextResponse.json(
        {
          error:
            "Please select an MP4 or WebM video under 50 MB.",
        },
        { status: 400 }
      );
    }

    const extension =
      fileType === "video/mp4" ? "mp4" : "webm";

    const videoPath =
      `pending/${randomUUID()}.${extension}`;

    // Atomically check the hourly limit and reserve
    // this upload in the database.
    const { data: uploadId, error: reservationError } =
      await supabaseAdmin.rpc(
        "reserve_sighting_video_upload",
        {
          p_identifier: uploadIdentifier,
          p_video_path: videoPath,
          p_file_size: fileSize,
          p_content_type: fileType,
        }
      );

    if (reservationError) {
      console.error(
        "Video reservation error:",
        reservationError
      );

      return NextResponse.json(
        { error: "Unable to reserve video upload." },
        { status: 500 }
      );
    }

    if (!uploadId) {
      return NextResponse.json(
        {
          error:
            "Too many video uploads. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Generate a temporary upload token.
    const { data, error: uploadError } =
      await supabaseAdmin.storage
        .from("wildlife-videos")
        .createSignedUploadUrl(videoPath);

    if (uploadError || !data) {
      console.error(
        "Video authorization error:",
        uploadError
      );

      // Keep the reservation so failed attempts
      // still count toward the hourly limit.
      return NextResponse.json(
        { error: "Unable to authorize video upload." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploadId,
      path: videoPath,
      token: data.token,
    });
  } catch (error) {
    console.error(
      "Video upload authorization error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to prepare video upload." },
      { status: 500 }
    );
  }
}
