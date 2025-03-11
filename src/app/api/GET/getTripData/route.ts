import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        bus: {
          select: {
            busDescription: true, // Bus Name
            company: {
              select: {
                name: true, // Bus Company Name
              },
            },
          },
        },
        route: {
          select: {
            startCity: {
              select: {
                name: true, // Start City Name
              },
            },
            endCity: {
              select: {
                name: true, // End City Name
              },
            },
          },
        },
      },
    });

    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching trips" },
      { status: 500 }
    );
  }
}
