
import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type VideoType = "video/mp4" | "video/webm";

export async function validateWildlifeVideo(
  videoPath: string,
  expectedType: VideoType
): Promise<boolean> {
  // Only inspect files in our private pending folder.
  if (
    !/^pending\/[0-9a-f-]{36}\.(mp4|webm)$/.test(videoPath)
  ) {
    return false;
  }

  const expectedExtension =
    expectedType === "video/mp4" ? ".mp4" : ".webm";

  if (!videoPath.endsWith(expectedExtension)) {
    return false;
  }

  try {
    // Create a short-lived URL for the private video.
    const { data, error } = await supabaseAdmin.storage
      .from("wildlife-videos")
      .createSignedUrl(videoPath, 60);

    if (error || !data?.signedUrl) {
      return false;
    }

    // Request only the first 4 KB of the file.
    
const response = await fetch(data.signedUrl, {
  headers: {
    Range: "bytes=0-4095",
  },
  cache: "no-store",
  signal: AbortSignal.timeout(10000),
});


    // Require partial-content support to avoid downloading
    // an entire large video.
    if (response.status !== 206) {
      await response.body?.cancel();
      return false;
    }

    const contentRange =
      response.headers.get("content-range");

    if (!contentRange?.startsWith("bytes 0-")) {
      await response.body?.cancel();
      return false;
    }

    const bytes = new Uint8Array(
      await response.arrayBuffer()
    );

    if (bytes.length < 12 || bytes.length > 4096) {
      return false;
    }

    if (expectedType === "video/mp4") {
      // MP4 files normally contain an ftyp box
      // beginning at byte offset 4.
      return (
        bytes[4] === 0x66 &&
        bytes[5] === 0x74 &&
        bytes[6] === 0x79 &&
        bytes[7] === 0x70
      );
    }

    // WebM files use the EBML header.
    return (
      bytes[0] === 0x1a &&
      bytes[1] === 0x45 &&
      bytes[2] === 0xdf &&
      bytes[3] === 0xa3
    );
  } catch (error) {
    console.error("Video validation error:", error);
    return false;
  }
}
