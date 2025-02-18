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

    // Get the current date and time
    const currentDateTime = new Date();
    const currentDateTimeISOString = currentDateTime.toISOString();
    const currentDate = currentDateTimeISOString.split("T")[0]; // Date part (YYYY-MM-DD)
    const currentTime = currentDateTimeISOString.split("T")[1].split(".")[0]; // Time part (HH:mm:ss)

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

    // Compare the trip date with the current date and time
    const tripDateTime = new Date(date); // Trip date (without time)
    const tripDate = tripDateTime.toISOString().split("T")[0]; // Extract trip date (YYYY-MM-DD)

    // Create a filter for trips happening now or in the future
    let departureTimeFilter: any = {
      gte: currentDate + "T" + currentTime, // Filter for trips from the current time onward
    };

    // If the trip's date is in the future, it's valid no matter the time
    if (tripDate > currentDate) {
      departureTimeFilter = {}; // No filter needed for future dates
    } else if (tripDate === currentDate) {
      // For trips on the current date, we need to ensure the time is later than now
      departureTimeFilter = {
        gte: currentDate + "T" + currentTime, // Ensure future trips for today are included
      };
    }

    // Construct the query filters for both specific-date and recurring trips
    const specificDateFilter: any = {
      route: {
        startCity: {
          name: {
            // Use `ilike` for case-insensitive comparison in PostgreSQL
            // or `lower()` for other databases (like MySQL)
            contains: fromLocation,
            mode: "insensitive",
          },        },
        endCity: {
          name: {
            // Use `ilike` for case-insensitive comparison in PostgreSQL
            // or `lower()` for other databases (like MySQL)
            contains: toLocation,
            mode: "insensitive",
          },        },
      },
      date: new Date(date), // Specific date filter
      departureTime: departureTimeFilter, // Apply the departure time filter
      ...timeFilter,
    };

    const recurringFilter: any = {
      route: {
        startCity: {
          name: {
            // Use `ilike` for case-insensitive comparison in PostgreSQL
            // or `lower()` for other databases (like MySQL)
            contains: fromLocation,
            mode: "insensitive",
          },        },
        endCity: {
          name: {
            // Use `ilike` for case-insensitive comparison in PostgreSQL
            // or `lower()` for other databases (like MySQL)
            contains: toLocation,
            mode: "insensitive",
          },
        },
      },
      recurring: true, // Include recurring trips
      departureTime: departureTimeFilter, // Apply the departure time filter
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
        bus: {
          include: {
            company: {
              select: {
                logo: true,
              },
            },
          },
        },
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
