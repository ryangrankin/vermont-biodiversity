
import { NextRequest, NextResponse, connection } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  await connection();

  try {
    // ============================================================
    // VERIFY ADMINISTRATOR LOGIN
    // ============================================================

    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);

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

    // ============================================================
    // CHECK ADMINISTRATOR PERMISSIONS
    // ============================================================

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

    // ============================================================
    // LOAD PENDING AND APPROVED WILDLIFE SIGHTINGS
    // ============================================================

    const { data: sightings, error: sightingsError } =
      await supabaseAdmin
        .from("wildlife_sightings")
        .select(
          "id, species, description, observed_at, location, photo_path, video_path, media_type, created_at, status"
        )
        .in("status", ["pending", "approved"])
        .order("created_at", { ascending: false });

    if (sightingsError) {
      console.error("Admin sightings lookup error:", sightingsError);

      return NextResponse.json(
        { error: "Unable to load wildlife sightings." },
        { status: 500 }
      );
    }

    // ============================================================
    // GENERATE TEMPORARY PRIVATE VIDEO PREVIEW LINKS
    // ============================================================

    const sightingsWithMedia = await Promise.all(
      (sightings ?? []).map(async (sighting) => {
        let videoUrl: string | null = null;

        if (sighting.video_path) {
          const { data, error } = await supabaseAdmin.storage
            .from("wildlife-videos")
            .createSignedUrl(sighting.video_path, 300);

          if (error) {
            console.error(
              "Admin video preview error:",
              error
            );
          } else {
            videoUrl = data?.signedUrl ?? null;
          }
        }

        return {
          ...sighting,
          video_url: videoUrl,
        };
      })
    );

    return NextResponse.json({
      sightings: sightingsWithMedia,
    });
  } catch (error) {
    console.error("Admin sightings API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
