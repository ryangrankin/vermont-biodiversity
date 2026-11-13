
import { NextRequest, NextResponse, connection } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { validateWildlifeVideo } from "@/lib/validateWildlifeVideo";

// ============================================================
// FEATURE FLAGS
// ============================================================

// Keep photo and text-only submissions working.
const SUBMISSIONS_ENABLED = true;

// Enable only after end-to-end video testing is complete.
const VIDEO_SUBMISSIONS_ENABLED = false;

// ============================================================
// FILE LIMITS
// ============================================================

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 6 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const VIDEO_UPLOAD_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VIDEO_PATH_PATTERN =
  /^pending\/[0-9a-f-]{36}\.(mp4|webm)$/;

// ============================================================
// RESPONSE HELPER
// ============================================================

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// ============================================================
// CLIENT IDENTIFICATION
// ============================================================

function getClientIp(request: NextRequest): string {
  const forwardedFor =
    process.env.NODE_ENV === "development"
      ? "127.0.0.1"
      : request.headers.get("x-vercel-forwarded-for");

  if (!forwardedFor) {
    throw new Error("Trusted client IP is unavailable.");
  }

  const clientIp = forwardedFor.split(",")[0].trim();

  if (!clientIp) {
    throw new Error("Invalid client IP.");
  }

  return clientIp;
}

function getHashedIdentifier(
  request: NextRequest,
  purpose: "sighting" | "video"
): string {
  const secret = process.env.SIGHTING_RATE_LIMIT_SECRET;

  if (!secret) {
    throw new Error("Rate-limit secret is not configured.");
  }

  const clientIp = getClientIp(request);

  const input =
    purpose === "video"
      ? `${secret}:video:${clientIp}`
      : `${secret}:${clientIp}`;

  return createHash("sha256")
    .update(input)
    .digest("hex");
}

// ============================================================
// RATE LIMITING
// ============================================================

async function checkRateLimit(
  request: NextRequest
): Promise<boolean> {
  const identifier = getHashedIdentifier(
    request,
    "sighting"
  );

  const { data, error } = await supabaseAdmin.rpc(
    "check_sighting_rate_limit",
    {
      p_identifier: identifier,
    }
  );

  if (error) {
    console.error("Supabase rate-limit RPC error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    throw new Error("Rate-limit check failed.");
  }

  return data === true;
}

// ============================================================
// SAFELY READ FORM DATA
// ============================================================

// The video itself is uploaded directly to private Supabase
// Storage. This endpoint receives only its upload ID.
//
// Photo uploads still pass through this endpoint and remain
// subject to the existing 6 MB request limit.

async function readLimitedFormData(
  request: NextRequest
): Promise<FormData> {
  const contentLength = request.headers.get(
    "content-length"
  );

  if (
    contentLength !== null &&
    (
      !Number.isFinite(Number(contentLength)) ||
      Number(contentLength) > MAX_REQUEST_SIZE
    )
  ) {
    throw new Error("TOO_LARGE");
  }

  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error("MISSING_BODY");
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_REQUEST_SIZE) {
        await reader.cancel();
        throw new Error("TOO_LARGE");
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = Buffer.concat(
    chunks.map((chunk) => Buffer.from(chunk))
  );

  const boundedRequest = new Request(request.url, {
    method: "POST",
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "",
    },
    body,
  });

  return boundedRequest.formData();
}

// ============================================================
// VERIFY VIDEO UPLOAD RESERVATION
// ============================================================

// Confirm that the upload belongs to this requester,
// remains pending, and has not expired.
//
// The final database RPC repeats critical checks atomically.

