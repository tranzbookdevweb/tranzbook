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
  // Add ticket quantity param
  const ticketQuantity = parseInt(url.searchParams.get("ticketQuantity") || "1");

  try {
    let orderBy: any[] = [];
    let timeFilter: any = {};

    // Get the current date and time
    const currentDateTime = new Date();
    const currentDateTimeISOString = currentDateTime.toISOString();
    const currentDate = currentDateTimeISOString.split("T")[0];
    const currentTime = currentDateTimeISOString.split("T")[1].split(".")[0];

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
    const tripDateTime = new Date(date);
    const tripDate = tripDateTime.toISOString().split("T")[0];

    // Create a filter for trips happening now or in the future
    let departureTimeFilter: any = {
      gte: currentDate + "T" + currentTime,
    };

    if (tripDate > currentDate) {
      departureTimeFilter = {};
    } else if (tripDate === currentDate) {
      departureTimeFilter = {
        gte: currentDate + "T" + currentTime,
      };
    }

    // Construct the query filters for both specific-date and recurring trips
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
      date: new Date(date),
      departureTime: departureTimeFilter,
      ...timeFilter,
      tripOccurrences: {
        some: {
          occurrenceDate: new Date(date),
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
            occurrenceDate: new Date(date),
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
      } else if (trip.bus) {
        // If no occurrence exists, check if the date is valid for the trip
        const requestedDate = new Date(date);
        const dayOfWeek = requestedDate.getDay() === 0 ? 7 : requestedDate.getDay();
        const isValidDate =
          !trip.recurring ||
          (trip.recurring && trip.daysOfWeek?.includes(dayOfWeek)) ||
          (trip.date && new Date(trip.date).toDateString() === requestedDate.toDateString());

        if (isValidDate) {
          seatAvailability = [{
            date: requestedDate,
            availableSeats: trip.bus.capacity,
            bookedSeats: [],
            status: "scheduled" as TripStatus,
          }];
        }
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

    // Filter trips based on ticket quantity
    const filteredTrips = tripsWithAvailability.filter(trip => {
      // Get the availability for the requested date
      const availability = trip.seatAvailability[0];
      
      // Only include trips that have enough available seats
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