
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export async function POST(request: NextRequest) {
  try {
    // Limit request size
    const contentLength = Number(
      request.headers.get("content-length") ?? 0
    );

    if (contentLength > 10000) {
      return NextResponse.json(
        { error: "Submission is too large." },
        { status: 413 }
      );
    }

    // Read submitted information
    let body: Record<string, unknown>;

    try {
      body = await request.json();
      if (!body || typeof body !== "object" ||
          Array.isArray(body)) {
        throw new Error("Invalid body");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid submission format." },
        { status: 400 }
      );
    }

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const suggestedMonth =
      typeof body.suggested_month === "string"
        ? body.suggested_month.trim()
        : null;

    const informationUrl =
      typeof body.information_url === "string"
        ? body.information_url.trim()
        : null;

    // Validate description
    if (!description || description.length > 2000) {
      return NextResponse.json(
        { error: "Please enter an idea under 2000 characters." },
        { status: 400 }
      );
    }

    // Validate optional month
    if (
      suggestedMonth &&
      !MONTHS.includes(suggestedMonth)
    ) {
      return NextResponse.json(
        { error: "Please select a valid month." },
        { status: 400 }
      );
    }

    // Validate optional URL
    if (informationUrl) {
      try {
        const url = new URL(informationUrl);

        if (!["https:", "http:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }

        if (informationUrl.length > 2000) {
          throw new Error("URL too long");
        }
      } catch {
        return NextResponse.json(
          { error: "Please enter a valid website URL." },
          { status: 400 }
        );
      }
    }

    // Save idea for LEGO Club review
    const { error } = await supabaseAdmin
      .from("recommendation_ideas")
      .insert({
        description,
        suggested_month: suggestedMonth || null,
        information_url: informationUrl || null,
        status: "pending",
      });

    if (error) {
      console.error("Recommendation insert error:", error);

      return NextResponse.json(
        { error: "Unable to save your idea. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your idea was submitted for review!",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Recommendation submission error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