async function verifyVideoUpload(
  uploadId: string,
  identifier: string
): Promise<{
  videoPath: string;
  videoType: "video/mp4" | "video/webm";
} | null> {
  const { data: valid, error: verificationError } =
    await supabaseAdmin.rpc(
      "verify_sighting_video_upload",
      {
        p_upload_id: uploadId,
        p_identifier: identifier,
      }
    );

  if (verificationError) {
    console.error(
      "Video verification error:",
      verificationError
    );

    throw new Error("Unable to verify video upload.");
  }

  if (valid !== true) {
    return null;
  }

  const { data: upload, error: lookupError } =
    await supabaseAdmin
      .from("sighting_video_uploads")
      .select("video_path, content_type, expires_at")
      .eq("id", uploadId)
      .eq("upload_identifier", identifier)
      .eq("status", "pending")
      .maybeSingle();

  if (lookupError) {
    console.error(
      "Video reservation lookup error:",
      lookupError
    );

    throw new Error("Unable to retrieve video reservation.");
  }

  if (!upload) {
    return null;
  }

  const expiration = new Date(
    upload.expires_at
  ).getTime();

  if (
    !Number.isFinite(expiration) ||
    expiration <= Date.now()
  ) {
    return null;
  }

  if (
    typeof upload.video_path !== "string" ||
    !VIDEO_PATH_PATTERN.test(upload.video_path)
  ) {
    return null;
  }

  if (
    upload.content_type !== "video/mp4" &&
    upload.content_type !== "video/webm"
  ) {
    return null;
  }

  const expectedExtension =
    upload.content_type === "video/mp4"
      ? ".mp4"
      : ".webm";

  if (!upload.video_path.endsWith(expectedExtension)) {
    return null;
  }

  return {
    videoPath: upload.video_path,
    videoType: upload.content_type,
  };
}

// ============================================================
// VALIDATE OBSERVATION DATE
// ============================================================

