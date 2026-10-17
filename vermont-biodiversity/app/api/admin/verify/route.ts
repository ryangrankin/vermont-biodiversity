
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json(
      { authorized: false },
      { status: 401 }
    );
  }

  const token = authorization.slice(7);

  // Verify the token with Supabase Auth.
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data: userData, error: userError } =
    await supabaseAuth.auth.getUser(token);

  if (userError || !userData.user) {
    return NextResponse.json(
      { authorized: false },
      { status: 401 }
    );
  }

  // Check administrator permissions on the server.
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

  return NextResponse.json({
    authorized: Boolean(admin),
  });
}
