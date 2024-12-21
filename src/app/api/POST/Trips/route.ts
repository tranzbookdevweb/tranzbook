import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { date, price, busId, routeId, driverId, departureTime, branchId, recurring } = await req.json();

    if (!price || !busId || !routeId || !departureTime || !branchId || recurring === undefined) {
      return NextResponse.json(
        { error: "Price, bus ID, route ID, departure time, branch ID, and recurring status are required" },
        { status: 400 }
      );
    }

    // Create the new trip
    const newTrip = await prisma.trip.create({
      data: {
        date: recurring ? null : date, // Set date to null if the trip is recurring
        price,
        busId,
        routeId,
        driverId: recurring ? null : driverId,
        departureTime,
        branchId,
        recurring,
      },
    });

    // Skip status updates if the trip is recurring
    if (!recurring) {
      // Update the bus status to "busy"
      await prisma.bus.update({
        where: { id: busId },
        data: { status: "busy" },
      });

      // Update the driver status to "busy"
      await prisma.driver.update({
        where: { id: driverId },
        data: { status: "busy" },
      });

      // Get the route duration (in minutes)
      const route = await prisma.route.findUnique({
        where: { id: routeId },
        select: { duration: true },
      });

      if (!route) {
        return NextResponse.json({ error: "Route not found" }, { status: 404 });
      }

      // Calculate trip end time by adding the route duration (in minutes) to departureTime
      const departureDate = new Date(departureTime);
      const tripEndTime = new Date(departureDate.getTime() + route.duration * 60000);

      // Get the current time
      const currentTime = new Date();

      // Check if the trip has ended
      if (currentTime >= tripEndTime) {
        // If the trip is over, change the bus and driver status back to "available"
        await prisma.bus.update({
          where: { id: busId },
          data: { status: "available" },
        });

        await prisma.driver.update({
          where: { id: driverId },
          data: { status: "available" },
        });
      }
    }

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the trip or updating bus/driver status" },
      { status: 500 }
    );
  }
}
