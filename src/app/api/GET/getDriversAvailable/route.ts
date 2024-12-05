import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all trips with their associated route and driver details
    const trips = await prisma.trip.findMany({
      include: {
        route: true,  // Include route to get the duration
        driver: true, // Include driver to check status
        bus: true,    // Include bus to check status
      },
    });

    const currentTime = new Date();

    // Iterate over trips and check if any trip is over or in the future
    for (const trip of trips) {
      const { departureTime, route, driver, bus, date } = trip;

      // Combine the trip's date and departure time to get the full trip start time
      const tripStartTime = new Date(date);
      const [hours, minutes] = departureTime.split(":").map(Number);
      tripStartTime.setHours(hours, minutes);

      // Check if the current time is before the trip start time
      if (currentTime < tripStartTime) {
        // If the trip is in the future, the driver and bus should be available
        await prisma.driver.update({
          where: { id: driver.id },
          data: { status: "available" },
        });

        await prisma.bus.update({
          where: { id: bus.id },
          data: { status: "available" },
        });
      } else {
        // Calculate trip end time based on start time and route duration
        const tripEndTime = new Date(tripStartTime.getTime() + route.duration * 60000);

        // If the current time is past the trip end time, set the driver and bus to available
        if (currentTime >= tripEndTime) {
          await prisma.driver.update({
            where: { id: driver.id },
            data: { status: "available" },
          });

          await prisma.bus.update({
            where: { id: bus.id },
            data: { status: "available" },
          });
        }
      }
    }

    // Fetch available drivers (those who are not assigned to ongoing trips)
    const drivers = await prisma.driver.findMany({
      where: {
        status: 'available',
      },
    });

    return NextResponse.json(drivers, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching drivers' }, { status: 500 });
  }
}
