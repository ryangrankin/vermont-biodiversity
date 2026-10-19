
import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { connection } from "next/server";

// Keep public submissions disabled until testing is complete.
const SUBMISSIONS_ENABLED = true;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 6 * 1024 * 1024;

async function checkRateLimit(request: NextRequest) {
  const secret = process.env.SIGHTING_RATE_LIMIT_SECRET;

  if (!secret) {
    throw new Error("Rate-limit secret is not configured.");
  }

  // This header must be supplied by trusted Vercel infrastructure.
  const forwardedFor =
  process.env.NODE_ENV === "development"
    ? "127.0.0.1"
    : request.headers.get("x-vercel-forwarded-for");

console.log("Rate-limit diagnostics:", {
  environment: process.env.NODE_ENV,
  hasRateLimitSecret: Boolean(
    process.env.SIGHTING_RATE_LIMIT_SECRET
  ),
  hasVercelForwardedFor: Boolean(
    request.headers.get("x-vercel-forwarded-for")
  ),
  hasForwardedFor: Boolean(
    request.headers.get("x-forwarded-for")
  ),
});

  if (!forwardedFor) {
    throw new Error("Trusted client IP is unavailable.");
  }

  const clientIp = forwardedFor.split(",")[0].trim();

  if (!clientIp) {
    throw new Error("Invalid client IP.");
  }

  // Hash the IP instead of storing the raw address.
  const identifier = createHash("sha256")
    .update(`${secret}:${clientIp}`)
    .digest("hex");

  const { data, error } = await supabaseAdmin.rpc(
    "check_sighting_rate_limit",
    { p_identifier: identifier }
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

async function readLimitedFormData(request: NextRequest) {
  const contentLength = request.headers.get("content-length");

  if (
    contentLength !== null &&
    Number(contentLength) > MAX_REQUEST_SIZE
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

export async function POST(request: NextRequest) {
  await connection();
  if (!SUBMISSIONS_ENABLED) {
    return NextResponse.json(
      { error: "Wildlife submissions are not enabled yet." },
      { status: 503 }
    );
  }

  // Apply rate limiting before accepting the submission.
  let allowed: boolean;

  try {
    allowed = await checkRateLimit(request);
  } catch (error) {
    console.error("Sighting rate-limit error:", error);

    return NextResponse.json(
      { error: "Submissions are temporarily unavailable." },
      { status: 503 }
    );
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let formData: FormData;

  try {
    formData = await readLimitedFormData(request);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOO_LARGE"
    ) {
      return NextResponse.json(
        { error: "Submission is too large. Maximum size is 6 MB." },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { error: "Invalid submission data." },
      { status: 400 }
    );
  }

  const species = formData.get("species");
  const description = formData.get("description");
  const date = formData.get("date");
  const location = formData.get("location");
  const photo = formData.get("photo");

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
    return NextResponse.json(
      { error: "Please check your sighting details." },
      { status: 400 }
    );
  }

  const observedAt = new Date(date);

  if (
    !Number.isFinite(observedAt.getTime()) ||
    observedAt.getTime() > Date.now()
  ) {
    return NextResponse.json(
      { error: "Please enter a valid observation date." },
      { status: 400 }
    );
  }

  let photoPath: string | null = null;

  if (photo !== null) {
    if (
      !(photo instanceof File) ||
      !["image/jpeg", "image/png", "image/webp"].includes(
        photo.type
      ) ||
      photo.size === 0 ||
      photo.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "Please upload a JPG, PNG, or WebP image under 5 MB.",
        },
        { status: 400 }
      );
    }

    try {
      const imageBuffer = Buffer.from(
        await photo.arrayBuffer()
      );

      // Re-encode to WebP, removing EXIF and GPS metadata.
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
        console.error("Photo upload error:", uploadError);

        return NextResponse.json(
          { error: "Unable to upload photograph." },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Image processing error:", error);

      return NextResponse.json(
        { error: "The photograph could not be processed." },
        { status: 400 }
      );
    }
  }

  const { error: insertError } = await supabaseAdmin
    .from("wildlife_sightings")
    .insert({
      species: species.trim(),
      description: description.trim(),
      observed_at: observedAt.toISOString(),
      location: location.trim(),
      photo_path: photoPath,
      status: "pending",
    });

  if (insertError) {
    console.error("Sighting insert error:", insertError);

    if (photoPath) {
      await supabaseAdmin.storage
        .from("wildlife-photos")
        .remove([photoPath]);
    }

    return NextResponse.json(
      { error: "Unable to save wildlife sighting." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Your wildlife sighting was submitted for review.",
    },
    { status: 201 }
  );
}
