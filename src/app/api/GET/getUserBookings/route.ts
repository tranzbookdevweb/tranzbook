import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
        trip: {
          include: {
            route: {
              include: {
                startCity: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                  },
                },
                endCity: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                  },
                },
              },
            },
            bus: {
              select: {
                id: true,
                plateNumber: true,
                capacity: true,
                busDescription: true,
                // Include amenities
                airConditioning: true,
                chargingOutlets: true,
                wifi: true,
                restRoom: true,
                seatBelts: true,
                onboardFood: true,
              },
            },
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                mobile: true,
              },
            },
            tripOccurrences: {
              select: {
                id: true,
                occurrenceDate: true,
                availableSeats: true,
                bookedSeats: true,
                status: true,
              },
            },
          },
        },
        passengerDetails: {
          select: {
            id: true,
            name: true,
            age: true,
            phoneNumber: true,
            kinName: true,
            kinContact: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to make it more readable
    const formattedBookings = bookings.map(booking => ({
      bookingId: booking.id,
      reference: booking.reference,
      bookingDate: booking.date,
      status: booking.status,
      totalAmount: booking.totalAmount,
      seatNumbers: booking.seatNumber,
      
      // User information
      user: {
        id: booking.user.id,
        name: `${booking.user.firstName} ${booking.user.lastName}`,
        email: booking.user.email,
        phoneNumber: booking.user.phoneNumber,
        profileImage: booking.user.profileImage,
      },
      
      // Trip details
      trip: {
        id: booking.trip.id,
        departureTime: booking.trip.departureTime,
        price: booking.trip.price,
        currency: booking.trip.currency,
        recurring: booking.trip.recurring,
        
        // Route information (where they're going)
        route: {
          from: {
            city: booking.trip.route.startCity.name,
            country: booking.trip.route.startCity.country,
          },
          to: {
            city: booking.trip.route.endCity.name,
            country: booking.trip.route.endCity.country,
          },
          duration: booking.trip.route.duration,
          distance: booking.trip.route.distance,
        },
        
        // Bus information
        bus: booking.trip.bus ? {
          plateNumber: booking.trip.bus.plateNumber,
          capacity: booking.trip.bus.capacity,
          description: booking.trip.bus.busDescription,
          amenities: {
            airConditioning: booking.trip.bus.airConditioning,
            chargingOutlets: booking.trip.bus.chargingOutlets,
            wifi: booking.trip.bus.wifi,
            restRoom: booking.trip.bus.restRoom,
            seatBelts: booking.trip.bus.seatBelts,
            onboardFood: booking.trip.bus.onboardFood,
          },
        } : null,
        
        // Driver information
        driver: booking.trip.driver ? {
          name: `${booking.trip.driver.firstName} ${booking.trip.driver.lastName}`,
          mobile: booking.trip.driver.mobile,
        } : null,
        
        // Trip occurrences
        occurrences: booking.trip.tripOccurrences,
      },
      
      // Passenger details
      passengers: booking.passengerDetails,
      
      // Timestamps
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch bookings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}