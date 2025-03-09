import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch routes with their related city data
    const routes = await prisma.route.findMany({
      select: {
        id: true,
        // Include the related city data through the relations
        startCity: {
          select: {
            id: true,
            name: true,
          }
        },
        endCity: {
          select: {
            id: true,
            name: true,      
             imageUrl: true,
          }
        },
        // Count of bookings per route (through trips)
        _count: {
          select: {
            trips: true
          }
        }
      },
      // Limit to 6 routes
      take: 6,
      // Order by number of trips (as a proxy for popularity)
      // This is the correct syntax for Prisma orderBy
      orderBy: {
        trips: {
          _count: 'desc'
        }
      }
    });

    // Transform the data to match the component's expected format
    const popularRoutes = routes.map((route) => ({
      id: route.id,
      // Use the city's imageUrl or fallback to a default pattern
      image: route.endCity.imageUrl || `/Regions/${route.startCity.name.replace(/\s+/g, '')}Region.png`,
      from: route.startCity.name,
      to: route.endCity.name,
    }));

    return NextResponse.json({ routes: popularRoutes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular routes" },
      { status: 500 }
    );
  }
}