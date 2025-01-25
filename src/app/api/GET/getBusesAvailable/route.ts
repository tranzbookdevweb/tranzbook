import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Missing companyId query parameter" },
        { status: 400 }
      );
    }

    const currentTime = new Date();

    // Fetch all trips with associated route, bus, and driver details for the company
    const trips = await prisma.trip.findMany({
      where: {
        bus: {
          companyId,
        },
      },
      include: {
        route: true,
        bus: true,
        driver: true,
      },
    });

    // Function to update the bus and driver status
    const updateStatus = async (busId: string, driverId?: string) => {
      // Update the bus status to "available"
      await prisma.bus.update({
        where: { id: busId },
        data: { status: "available" },
      });

      // If driverId is provided, update the driver status
      if (driverId) {
        await prisma.driver.update({
          where: { id: driverId },
          data: { status: "available" },
        });
      }
    };

    // Iterate over trips to process those that are finished
    for (const trip of trips) {
      const { departureTime, route, bus, driver } = trip;

      // Skip processing if `onArrival` is true
      if (bus?.onArrival) {
        await updateStatus(bus.id, driver?.id);
        continue;
      }

      // Parse departure time
      const departureDate = new Date();
      const [hours, minutes] = departureTime.split(":").map(Number);
      departureDate.setHours(hours, minutes, 0, 0);

      const tripEndTime = new Date(departureDate.getTime() + route.duration * 60000);

      // If the current time is past the trip's end time, update the bus and driver status
      if (currentTime >= tripEndTime) {
        await updateStatus(bus.id, driver?.id);
      }
    }

    // Fetch and return all available buses for the company
    const buses = await prisma.bus.findMany({
      where: {
        companyId,
        status: "available",
      },
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
