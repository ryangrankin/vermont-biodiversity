
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Get the admin's authentication token
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

    // Verify the user is a LEGO Club administrator
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

    // Read the recommendation ID
    const { id } = await context.params;

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    ) {
      return NextResponse.json(
        { error: "Invalid recommendation ID." },
        { status: 400 }
      );
    }

    // Validate the requested action
    let body: { status?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (
      body?.status !== "approved" &&
      body?.status !== "rejected"
    ) {
      return NextResponse.json(
        { error: "Status must be approved or rejected." },
        { status: 400 }
      );
    }

    // Update only a pending recommendation
    const { data: updatedIdea, error: updateError } =
      await supabaseAdmin
        .from("recommendation_ideas")
        .update({
          status: body.status,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("status", "pending")
        .select("id, status")
        .maybeSingle();

    if (updateError) {
      console.error("Recommendation review error:", updateError);

      return NextResponse.json(
        { error: "Unable to review recommendation." },
        { status: 500 }
      );
    }

    if (!updatedIdea) {
      return NextResponse.json(
        {
          error:
            "Recommendation not found or already reviewed.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      idea: updatedIdea,
    });
  } catch (error) {
    console.error("Recommendation moderation error:", error);

    return NextResponse.json(
      { error: "Unable to process recommendation review." },
      { status: 500 }
    );
  }
}
