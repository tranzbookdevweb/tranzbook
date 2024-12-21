import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fromLocation = url.searchParams.get("fromLocation") as string;
  const toLocation = url.searchParams.get("toLocation") as string;
  const date = url.searchParams.get("date") as string;
  const sort = url.searchParams.get("sort") as string; // New sort parameter
  const company = url.searchParams.get("company") as string; // Company filter
  const time = url.searchParams.get("time") as string; // Time filter

  try {
    let orderBy: any[] = [];
    let timeFilter: any = {};

    // Get the current time
    const now = new Date();

    // Set sorting logic
    if (sort === "cheapest") {
      orderBy = [{ price: "asc" }];
    } else if (sort === "fastest") {
      orderBy = [{ route: { duration: "asc" } }];
    } else if (sort === "earliest") {
      orderBy = [{ departureTime: "asc" }];
    }

    // Set time filter based on morning, afternoon, evening, and night
    if (time === "morning") {
      timeFilter = {
        departureTime: {
          gte: "05:00:00",
          lt: "12:00:00",
        },
      };
    } else if (time === "afternoon") {
      timeFilter = {
        departureTime: {
          gte: "12:00:00",
          lt: "17:00:00",
        },
      };
    } else if (time === "evening") {
      timeFilter = {
        departureTime: {
          gte: "17:00:00",
          lt: "21:00:00",
        },
      };
    } else if (time === "night") {
      timeFilter = {
        departureTime: {
          gte: "21:00:00",
          lt: "05:00:00",
        },
      };
    }

    // Construct the query filters
    const specificDateFilter: any = {
      route: {
        startCity: {
          name: fromLocation,
        },
        endCity: {
          name: toLocation,
        },
      },
      date: new Date(date), // Specific date filter
      departureTime: {
        gte: now.toISOString().split("T")[1], // Filter out past departure times
      },
      ...timeFilter,
    };

    const recurringFilter: any = {
      route: {
        startCity: {
          name: fromLocation,
        },
        endCity: {
          name: toLocation,
        },
      },
      recurring: true, // Include recurring trips
      departureTime: {
        gte: now.toISOString().split("T")[1], // Filter out past departure times
      },
      ...timeFilter,
    };

    // Add company filter if provided
    if (company) {
      specificDateFilter.branch = {
        company: {
          id: company,
        },
      };
      recurringFilter.branch = {
        company: {
          id: company,
        },
      };
    }

    // Fetch both specific-date and recurring trips
    const trips = await prisma.trip.findMany({
      where: {
        OR: [specificDateFilter, recurringFilter],
      },
      orderBy,
      include: {
        branch: {
          include: {
            company: {
              select: {
                logo: true,
              },
            },
          },
        },
        bus: true,
        route: {
          include: {
            startCity: true,
            endCity: true,
          },
        },
        driver: true,
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
