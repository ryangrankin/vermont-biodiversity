
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = body.password;
    const signupCode =
  body.code ??
  body.signupCode ??
  body.adminCode ??
  body.inviteCode;

    // Shared code stored securely on the server
    const correctCode = process.env.ADMIN_SIGNUP_CODE;

    if (!correctCode) {
      return NextResponse.json(
        { error: "Admin signup is not configured." },
        { status: 500 }
      );
    }

    if (
      !email ||
      typeof password !== "string" ||
      typeof signupCode !== "string"
    ) {
      return NextResponse.json(
        { error: "Email, password, and signup code are required." },
        { status: 400 }
      );
    }

    if (signupCode !== correctCode) {
      return NextResponse.json(
        { error: "Invalid admin signup code." },
        { status: 403 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Create an individual account for this admin.
    // This requires the Supabase service-role client.
    const { data, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError || !data.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Unable to create account." },
        { status: 400 }
      );
    }

    // Grant admin access
    const { error: adminError } = await supabaseAdmin
      .from("admin_users")
      .insert({ user_id: data.user.id });

    if (adminError) {
      // Roll back the new account if admin access fails
      await supabaseAdmin.auth.admin.deleteUser(data.user.id);

      return NextResponse.json(
        { error: "Unable to grant admin access." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created. You can now log in.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin signup error:", error);

    return NextResponse.json(
      { error: "Unable to process admin signup." },
      { status: 500 }
    );
  }
}
