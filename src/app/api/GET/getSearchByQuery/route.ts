import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { TripStatus } from "@prisma/client";

// Define the type for seat availability
interface SeatAvailability {
  date: Date;
  availableSeats: number;
  bookedSeats: number[];
  status: TripStatus;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fromLocation = url.searchParams.get("fromLocation") as string;
  const toLocation = url.searchParams.get("toLocation") as string;
  const date = url.searchParams.get("date") as string;
  const sort = url.searchParams.get("sort") as string;
  const company = url.searchParams.get("company") as string;
  const time = url.searchParams.get("time") as string;
  const ticketQuantity = parseInt(url.searchParams.get("ticketQuantity") || "1");

  try {
    // Get current date and time
    const currentDateTime = new Date();
    const currentDate = currentDateTime.toISOString().split("T")[0];
    const currentTime = currentDateTime.toISOString().split("T")[1].split(".")[0];

    // Validate requested date
    const requestedDate = new Date(date);
    const requestedDateStr = requestedDate.toISOString().split("T")[0];

    // Return empty array if date is in the past
    if (requestedDateStr < currentDate) {
      return NextResponse.json([], { status: 200 });
    }

    let orderBy: any[] = [];
    let timeFilter: any = {};

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

    // Set departure time filter for current date
    let departureTimeFilter: any = {};
    if (requestedDateStr === currentDate) {
      departureTimeFilter = {
        gte: currentTime,
      };
    }

    // Construct query filters for both specific-date and recurring trips
    const specificDateFilter: any = {
      route: {
        startCity: {
          name: {
            contains: fromLocation,
            mode: "insensitive",
          },
        },
        endCity: {
          name: {
            contains: toLocation,
            mode: "insensitive",
          },
        },
      },
      date: requestedDate,
      departureTime: departureTimeFilter,
      ...timeFilter,
      tripOccurrences: {
        some: {
          occurrenceDate: requestedDate,
        },
      },
    };

    const recurringFilter: any = {
      route: {
        startCity: {
          name: {
            contains: fromLocation,
            mode: "insensitive",
          },
        },
        endCity: {
          name: {
            contains: toLocation,
            mode: "insensitive",
          },
        },
      },
      recurring: true,
      departureTime: departureTimeFilter,
      ...timeFilter,
    };

    // Add company filter if provided
    if (company) {
      specificDateFilter.bus = {
        company: {
          id: company,
        },
      };
      recurringFilter.bus = {
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
                name: true,
                id: true,
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
        tripOccurrences: {
          where: {
            occurrenceDate: requestedDate,
          },
        },
      },
    });

    // Process seat availability for each trip
    const tripsWithAvailability = trips.map((trip) => {
      let seatAvailability: SeatAvailability[] = [];

      // Check for existing occurrence on the specified date
      const occurrenceForDate = trip.tripOccurrences[0];

      if (occurrenceForDate) {
        seatAvailability = [{
          date: occurrenceForDate.occurrenceDate,
          availableSeats: occurrenceForDate.availableSeats,
          bookedSeats: occurrenceForDate.bookedSeats,
          status: occurrenceForDate.status,
        }];
      } else if (trip.bus && trip.recurring) {
        // For recurring trips, check if the requested date is valid
        const dayOfWeek = requestedDate.getDay() === 0 ? 7 : requestedDate.getDay();
        const isValidDate = trip.daysOfWeek?.includes(dayOfWeek);

        if (isValidDate) {
          seatAvailability = [{
            date: requestedDate,
            availableSeats: trip.bus.capacity,
            bookedSeats: [],
            status: "scheduled" as TripStatus,
          }];
        }
      } else if (trip.bus && trip.date && new Date(trip.date).toDateString() === requestedDate.toDateString()) {
        // For one-time trips on the specific date
        seatAvailability = [{
          date: requestedDate,
          availableSeats: trip.bus.capacity,
          bookedSeats: [],
          status: "scheduled" as TripStatus,
        }];
      }

      // Create response object with seat availability
      const response = {
        ...trip,
        seatAvailability,
        tripOccurrences: undefined, // Mark as optional
      };

      // Remove tripOccurrences from response
      delete response.tripOccurrences;

      return response;
    });

    // Filter trips based on ticket quantity and valid availability
    const filteredTrips = tripsWithAvailability.filter(trip => {
      const availability = trip.seatAvailability[0];
      return availability && availability.availableSeats >= ticketQuantity;
    });

    return NextResponse.json(filteredTrips, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching trips" },
      { status: 500 }
    );
  }
}