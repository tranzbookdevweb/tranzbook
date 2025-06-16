import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import prisma from '@/app/lib/db';

// Define interfaces for type safety
interface PassengerDetail {
  name: string;
  phoneNumber: string;
  email?: string;
  kinName: string;
  kinContact: string;
  kinEmail?: string;
}

interface TripResponse {
  id: string;
  tripId: string;
  company: string;
  route: string;
  date: string;
  totalAmount: number;
  currency: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  seatNumbers: number[];
  passengers: PassengerDetail[];
  tripDetails: {
    departureTime: string;
    arrivalTime?: string;
    basePrice: number;
    commission: number;
    commissionType: string;
    recurring: boolean;
    daysOfWeek: number[] | null;
    duration?: number;
    bus: {
      plateNumber: string;
      capacity: number;
      description: string | null;
      status: string;
      image: string | null;
      amenities: {
        airConditioning: boolean;
        chargingOutlets: boolean;
        wifi: boolean;
        restRoom: boolean;
        seatBelts: boolean;
        onboardFood: boolean;
      };
    } | null;
    route: {
      duration: number;
      distance: number;
    };
    driver: {
      name: string;
      mobile: string | null;
      status: string;
    } | null;
    occurrence: {
      occurrenceDate: string;
      status: string;
      availableSeats: number;
      bookedSeats: number[];
    } | null;
  };
}

interface TripOccurrence {
  id: string;
  occurrenceDate: Date;
  status: string;
  availableSeats: number;
  bookedSeats: number[];
}

