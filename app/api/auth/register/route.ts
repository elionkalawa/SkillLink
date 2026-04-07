import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password, username } = await req.json();

    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .schema("next_auth")
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const { data: existingUsername } = await supabase
      .schema("next_auth")
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure we generate an ID like next-auth does (UUID usually)
    const { data: user, error } = await supabase
      .schema("next_auth")
      .from("users")
      .insert({
        name,
        email,
        username,
        password_hash: hashedPassword,
        // Optional values depending on how strictly you want to emulate NextAuth registration
        // emailVerified: null,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error during registration:", error);
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration successful", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Registration endpoint error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
