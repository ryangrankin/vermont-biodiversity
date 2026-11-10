
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const informationUrl =
      typeof body.information_url === "string"
        ? body.information_url.trim()
        : "";

    const months = body.months;

    // Validate the title.
    if (!title || title.length > 150) {
      return NextResponse.json(
        { error: "Please enter a title of 1–150 characters." },
        { status: 400 }
      );
    }

    // Validate the description.
    if (!description || description.length > 2000) {
      return NextResponse.json(
        { error: "Please enter a description of 1–2000 characters." },
        { status: 400 }
      );
    }

    // Validate selected months.
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
        { error: "Invalid month selection." },
        { status: 400 }
      );
    }

    // Validate optional URL.
    if (informationUrl) {
      try {
        const url = new URL(informationUrl);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return NextResponse.json(
          { error: "Please enter a valid website URL." },
          { status: 400 }
        );
      }
    }

    // Save as pending for LEGO Club review.
    const { error } = await supabaseAdmin
      .from("recommendation_ideas")
      .insert({
        title,
        description,
        months,
        information_url: informationUrl || null,
        suggested_month: null,
        status: "pending",
      });

    if (error) {
      console.error("Recommendation submission error:", error);

      return NextResponse.json(
        { error: "Unable to save recommendation idea." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Recommendation submitted for review.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Recommendation API error:", error);

    return NextResponse.json(
      { error: "Unable to process recommendation submission." },
      { status: 500 }
    );
  }
}
