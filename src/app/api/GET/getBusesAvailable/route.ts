import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentTime = new Date();

    // Fetch all trips along with their associated route, bus, and driver details
    const trips = await prisma.trip.findMany({
      include: {
        route: true,
        bus: true,   // This includes the bus object, where 'onArrival' is located
        driver: true, // This includes the driver object
      },
    });

    // Function to update the bus and driver status
    const updateStatus = async (busId: string, driverId?: string) => {
      // Update the bus status to "available"
      await prisma.bus.update({
        where: { id: busId },
        data: { status: "available" },
      });

      // If driver is not null, update the driver status to "available"
      if (driverId) {
        await prisma.driver.update({
          where: { id: driverId },
          data: { status: "available" },
        });
      }
    };

    // Iterate over trips and process those that are finished
    for (const trip of trips) {
      const { departureTime, route, bus, driver } = trip;

      // Access 'onArrival' from the bus object
      if (bus.onArrival) {
        await updateStatus(bus.id, driver?.id); // Pass driver?.id to handle potential null value
        continue; // Skip further checks for this bus and trip
      }

      // Calculate trip end time based on departure time and route duration
      const departureDate = new Date();
      const [hours, minutes] = departureTime.split(":").map(Number);
      departureDate.setHours(hours, minutes, 0, 0);

      const tripEndTime = new Date(departureDate.getTime() + route.duration * 60000);

      // If the current time is past the trip's end time, update bus and driver status
      if (currentTime >= tripEndTime) {
        await updateStatus(bus.id, driver?.id); // Pass driver?.id to handle potential null value
      }
    }

    // Fetch and return all buses that are available
    const buses = await prisma.bus.findMany({
      where: { status: "available" },
    });

    return NextResponse.json(buses, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching buses" },
      { status: 500 }
    );
  }
}
