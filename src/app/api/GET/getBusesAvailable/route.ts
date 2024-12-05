import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all trips and their associated routes to check their end time
    const trips = await prisma.trip.findMany({
      include: {
        route: true, // Include route to get the duration
        bus: true, // Include bus to check status
        driver: true, // Include driver to check status
      },
    });

    const currentTime = new Date();

    // Iterate over trips and check if any trip is over
    for (const trip of trips) {
      const { departureTime, route, bus, driver } = trip;

      // Calculate trip end time based on departure time and route duration
      const departureDate = new Date(departureTime);
      const [hours, minutes] = departureTime.split(":").map(Number);
      departureDate.setHours(hours, minutes);

      const tripEndTime = new Date(departureDate.getTime() + route.duration * 60000);

      if (currentTime >= tripEndTime) {
        // Update the bus status to "available" if the trip is over
        await prisma.bus.update({
          where: { id: bus.id },
          data: { status: "available" },
        });

        // Update the driver status to "available" if the trip is over
        await prisma.driver.update({
          where: { id: driver.id },
          data: { status: "available" },
        });
      }
    }

    // Fetch buses that are available
    const buses = await prisma.bus.findMany({
      where: {
        status: 'available',
      },
    });

    return NextResponse.json(buses, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching buses' }, { status: 500 });
  }
}
