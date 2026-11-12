
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExpiredUpload = {
  upload_id: string;
  video_path: string;
};

function authorized(request: NextRequest): boolean {
  const secret = process.env.VIDEO_CLEANUP_SECRET;
  const header = request.headers.get("authorization");

  if (!secret || !header?.startsWith("Bearer ")) {
    return false;
  }

  const provided = Buffer.from(
    header.slice("Bearer ".length)
  );

  const expected = Buffer.from(secret);

  return (
    provided.length === expected.length &&
    timingSafeEqual(provided, expected)
  );
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    // Claim newly expired reservations atomically.
    const { data: claimedData, error: claimError } =
      await supabaseAdmin.rpc(
        "claim_expired_sighting_video_uploads"
      );

    if (claimError) {
      console.error("Video cleanup claim error:", claimError);

      return NextResponse.json(
        { error: "Unable to claim expired uploads." },
        { status: 500 }
      );
    }

    // Retrieve older expired reservations for retry.
    const { data: retryData, error: retryError } =
      await supabaseAdmin.rpc(
        "get_expired_video_cleanup_retries"
      );

    if (retryError) {
      console.error("Video cleanup retry lookup error:", retryError);

      return NextResponse.json(
        { error: "Unable to retrieve cleanup retries." },
        { status: 500 }
      );
    }

    const claimed = (claimedData ?? []) as ExpiredUpload[];
    const retries = (retryData ?? []) as ExpiredUpload[];

    // Avoid processing the same upload twice.
    const uploads = Array.from(
      new Map(
        [...claimed, ...retries].map((upload) => [
          upload.upload_id,
          upload,
        ])
      ).values()
    );

    let cleaned = 0;
    let failed = 0;

    for (const upload of uploads) {
      // Only delete files in the expected pending folder.
      if (
        !/^pending\/[0-9a-f-]{36}\.(mp4|webm)$/.test(
          upload.video_path
        )
      ) {
        failed++;
        continue;
      }

      // Verify this reservation remains expired and unlinked.
      const { data: current, error: lookupError } =
        await supabaseAdmin
          .from("sighting_video_uploads")
          .select("status, sighting_id, video_path")
          .eq("id", upload.upload_id)
          .single();

      if (
        lookupError ||
        !current ||
        current.status !== "expired" ||
        current.sighting_id !== null ||
        current.video_path !== upload.video_path
      ) {
        failed++;
        continue;
      }

      const { error: deleteError } =
        await supabaseAdmin.storage
          .from("wildlife-videos")
          .remove([upload.video_path]);

      if (deleteError) {
        console.error(
          "Video cleanup deletion failed:",
          deleteError
        );
        failed++;
        continue;
      }

      cleaned++;
    }

    return NextResponse.json({
      success: true,
      newlyClaimed: claimed.length,
      retriesFound: retries.length,
      cleaned,
      failed,
    });
  } catch (error) {
    console.error("Video cleanup error:", error);

    return NextResponse.json(
      { error: "Unable to clean expired videos." },
      { status: 500 }
    );
  }
}
