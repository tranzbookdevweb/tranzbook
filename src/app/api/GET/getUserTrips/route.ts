import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';

export async function GET(request: NextRequest) {
  // Disable caching for this route
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

    // Find the user in Prisma by email to get the userId
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    const userId = dbUser.id;

    // Fetch user's bookings
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            bus: {
              include: {
                company: true,
              },
            },
            route: {
              include: {
                startCity: true,
                endCity: true,
              },
            },
            tripOccurrences: true,
          },
        },
      },
    });

    // Categorize trips
    const trips = bookings.map((booking) => {
      const trip = booking.trip;
      const occurrence = trip.tripOccurrences[0]; // Use the first occurrence for simplicity
      const currentDate = new Date();
      let status: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';

      if (booking.status === 'cancelled') {
        status = 'cancelled';
      } else if (occurrence) {
        const occurrenceDate = new Date(occurrence.occurrenceDate);
        if (occurrence.status === 'completed') {
          status = 'completed';
        } else if (occurrence.status === 'cancelled') {
          status = 'cancelled';
        } else if (occurrenceDate < currentDate) {
          status = 'completed'; // Assume past trips are completed if not cancelled
        }
      }

      return {
        id: booking.id, // Booking ID for cancellation
        tripId: trip.id,
        company: trip.bus?.company?.name || 'Unknown',
        route: `${trip.route.startCity.name} to ${trip.route.endCity.name}`,
        date: occurrence?.occurrenceDate.toISOString() || trip.date?.toISOString() || '',
        price: trip.price,
        currency: trip.currency,
        status,
      };
    });

    return NextResponse.json(
      { trips },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  // Disable caching for this route
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

    // Find the user in Prisma by email to get the userId
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    const userId = dbUser.id;
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    // Fetch the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: { include: { tripOccurrences: true } } },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    if (booking.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to cancel this booking' },
        { status: 403, headers: noStoreHeaders }
      );
    }

    // Check if the booking is already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking already cancelled' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    // Check if the trip is upcoming
    const occurrence = booking.trip.tripOccurrences[0];
    const currentDate = new Date();
    const occurrenceDate = occurrence ? new Date(occurrence.occurrenceDate) : booking.trip.date ? new Date(booking.trip.date) : null;

    if (!occurrenceDate || occurrenceDate < currentDate) {
      return NextResponse.json(
        { error: 'Cannot cancel past or completed trips' },
        { status: 400, headers: noStoreHeaders }
      );
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' },
    });

    // Create a BusCancellation record
    await prisma.busCancellation.create({
      data: {
        bookingDate: new Date(),
        userId,
        tripId: booking.tripId,
        seatNumber: booking.seatNumber[0] || 0, // Use first seat for simplicity
        refundAmount: booking.totalAmount * 0.9, // Example: 90% refund
        currency: booking.trip.currency,
        status: 'cancelled',
      },
    });

    // Update TripOccurrence to free up seats
    if (occurrence) {
      await prisma.tripOccurrence.update({
        where: { id: occurrence.id },
        data: {
          availableSeats: { increment: booking.seatNumber.length },
          bookedSeats: { set: occurrence.bookedSeats.filter((seat) => !booking.seatNumber.includes(seat)) },
        },
      });
    }

    return NextResponse.json(
      { message: 'Trip cancelled successfully' },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (error) {
    console.error('Error cancelling trip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}