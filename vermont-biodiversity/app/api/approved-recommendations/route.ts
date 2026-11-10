
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("recommendation_ideas")
      .select(
        "id, title, description, interests, months, requires_lawn, requires_garden, information_url"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load approved recommendations:", error);

      return NextResponse.json(
        { error: "Unable to load recommendations." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { recommendations: data ?? [] },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Approved recommendations API error:", error);

    return NextResponse.json(
      { error: "Unable to load recommendations." },
      { status: 500 }
    );
  }
}
