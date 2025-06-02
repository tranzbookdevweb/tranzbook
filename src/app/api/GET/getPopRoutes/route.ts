import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// Define types for better type safety
type RouteWithCount = {
  id: string;
  startCity: {
    id: string;
    name: string;
  };
  endCity: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  _count: {
    trips: number;
  };
}

export async function GET() {
  try {
    // Optimized query with better performance for your schema
    const routes = await Promise.race([
      prisma.route.findMany({
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
          _count: {
            select: {
              trips: true,
            },
          },
        },
        orderBy: {
          trips: {
            _count: 'desc'
          }
        },
        // Reasonable limit to prevent timeout
        take: 50,
        // Simplified where clause - remove the complex NOT condition that's causing issues
        where: {
          AND: [
            { startCityId: { not: "" } },
            { endCityId: { not: "" } }
          ]
        }
      }),
      // Timeout after 8 seconds (Netlify function timeout is 10s)
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 8000)
      )
    ]) as RouteWithCount[];

    // Process the routes more efficiently using _count
    const processedRoutes = routes.map(route => ({
      id: route.id,
      startCityId: route.startCity.id,
      startCityName: route.startCity.name,
      endCityId: route.endCity.id,
      endCityName: route.endCity.name,
      imageUrl: route.endCity.imageUrl || "/default-city-image.jpg",
      tripCount: route._count.trips,
    }));

    // Filter out routes where start and end city are the same
    const uniqueRoutes = processedRoutes.filter(
      route => route.startCityId !== route.endCityId
    );

    // Select routes with unique END cities only
    const selectedRoutes = [];
    const usedEndCityIds = new Set();

    for (const route of uniqueRoutes) {
      if (usedEndCityIds.has(route.endCityId)) {
        continue;
      }

      selectedRoutes.push({
        id: route.id,
        image: route.imageUrl,
        from: route.startCityName,
        to: route.endCityName,
      });

      usedEndCityIds.add(route.endCityId);

      if (selectedRoutes.length >= 27) {
        break;
      }
    }

    // Add cache headers to prevent stale data
    const response = NextResponse.json({ routes: selectedRoutes }, { status: 200 });
    
    // Set cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error: unknown) {
    console.error("Error fetching routes:", error);
    
    // More detailed error logging for production debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: "Failed to fetch popular routes",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    // Ensure connection is closed
    await prisma.$disconnect();
  }
}