
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const authorization =
      request.headers.get("authorization");

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

    // Check membership in the admin_users table.
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

    // Load pending recommendation ideas.
    const { data: ideas, error: ideasError } =
      await supabaseAdmin
        .from("recommendation_ideas")
        .select(
          "id, description, suggested_month, information_url, created_at"
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (ideasError) {
      console.error("Unable to load ideas:", ideasError);

      return NextResponse.json(
        { error: "Unable to load recommendation ideas." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ideas: ideas ?? [],
    });
  } catch (error) {
    console.error("Admin recommendation API error:", error);

    return NextResponse.json(
      { error: "Unable to load recommendation ideas." },
      { status: 500 }
    );
  }
}
