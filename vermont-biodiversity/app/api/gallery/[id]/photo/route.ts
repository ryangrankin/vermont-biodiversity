
import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  await connection();

  const { id } = await params;

  // Only look up approved wildlife sightings.
  const { data: sighting, error: lookupError } =
    await supabaseAdmin
      .from("wildlife_sightings")
      .select("photo_path")
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Unable to load photograph." },
      { status: 500 }
    );
  }

  if (!sighting?.photo_path) {
    return NextResponse.json(
      { error: "Photograph not found." },
      { status: 404 }
    );
  }

  // Retrieve the photograph from private storage.
  const { data: photo, error: photoError } =
    await supabaseAdmin.storage
      .from("wildlife-photos")
      .download(sighting.photo_path);

  if (photoError || !photo) {
    return NextResponse.json(
      { error: "Unable to retrieve photograph." },
      { status: 404 }
    );
  }

  const imageBytes = await photo.arrayBuffer();

  return new NextResponse(imageBytes, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
