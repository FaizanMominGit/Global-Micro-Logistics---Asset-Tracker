import { signIn } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Auth.js signIn will set the session cookie on success
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    // Auth.js redirects are handled by throwing an error in some contexts, 
    // but with redirect: false it should return the result or throw a specific error.
    return NextResponse.json({ success: true });
  }
}
