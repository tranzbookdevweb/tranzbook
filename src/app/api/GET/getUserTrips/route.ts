import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';

// Define interfaces for type safety
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
  tripDetails: {
    departureTime: string;
    basePrice: number;
    commission: number;
    commissionType: string;
    recurring: boolean;
    daysOfWeek: number[] | null;
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const noStoreHeaders = new Headers({
    'Cache-Control': 'no-store',
  });

  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'User not authenticated or email not found' },
        { status: 401, headers: noStoreHeaders }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      select: {
        id: true,
        status: true,
        date: true,
        seatNumber: true,
        totalAmount: true,
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

      return {
        id: booking.id,
        tripId: trip.id,
        company: trip.bus?.company?.name ?? 'Unknown',
        route: `${trip.route.startCity.name}, ${trip.route.startCity.country} to ${trip.route.endCity.name}, ${trip.route.endCity.country}`,
        date: tripDate ?? '',
        totalAmount: booking.totalAmount ?? 0,
        currency: trip.currency,
        status,
        seatNumbers: booking.seatNumber,
        tripDetails: {
          departureTime: trip.departureTime,
          basePrice: trip.price,
          commission: trip.commission,
          commissionType: trip.commissionType,
          recurring: trip.recurring,
          daysOfWeek: trip.recurring ? trip.daysOfWeek : null,
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
    console.log('data',trips)
    return NextResponse.json({ trips }, { status: 200, headers: noStoreHeaders });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips. Please try again later.' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}