import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET() {
  const noStoreHeaders = new Headers({
    "Cache-Control": "no-store",
  });

  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Fetch user data
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    if (!userRecord.email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 401, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      { email: userRecord.email },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Error fetching user email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: noStoreHeaders }
    );
  }
}