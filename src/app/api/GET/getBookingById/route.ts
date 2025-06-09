import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Verify session cookie with revocation check
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Fetch user data
    const userRecord = await adminAuth.getUser(decodedClaims.sub);

    if (!userRecord) {
      // Clear invalid session cookie
      const cookieStore = cookies();
      cookieStore.delete("session");
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Extract filters from query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., "Upcoming", "Past", "Cancelled"

    // Define the base filter conditions
    const filter: any = { userId: userRecord.uid }; // Use Firebase UID

    // Get current date and time
    const now = new Date();

    // Apply specific filters based on the status
    if (status === "Upcoming") {
      filter.trip = { date: { gte: now } };
      filter.status = "pending";
    } else if (status === "Past") {
      filter.trip = { date: { lt: now } };
      filter.status = "Completed";
    } else if (status === "Cancelled") {
      filter.status = "Cancelled";
    }

    // Fetch bookings with applied filters
    const bookings = await prisma.booking.findMany({
      where: filter,
      include: {
        trip: {
          include: {
            route: {
              include: {
                startCity: true,
                endCity: true,
              },
            },
            bus: true,
            driver: true,
          },
        },
        user: true,
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error("Session verification or booking fetch error:", error);
    // Clear invalid session cookie
    const cookieStore = cookies();
    cookieStore.delete("session");
    return NextResponse.json(
      { error: "Invalid session or failed to fetch bookings", details: error.message },
      { status: 401 }
    );
  }
}