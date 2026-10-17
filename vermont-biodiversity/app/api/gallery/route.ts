
import { NextResponse } from "next/server";
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  await connection();

  const { data: sightings, error } = await supabaseAdmin
    .from("wildlife_sightings")
    .select(
      "id, species, description, observed_at, location"
    )
    .eq("status", "approved")
    .order("observed_at", { ascending: false });

  if (error) {
    console.error("Gallery loading error:", error);

    return NextResponse.json(
      { error: "Unable to load wildlife sightings." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    sightings: sightings ?? [],
  });
}