function parseObservationDate(
  value: string
): Date | null {
  // Require the same YYYY-MM-DD format used by the form.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const observedAt = new Date(`${value}T00:00:00.000Z`);

  if (!Number.isFinite(observedAt.getTime())) {
    return null;
  }

  // Reject invalid calendar dates that JavaScript normalizes.
  if (
    observedAt.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  // Compare calendar dates rather than UTC midnight against
  // the current instant, avoiding same-day timezone issues.
  const todayUtc = new Date()
    .toISOString()
    .slice(0, 10);

  if (value > todayUtc) {
    return null;
  }

  return observedAt;
}

// ============================================================
// SUBMIT WILDLIFE SIGHTING
// ============================================================

export async function POST(request: NextRequest) {
  await connection();

  // ----------------------------------------------------------
  // CHECK FEATURE AVAILABILITY
  // ----------------------------------------------------------

  if (!SUBMISSIONS_ENABLED) {
    return errorResponse(
      "Wildlife submissions are not enabled yet.",
      503
    );
  }

  // ----------------------------------------------------------
  // APPLY RATE LIMIT
  // ----------------------------------------------------------

  let allowed: boolean;

  try {
    allowed = await checkRateLimit(request);
  } catch (error) {
    console.error("Sighting rate-limit error:", error);

    return errorResponse(
      "Submissions are temporarily unavailable.",
      503
    );
  }

  if (!allowed) {
    return errorResponse(
      "Too many submissions. Please try again later.",
      429
    );
  }

  // ----------------------------------------------------------
  // READ FORM DATA
  // ----------------------------------------------------------

  let formData: FormData;

  try {
    formData = await readLimitedFormData(request);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOO_LARGE"
    ) {
      return errorResponse(
        "Submission is too large. Maximum size is 6 MB.",
        413
      );
    }

    return errorResponse(
      "Invalid submission data.",
      400
    );
  }

  // ----------------------------------------------------------
  // EXTRACT FIELDS
  // ----------------------------------------------------------

  const species = formData.get("species");
  const description = formData.get("description");
  const date = formData.get("date");
  const location = formData.get("location");
  const photo = formData.get("photo");
  const videoUploadId = formData.get("videoUploadId");

  // ----------------------------------------------------------
  // VALIDATE SIGHTING DETAILS
  // ----------------------------------------------------------

  if (
    typeof species !== "string" ||
    !species.trim() ||
    species.length > 100 ||
    typeof location !== "string" ||
    !location.trim() ||
    location.length > 150 ||
    typeof date !== "string" ||
    typeof description !== "string" ||
    description.length > 1000
  ) {
    return errorResponse(
      "Please check your sighting details.",
      400
    );
  }

  const observedAt = parseObservationDate(date);

  if (!observedAt) {
    return errorResponse(
      "Please enter a valid observation date.",
      400
    );
  }

  // ----------------------------------------------------------
  // VALIDATE MEDIA SELECTION
  // ----------------------------------------------------------

  if (photo !== null && videoUploadId !== null) {
    return errorResponse(
      "Please choose either a photograph or a video.",
      400
    );
  }

  if (
    videoUploadId !== null &&
    (
      typeof videoUploadId !== "string" ||
      !VIDEO_UPLOAD_ID_PATTERN.test(videoUploadId)
    )
  ) {
    return errorResponse(
      "Invalid video upload reference.",
      400
    );
  }

  if (
    videoUploadId !== null &&
    !VIDEO_SUBMISSIONS_ENABLED
  ) {
    return errorResponse(
      "Video submissions are not available yet.",
      503
    );
  }

  // ==========================================================
  // PROCESS VIDEO SIGHTING
  // ==========================================================

  if (typeof videoUploadId === "string") {
    try {
      const identifier = getHashedIdentifier(
        request,
        "video"
      );

      // Check ownership, reservation status, expiration,
      // expected MIME type, and storage path.
      const upload = await verifyVideoUpload(
        videoUploadId,
        identifier
      );

      if (!upload) {
        return errorResponse(
          "Video upload is invalid or has expired.",
          400
        );
      }

      // Inspect the private file's header before accepting it.
      const validVideo = await validateWildlifeVideo(
        upload.videoPath,
        upload.videoType
      );

      if (!validVideo) {
        return errorResponse(
          "The uploaded video could not be validated. Please try another MP4 or WebM file.",
          400
        );
      }

      // The database function must perform final checks
      // and insert the pending sighting in one transaction.
      const { data: sightingId, error: videoError } =
        await supabaseAdmin.rpc(
          "complete_sighting_video_upload",
          {
            p_upload_id: videoUploadId,
            p_identifier: identifier,
            p_species: species.trim(),
            p_description: description.trim(),
            p_observed_at: observedAt.toISOString(),
            p_location: location.trim(),
          }
        );

      if (videoError || !sightingId) {
        console.error(
          "Atomic video submission error:",
          videoError
        );

        return errorResponse(
          "Unable to finalize video submission. Please check your video and try again.",
          400
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Your video sighting was submitted for review.",
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Video submission error:", error);

      return errorResponse(
        "Unable to submit video sighting.",
        500
      );
    }
  }

  // ==========================================================
  // PROCESS PHOTO OR TEXT-ONLY SIGHTING
  // ==========================================================

  let photoPath: string | null = null;

  if (photo !== null) {
    // --------------------------------------------------------
    // VALIDATE PHOTOGRAPH
    // --------------------------------------------------------

    if (
      !(photo instanceof File) ||
      !ALLOWED_PHOTO_TYPES.includes(photo.type) ||
      photo.size === 0 ||
      photo.size > MAX_PHOTO_SIZE
    ) {
      return errorResponse(
        "Please upload a JPG, PNG, or WebP image under 5 MB.",
        400
      );
    }

    // --------------------------------------------------------
    // PROCESS AND UPLOAD PHOTOGRAPH
    // --------------------------------------------------------

    try {
      const imageBuffer = Buffer.from(
        await photo.arrayBuffer()
      );

      // Re-encode to WebP without preserving EXIF/GPS metadata.
      const processedImage = await sharp(imageBuffer, {
        limitInputPixels: 25_000_000,
      })
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      photoPath = `${randomUUID()}.webp`;

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from("wildlife-photos")
          .upload(photoPath, processedImage, {
            contentType: "image/webp",
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "Photo upload error:",
          uploadError
        );

        return errorResponse(
          "Unable to upload photograph.",
          500
        );
      }
    } catch (error) {
      console.error(
        "Image processing error:",
        error
      );

      return errorResponse(
        "The photograph could not be processed.",
        400
      );
    }
  }

  // ==========================================================
  // SAVE PHOTO OR TEXT-ONLY SIGHTING
  // ==========================================================

  const mediaType = photoPath ? "photo" : "none";

  const { error: insertError } = await supabaseAdmin
    .from("wildlife_sightings")
    .insert({
      species: species.trim(),
      description: description.trim(),
      observed_at: observedAt.toISOString(),
      location: location.trim(),
      photo_path: photoPath,
      video_path: null,
      media_type: mediaType,
      status: "pending",
    });

  if (insertError) {
    console.error(
      "Sighting insert error:",
      insertError
    );

    // Remove the photo if the database insert failed.
    if (photoPath) {
      const { error: cleanupError } =
        await supabaseAdmin.storage
          .from("wildlife-photos")
          .remove([photoPath]);

      if (cleanupError) {
        console.error(
          "Photo cleanup error:",
          cleanupError
        );
      }
    }

    return errorResponse(
      "Unable to save wildlife sighting.",
      500
    );
  }

  return NextResponse.json(
    {
      success: true,
      message:
        "Your wildlife sighting was submitted for review.",
    },
    { status: 201 }
  );
}
