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

// GET trip by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const date = searchParams.get('date'); // Optional date parameter to check availability for a specific date

  // Validate that ID is provided
  if (!id) {
    return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
  }

  try {
    // Get the trip with all related information
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        bus: {
          include: {
            company: true, // Include the related BusCompany
          },
        },
        driver: true, // Include related driver data
        route: {
          include: {
            startCity: true, // Include start location
            endCity: true,   // Include end location
          },
        },
        bookings: {
          include: {
            user: true, // Include user data from bookings
          },
        },
        // Include trip occurrences only for the specified date or all if no date provided
        tripOccurrences: date ? {
          where: {
            occurrenceDate: new Date(date)
          }
        } : true,
      },
    });

    // Check if trip was found
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Process seat availability information
    let seatAvailability: SeatAvailability[] = [];
    
    // If date is provided, get availability for that specific date
    if (date) {
      const requestedDate = new Date(date);
      
      // Find the trip occurrence for the requested date
      const occurrenceForDate = trip.tripOccurrences[0]; // Only one occurrence due to specific where clause
      
      if (occurrenceForDate) {
        seatAvailability = [{
          date: occurrenceForDate.occurrenceDate,
          availableSeats: occurrenceForDate.availableSeats,
          bookedSeats: occurrenceForDate.bookedSeats,
          status: occurrenceForDate.status
        }];
      } else if (trip.bus) {
        // If no occurrence exists, check if the date is valid for the trip
        const dayOfWeek = requestedDate.getDay() === 0 ? 7 : requestedDate.getDay(); // 1=Monday, ..., 7=Sunday
        const isValidDate = !trip.recurring || (trip.recurring && trip.daysOfWeek.includes(dayOfWeek)) || 
                           (trip.date && new Date(trip.date).toDateString() === requestedDate.toDateString());
        
        if (isValidDate) {
          seatAvailability = [{
            date: requestedDate,
            availableSeats: trip.bus.capacity,
            bookedSeats: [],
            status: "scheduled" as TripStatus
          }];
        }
      }
    } else {
      // If no date is provided, include all existing occurrences
      seatAvailability = trip.tripOccurrences.map(occurrence => ({
        date: occurrence.occurrenceDate,
        availableSeats: occurrence.availableSeats,
        bookedSeats: occurrence.bookedSeats,
        status: occurrence.status
      }));
      
      // For recurring trips, generate upcoming dates
      if (trip.recurring && trip.bus) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        
        if (trip.daysOfWeek && trip.daysOfWeek.length > 0) {
          for (let d = new Date(today); d <= nextMonth; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
            
            if (trip.daysOfWeek.includes(dayOfWeek)) {
              const existingOccurrence = trip.tripOccurrences.find(
                occurrence => new Date(occurrence.occurrenceDate).toDateString() === d.toDateString()
              );
              
              if (!existingOccurrence) {
                seatAvailability.push({
                  date: new Date(d),
                  availableSeats: trip.bus.capacity,
                  bookedSeats: [],
                  status: "scheduled" as TripStatus
                });
              }
            }
          }
        }
      }
    }

    // Create the response object with trip details and seat availability
    const response = {
      ...trip,
      seatAvailability,
      tripOccurrences: undefined, // Mark as optional so we can delete it
    };

    // Remove the tripOccurrences from the response as we've processed this into seatAvailability
    delete response.tripOccurrences;

    // Return the trip details with seat availability
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the trip' }, { status: 500 });
  }
}