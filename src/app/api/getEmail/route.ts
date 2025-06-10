//api/GET/getEmail
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
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Verify session cookie with revocation check
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Fetch user data
    const userRecord = await adminAuth.getUser(decodedClaims.sub);
    console.log('user email', userRecord.email);
    console.log('user phone', userRecord.phoneNumber);

    // Use email if available, otherwise use phone number
    const userContact = userRecord.email || userRecord.phoneNumber;
    
    if (!userContact) {
      return NextResponse.json(
        { error: "Neither email nor phone number found" },
        { status: 401, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(
      { 
        email: userRecord.email,
        phoneNumber: userRecord.phoneNumber,
        contact: userContact // The contact to use for payment
      },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (error) {
    console.error("Session verification error:", error);

    // Clear invalid session cookie
    const cookieStore = cookies();
    cookieStore.delete("session");

    return NextResponse.json(
      { error: "Invalid session" },
      { status: 401, headers: noStoreHeaders }
    );
  }
}