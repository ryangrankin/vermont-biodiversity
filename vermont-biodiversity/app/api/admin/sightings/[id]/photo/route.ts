
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    );
  }

  // Verify the Supabase login session.
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: userData, error: authError } =
    await authClient.auth.getUser(
      authorization.slice(7)
    );

  if (authError || !userData.user) {
    return NextResponse.json(
      { error: "Invalid login session." },
      { status: 401 }
    );
  }

  // Verify administrator permissions.
  const { data: admin, error: adminError } =
    await supabaseAdmin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

  if (adminError) {
    return NextResponse.json(
      { error: "Unable to verify administrator access." },
      { status: 500 }
    );
  }

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 }
    );
  }

  const { id } = await params;

  // Retrieve the photo path for this sighting.
  const { data: sighting, error: sightingError } =
    await supabaseAdmin
      .from("wildlife_sightings")
      .select("photo_path")
      .eq("id", id)
      .single();

  if (sightingError || !sighting?.photo_path) {
    return NextResponse.json(
      { error: "Photograph not found." },
      { status: 404 }
    );
  }

  // Download the photograph from private storage.
  const { data: photo, error: downloadError } =
    await supabaseAdmin.storage
      .from("wildlife-photos")
      .download(sighting.photo_path);

  if (downloadError || !photo) {
    return NextResponse.json(
      { error: "Unable to load photograph." },
      { status: 500 }
    );
  }

  const image = await photo.arrayBuffer();

  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
