
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type AdminCheck =
  | { error: NextResponse; userId?: never }
  | { error?: never; userId: string };

// Verify that the requester is a signed-in administrator.
async function verifyAdmin(request: NextRequest): Promise<AdminCheck> {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      ),
    };
  }

  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: userData, error: authError } =
    await authClient.auth.getUser(authorization.slice(7));

  if (authError || !userData.user) {
    return {
      error: NextResponse.json(
        { error: "Invalid login session." },
        { status: 401 }
      ),
    };
  }

  const { data: admin, error: adminError } =
    await supabaseAdmin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

  if (adminError) {
    return {
      error: NextResponse.json(
        { error: "Unable to verify administrator access." },
        { status: 500 }
      ),
    };
  }

  if (!admin) {
    return {
      error: NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      ),
    };
  }

  return { userId: userData.user.id };
}

// ==========================================
// PATCH: APPROVE, REJECT, OR EDIT
// ==========================================

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    // Retrieve the current sighting.
    const { data: existing, error: lookupError } =
      await supabaseAdmin
        .from("wildlife_sightings")
        .select("id, status, photo_path")
        .eq("id", id)
        .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: "Unable to retrieve sighting." },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Sighting not found." },
        { status: 404 }
      );
    }

    // ------------------------------------------
    // EXISTING APPROVAL / REJECTION
    // ------------------------------------------

    if ("status" in input) {
      const status = input.status;

      if (status !== "approved" && status !== "rejected") {
        return NextResponse.json(
          { error: "Invalid moderation action." },
          { status: 400 }
        );
      }

      if (existing.status !== "pending") {
        return NextResponse.json(
          { error: "Only pending sightings can be moderated." },
          { status: 409 }
        );
      }

      if (
        status === "approved" &&
        existing.photo_path &&
        input.photoReviewed !== true
      ) {
        return NextResponse.json(
          {
            error:
              "Please confirm that you reviewed the photograph before approving.",
          },
          { status: 403 }
        );
      }

      const { data: sighting, error } =
        await supabaseAdmin
          .from("wildlife_sightings")
          .update({ status })
          .eq("id", id)
          .eq("status", "pending")
          .select("id, status")
          .maybeSingle();

      if (error) {
        return NextResponse.json(
          { error: "Unable to moderate sighting." },
          { status: 500 }
        );
      }

      if (!sighting) {
        return NextResponse.json(
          { error: "Sighting is no longer pending." },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        sighting,
      });
    }

    // ------------------------------------------
    // EDIT AN APPROVED SIGHTING
    // ------------------------------------------

    if (existing.status !== "approved") {
      return NextResponse.json(
        { error: "Only approved sightings can be edited." },
        { status: 409 }
      );
    }

    const allowedFields = [
      "species",
      "description",
      "location",
      "observed_at",
    ] as const;

    const changes: Record<string, string | null> = {};

    for (const field of allowedFields) {
      if (!(field in input)) continue;

      const value = input[field];

      if (field === "description" && value === null) {
        changes[field] = null;
        continue;
      }

      if (typeof value !== "string") {
        return NextResponse.json(
          { error: `Invalid ${field}.` },
          { status: 400 }
        );
      }

      const trimmed = value.trim();

      if (field !== "description" && !trimmed) {
        return NextResponse.json(
          { error: `${field} cannot be empty.` },
          { status: 400 }
        );
      }

      if (trimmed.length > 2000) {
        return NextResponse.json(
          { error: `${field} is too long.` },
          { status: 400 }
        );
      }

      if (field === "observed_at") {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(trimmed) ||
          Number.isNaN(Date.parse(trimmed)) ||
          new Date(trimmed).toISOString().slice(0, 10) !== trimmed
        ) {
          return NextResponse.json(
            { error: "Enter a valid observation date (YYYY-MM-DD)." },
            { status: 400 }
          );
        }
      }

      changes[field] = trimmed;
    }

    if (Object.keys(changes).length === 0) {
      return NextResponse.json(
        { error: "No editable fields were provided." },
        { status: 400 }
      );
    }

    const { data: sighting, error: updateError } =
      await supabaseAdmin
        .from("wildlife_sightings")
        .update(changes)
        .eq("id", id)
        .eq("status", "approved")
        .select(
          "id, species, description, location, observed_at, status"
        )
        .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { error: "Unable to save changes." },
        { status: 500 }
      );
    }

    if (!sighting) {
      return NextResponse.json(
        { error: "Approved sighting no longer available." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      sighting,
    });
  } catch (error) {
    console.error("Admin sighting PATCH error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE: REMOVE AN APPROVED SIGHTING
// ==========================================

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;

    const { data: existing, error: lookupError } =
      await supabaseAdmin
        .from("wildlife_sightings")
        .select("id, status, photo_path")
        .eq("id", id)
        .maybeSingle();

    if (lookupError) {
      return NextResponse.json(
        { error: "Unable to retrieve sighting." },
        { status: 500 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Sighting not found." },
        { status: 404 }
      );
    }

    if (existing.status !== "approved") {
      return NextResponse.json(
        { error: "Only approved sightings can be deleted." },
        { status: 409 }
      );
    }

    // Delete the database record first.
    const { data: deleted, error: deleteError } =
      await supabaseAdmin
        .from("wildlife_sightings")
        .delete()
        .eq("id", id)
        .eq("status", "approved")
        .select("id")
        .maybeSingle();

    if (deleteError) {
      return NextResponse.json(
        { error: "Unable to delete sighting." },
        { status: 500 }
      );
    }

    if (!deleted) {
      return NextResponse.json(
        { error: "Approved sighting no longer available." },
        { status: 409 }
      );
    }

    // Remove the associated photograph.
    // IMPORTANT: Replace "wildlife-photos" if your upload
    // route uses a different Supabase Storage bucket.
    if (existing.photo_path) {
      const { error: storageError } =
        await supabaseAdmin.storage
          .from("wildlife-photos")
          .remove([existing.photo_path]);

      if (storageError) {
        console.error(
          "Sighting deleted, but photo cleanup failed:",
          storageError
        );
      }
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error("Admin sighting DELETE error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
