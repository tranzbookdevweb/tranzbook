import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch a large number of routes ordered by popularity (trip count)
    const routes = await prisma.route.findMany({
      select: {
        id: true,
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
        // Count trips as a popularity metric
        trips: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        trips: {
          _count: 'desc'
        }
      },
    });

    // Process the routes to get trip counts
    const processedRoutes = routes.map(route => ({
      id: route.id,
      startCityId: route.startCity.id,
      startCityName: route.startCity.name,
      endCityId: route.endCity.id,
      endCityName: route.endCity.name,
      imageUrl: route.endCity.imageUrl || "/default-city-image.jpg", // Fallback image
      tripCount: route.trips.length,
    }));

    // Filter out routes where start and end city are the same
    const uniqueRoutes = processedRoutes.filter(
      route => route.startCityId !== route.endCityId
    );

    // Select routes with unique END cities only
    const selectedRoutes = [];
    const usedEndCityIds = new Set();

    for (const route of uniqueRoutes) {
      // Skip if this end city is already used
      if (usedEndCityIds.has(route.endCityId)) {
        continue;
      }

      // Add this route to our selection
      selectedRoutes.push({
        id: route.id,
        image: route.imageUrl,
        from: route.startCityName,
        to: route.endCityName,
      });

      // Mark end city as used
      usedEndCityIds.add(route.endCityId);

      // Stop once we have enough routes
      if (selectedRoutes.length >= 27) {
        break;
      }
    }

    return NextResponse.json({ routes: selectedRoutes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular routes" },
      { status: 500 }
    );
  }
}