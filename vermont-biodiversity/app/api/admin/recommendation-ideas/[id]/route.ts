
import { connection } from "next/server";
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
    // 1. Verify the user's session.
    await connection();
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
      await authClient.auth.getUser(authorization.slice(7));

    if (authError || !userData.user) {
      return NextResponse.json(
        { error: "Invalid session." },
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

    // 3. Validate the recommendation ID.
    const { id } = await context.params;

    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "Invalid recommendation ID." },
        { status: 400 }
      );
    }

    // 4. Read and validate the review request.
    let body: Record<string, unknown>;

    try {
      const parsed: unknown = await request.json();

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        throw new Error("Invalid body");
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    if (
      body.status !== "approved" &&
      body.status !== "rejected"
    ) {
      return NextResponse.json(
        { error: "Invalid review status." },
        { status: 400 }
      );
    }

    // 5. Prepare the database update.
    const updates: Record<string, unknown> = {
      status: body.status,
      reviewed_at: new Date().toISOString(),
    };

    if (body.status === "approved") {
      const title =
        typeof body.title === "string"
          ? body.title.trim()
          : "";

      // These match the current survey answer options.
      const validInterests = [
        "Hiking",
        "Mountian Biking",
        "Boating",
        "Birdwatching",
      ];

      const interests = body.interests;
      const months = body.months;

      if (!title || title.length > 150) {
        return NextResponse.json(
          { error: "Enter a title of 1–150 characters." },
          { status: 400 }
        );
      }

      if (
        !Array.isArray(interests) ||
        !interests.every(
          (interest) =>
            typeof interest === "string" &&
            validInterests.includes(interest)
        )
      ) {
        return NextResponse.json(
          { error: "Invalid interest categories." },
          { status: 400 }
        );
      }

      if (
        !Array.isArray(months) ||
        !months.every(
          (month) =>
            typeof month === "number" &&
            Number.isInteger(month) &&
            month >= 1 &&
            month <= 12
        )
      ) {
        return NextResponse.json(
          { error: "Invalid months." },
          { status: 400 }
        );
      }

      if (
        typeof body.requires_lawn !== "boolean" ||
        typeof body.requires_garden !== "boolean"
      ) {
        return NextResponse.json(
          {
            error: "Invalid lawn or garden requirements.",
          },
          { status: 400 }
        );
      }

      updates.title = title;
      updates.interests = interests;
      updates.months = months;
      updates.requires_lawn = body.requires_lawn;
      updates.requires_garden = body.requires_garden;
    }

    // 6. Update only a pending recommendation.
    const { data: updatedIdea, error: updateError } =
      await supabaseAdmin
        .from("recommendation_ideas")
        .update(updates)
        .eq("id", id)
        .eq("status", "pending")
        .select("id, status")
        .maybeSingle();

    if (updateError) {
      console.error(
        "Recommendation review error:",
        updateError
      );

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

    // Approval stores the recommendation in Supabase.
    // The public dashboard will load approved ideas separately.
    return NextResponse.json({
      success: true,
      idea: updatedIdea,
    });
  } catch (error) {
    console.error(
      "Recommendation moderation error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to process recommendation review.",
      },
      { status: 500 }
    );
  }
}
