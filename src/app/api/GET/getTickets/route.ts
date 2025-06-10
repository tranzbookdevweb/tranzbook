import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get reference from query parameters to match frontend
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('ref');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference number is required' },
        { status: 400 }
      );
    }

    // Fetch booking with all related data
    const booking = await prisma.booking.findUnique({
      where: {
        reference: reference,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
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
                    currency: true,
                  },
                },
                endCity: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    currency: true,
                  },
                },
                branch: {
                  include: {
                    company: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        logo: true,
                      },
                    },
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
                image: true,
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
          },
        },
        passengerDetails: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
            kinName: true,
            kinContact: true,
            kinEmail: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Calculate arrival time (departure time + duration)
    const calculateArrivalTime = (departureTime: string, duration: number) => {
      const [hours, minutes] = departureTime.split(':').map(Number);
      const departureMinutes = hours * 60 + minutes;
      const arrivalMinutes = departureMinutes + duration;
      
      const arrivalHours = Math.floor(arrivalMinutes / 60) % 24;
      const arrivalMins = arrivalMinutes % 60;
      
      return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')}`;
    };

    // Format the response to exactly match frontend expectations
    const formattedBooking = {
      // Booking details
      ticketId: booking.id,
      reference: booking.reference,
      totalCost: booking.totalAmount,
      selectedSeats: booking.seatNumber ? booking.seatNumber.map(seat => seat.toString()) : [],
      isBooked: booking.status === 'confirmed',
      currentDate: booking.date,
      
      // Trip details
      tripDepartureTime: booking.trip.departureTime,
      tripArrivalTime: calculateArrivalTime(
        booking.trip.departureTime, 
        booking.trip.route.duration
      ),
      tripDuration: booking.trip.route.duration,
      busFare: booking.trip.price,
      currency: booking.trip.currency,
      
      // Route details
      busRoute: {
        origin: booking.trip.route.startCity.name,
        destination: booking.trip.route.endCity.name,
      },
      
      // Bus details
      busNumber: booking.trip.bus?.plateNumber || 'N/A',
      busDescription: booking.trip.bus?.busDescription || 'Standard Bus',
      busCompany: booking.trip.route.branch.company.name,
      
      // Bus amenities - ensure all required properties exist
      busAmenities: {
        airConditioning: booking.trip.bus?.airConditioning || false,
        chargingOutlets: booking.trip.bus?.chargingOutlets || false,
        wifi: booking.trip.bus?.wifi || false,
        restRoom: booking.trip.bus?.restRoom || false,
        seatBelts: booking.trip.bus?.seatBelts || false,
        onboardFood: booking.trip.bus?.onboardFood || false,
      },
      
      // Driver details
      driver: booking.trip.driver ? {
        name: `${booking.trip.driver.firstName} ${booking.trip.driver.lastName}`,
        mobile: booking.trip.driver.mobile,
      } : null,
      
      // Passenger details
      passengerDetails: booking.passengerDetails.map(passenger => ({
        name: passenger.name,
        phoneNumber: passenger.phoneNumber,
        email: passenger.email,
        kinName: passenger.kinName,
        kinContact: passenger.kinContact,
        kinEmail: passenger.kinEmail,
      })),
      
      // User details
      user: {
        id: booking.user.id,
        name: `${booking.user.firstName} ${booking.user.lastName}`,
        email: booking.user.email,
        phoneNumber: booking.user.phoneNumber,
      },
      
      // Company details
      company: {
        id: booking.trip.route.branch.company.id,
        name: booking.trip.route.branch.company.name,
        email: booking.trip.route.branch.company.email,
        logo: booking.trip.route.branch.company.logo,
      },
      
      // Additional booking info
      bookingStatus: booking.status,
      bookingDate: booking.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedBooking,
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative function if you want to use it as a regular function instead of API route
export async function getBookingByReference(reference: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { reference },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        trip: {
          include: {
            route: {
              include: {
                startCity: true,
                endCity: true,
                branch: {
                  include: {
                    company: true,
                  },
                },
              },
            },
            bus: true,
            driver: true,
          },
        },
        passengerDetails: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Utility function to validate booking reference format
export function validateBookingReference(reference: string): boolean {
  // Assuming reference format is something like TB-XXXXXXXX or similar
  // Adjust this regex based on your actual reference format
  const referenceRegex = /^[A-Z0-9]{6,20}$/i;
  return referenceRegex.test(reference);
}