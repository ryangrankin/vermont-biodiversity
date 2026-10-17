
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Not authenticated." },
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
      { error: "Invalid session." },
      { status: 401 }
    );
  }

  const { data: admin, error: adminError } =
    await supabaseAdmin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

  if (adminError) {
    return NextResponse.json(
      { error: "Unable to verify administrator." },
      { status: 500 }
    );
  }

  if (!admin) {
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 403 }
    );
  }

  const { data: sightings, error: sightingsError } =
    await supabaseAdmin
      .from("wildlife_sightings")
      .select(
        "id, species, description, observed_at, location, photo_path, created_at"
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

  if (sightingsError) {
    return NextResponse.json(
      { error: "Unable to load sightings." },
      { status: 500 }
    );
  }

  return NextResponse.json({ sightings });
}
