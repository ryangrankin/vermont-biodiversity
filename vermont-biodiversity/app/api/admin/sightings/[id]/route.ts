
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  // 1. Verify the administrator's login session.
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "You must be signed in." },
      { status: 401 }
    );
  }

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

  // 2. Verify administrator permissions.
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

  // 3. Read and validate the moderation request.
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body)
  ) {
    return NextResponse.json(
      { error: "Invalid moderation request." },
      { status: 400 }
    );
  }

  const status = body.status;

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json(
      { error: "Invalid moderation action." },
      { status: 400 }
    );
  }

  const photoReviewed =
    "photoReviewed" in body &&
    body.photoReviewed === true;

  // 4. Retrieve the existing sighting.
  const { id } = await params;

  const { data: existingSighting, error: lookupError } =
    await supabaseAdmin
      .from("wildlife_sightings")
      .select("id, photo_path, status")
      .eq("id", id)
      .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Unable to check sighting." },
      { status: 500 }
    );
  }

  if (
    !existingSighting ||
    existingSighting.status !== "pending"
  ) {
    return NextResponse.json(
      { error: "Pending sighting not found." },
      { status: 404 }
    );
  }

  // 5. Require photo review confirmation before approval.
  if (
    status === "approved" &&
    existingSighting.photo_path &&
    !photoReviewed
  ) {
    return NextResponse.json(
      {
        error:
          "Please confirm that you reviewed the photograph before approving.",
      },
      { status: 403 }
    );
  }

  // 6. Approve or reject the pending sighting.
  const { data: sighting, error: updateError } =
    await supabaseAdmin
      .from("wildlife_sightings")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending")
      .select("id, status")
      .maybeSingle();

  if (updateError) {
    return NextResponse.json(
      { error: "Unable to update sighting." },
      { status: 500 }
    );
  }

  if (!sighting) {
    return NextResponse.json(
      { error: "Pending sighting not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    sighting,
  });
}