// Helper function to calculate arrival time
function calculateArrivalTime(departureTime: string, date: string, duration: number): string {
  // Parse departure time (assumed format: HH:mm)
  const [hours, minutes] = departureTime.split(':').map(Number);
  
  // Combine date and departure time
  const departureDateTime = new Date(date);
  departureDateTime.setHours(hours, minutes, 0, 0);
  
  // Add duration (in minutes) to departure time
  const arrivalDateTime = new Date(departureDateTime.getTime() + duration * 60 * 1000);
  
  // Format arrival time as HH:mm
  const arrivalHours = String(arrivalDateTime.getHours()).padStart(2, '0');
  const arrivalMinutes = String(arrivalDateTime.getMinutes()).padStart(2, '0');
  return `${arrivalHours}:${arrivalMinutes}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const noStoreHeaders = new Headers({
    'Cache-Control': 'no-store',
  });

  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Verify session cookie with revocation check
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Fetch user data
    const userRecord = await adminAuth.getUser(decodedClaims.sub);

    if (!userRecord || !userRecord.email) {
      return NextResponse.json(
        { error: 'User not authenticated or email not found' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    // Find user in Prisma database
    const dbUser = await prisma.user.findUnique({
      where: { email: userRecord.email },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    // Fetch bookings with passenger details
    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      select: {
        id: true,
        reference: true,
        status: true,
        date: true,
        seatNumber: true,
        totalAmount: true,
        passengerDetails: {
          select: {
            name: true,
            phoneNumber: true,
            email: true,
            kinName: true,
            kinContact: true,
            kinEmail: true,
          },
        },
        trip: {
          select: {
            id: true,
            departureTime: true,
            price: true,
            currency: true,
            recurring: true,
            daysOfWeek: true,
            commission: true,
            commissionType: true,
            date: true,
            bus: {
              select: {
                plateNumber: true,
                capacity: true,
                busDescription: true,
                status: true,
                image: true,
                airConditioning: true,
                chargingOutlets: true,
                wifi: true,
                restRoom: true,
                seatBelts: true,
                onboardFood: true,
                company: {
                  select: { name: true },
                },
              },
            },
            route: {
              select: {
                startCity: { select: { name: true, country: true } },
                endCity: { select: { name: true, country: true } },
                duration: true,
                distance: true,
              },
            },
            driver: {
              select: {
                firstName: true,
                lastName: true,
                mobile: true,
                status: true,
              },
            },
            tripOccurrences: {
              select: {
                id: true,
                occurrenceDate: true,
                status: true,
                availableSeats: true,
                bookedSeats: true,
              },
            },
          },
        },
      },
    });

    const currentDate = new Date();
    const trips: TripResponse[] = bookings.map((booking) => {
      const trip = booking.trip;

      // Find the relevant TripOccurrence
      const relevantOccurrence: TripOccurrence | undefined = trip.tripOccurrences.find((occ) => {
        const occDate = new Date(occ.occurrenceDate);
        const bookingDate = new Date(booking.date);
        return (
          occDate.getFullYear() === bookingDate.getFullYear() &&
          occDate.getMonth() === bookingDate.getMonth() &&
          occDate.getDate() === bookingDate.getDate()
        );
      });

      let status: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
      let tripDate: string | undefined;

      if (booking.status === 'cancelled') {
        status = 'cancelled';
      } else if (relevantOccurrence) {
        tripDate = relevantOccurrence.occurrenceDate.toISOString();
        switch (relevantOccurrence.status) {
          case 'cancelled':
            status = 'cancelled';
            break;
          case 'completed':
            status = 'completed';
            break;
          case 'inProgress':
          case 'scheduled':
            status = new Date(relevantOccurrence.occurrenceDate) < currentDate ? 'completed' : 'upcoming';
            break;
        }
      } else {
        // Fallback to trip.date if no occurrence is found
        tripDate = trip.date?.toISOString();
        if (tripDate && new Date(tripDate) < currentDate) {
          status = 'completed';
        }
      }

      // Calculate arrival time if duration and departure time are available
      const arrivalTime = trip.departureTime && trip.route.duration && tripDate
        ? calculateArrivalTime(trip.departureTime, tripDate, trip.route.duration)
        : undefined;

      return {
        id: booking.id,
        reference: booking.reference,
        tripId: trip.id,
        company: trip.bus?.company?.name ?? 'Unknown',
        route: `${trip.route.startCity.name}, ${trip.route.startCity.country} to ${trip.route.endCity.name}, ${trip.route.endCity.country}`,
        date: tripDate ?? '',
        totalAmount: booking.totalAmount ?? 0,
        currency: trip.currency,
        status,
        seatNumbers: booking.seatNumber,
        passengers: booking.passengerDetails.map((pd) => ({
          name: pd.name,
          phoneNumber: pd.phoneNumber,
          email: pd.email ?? undefined,
          kinName: pd.kinName,
          kinContact: pd.kinContact,
          kinEmail: pd.kinEmail ?? undefined,
        })),
        tripDetails: {
          departureTime: trip.departureTime,
          arrivalTime, // Set calculated arrival time
          basePrice: trip.price,
          commission: trip.commission,
          commissionType: trip.commissionType,
          recurring: trip.recurring,
          daysOfWeek: trip.recurring ? trip.daysOfWeek : null,
          duration: trip.route.duration,
          bus: trip.bus
            ? {
                plateNumber: trip.bus.plateNumber ?? 'N/A',
                capacity: trip.bus.capacity,
                description: trip.bus.busDescription ?? null,
                status: trip.bus.status,
                image: trip.bus.image ?? null,
                amenities: {
                  airConditioning: trip.bus.airConditioning,
                  chargingOutlets: trip.bus.chargingOutlets,
                  wifi: trip.bus.wifi,
                  restRoom: trip.bus.restRoom,
                  seatBelts: trip.bus.seatBelts,
                  onboardFood: trip.bus.onboardFood,
                },
              }
            : null,
          route: {
            duration: trip.route.duration,
            distance: trip.route.distance,
          },
          driver: trip.driver
            ? {
                name: `${trip.driver.firstName} ${trip.driver.lastName}`,
                mobile: trip.driver.mobile ?? null,
                status: trip.driver.status,
              }
            : null,
          occurrence: relevantOccurrence
            ? {
                occurrenceDate: relevantOccurrence.occurrenceDate.toISOString(),
                status: relevantOccurrence.status,
                availableSeats: relevantOccurrence.availableSeats,
                bookedSeats: relevantOccurrence.bookedSeats,
              }
            : null,
        },
      };
    });

    console.log('data', trips);
    return NextResponse.json({ trips }, { status: 200, headers: noStoreHeaders });
  } catch (error) {
    console.error('Error fetching trips:', error);

    // Clear invalid session cookie
    const cookieStore = cookies();
    cookieStore.delete('session');

    return NextResponse.json(
      { error: 'Invalid session or failed to fetch trips' },
      { status: 401, headers: noStoreHeaders }
    );
  }
}