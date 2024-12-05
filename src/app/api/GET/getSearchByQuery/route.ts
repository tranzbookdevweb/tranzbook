import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fromLocation = url.searchParams.get('fromLocation') as string;
  const toLocation = url.searchParams.get('toLocation') as string;
  const date = url.searchParams.get('date') as string;

  try {
    const trips = await prisma.trip.findMany({
      where: {
        route: {
          startCity: {
            name: fromLocation // Filter by name
          },
          endCity: {
            name: toLocation // Filter by name
          }
        },
        date: new Date(date) // Filter by date
      },
      include: {
        branch: {
          include: {
            company: {
              select: {
                logo: true 
              }
            }
          }
        },
        bus: true,
        route: {
          include: {
            startCity: true, // Include startCity
            endCity: true    // Include endCity
          }
        },
        driver: true
      }
    });

    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching trips' }, { status: 500 });
  }
}
