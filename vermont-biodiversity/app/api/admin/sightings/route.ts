
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { connection } from "next/server";

export async function GET(request: NextRequest) {
  await connection();

  try {
    // Get the administrator's access token.
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);

    // Verify the user's Supabase session.
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const { data: userData, error: authError } =
      await authClient.auth.getUser(token);

    if (authError || !userData.user) {
      return NextResponse.json(
        { error: "Invalid login session." },
        { status: 401 }
      );
    }

    // Check whether the user is an administrator.
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

    // Retrieve pending wildlife sightings.
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
        { error: "Unable to load wildlife sightings." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sightings: sightings ?? [],
    });
  } catch (error) {
    console.error("Admin sightings API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
