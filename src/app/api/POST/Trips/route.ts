import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { date, price, busId, routeId, driverId, departureTime, recurring } = await req.json();
    console.log("Request payload:", { date, price, busId, routeId, driverId, departureTime, recurring });

    if (!price || !busId || !routeId || !departureTime || recurring === undefined) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Price, bus ID, route ID, departure time, and recurring status are required" },
        { status: 400 }
      );
    }

    // Create the primary trip
    const newTrip = await prisma.trip.create({
      data: {
        date: recurring ? null : date,
        price,
        busId,
        routeId,
        departureTime,
        recurring,
      },
    });
    console.log("Primary trip created:", newTrip);

    // Find the reverse route based on the startCity and endCity of the original route
    const originalRoute = await prisma.route.findUnique({
      where: { id: routeId },
      select: { startCityId: true, endCityId: true },
    });

    if (!originalRoute) {
      console.log("Original route not found:", routeId);
      return NextResponse.json({ error: "Original route not found" }, { status: 404 });
    }
    console.log("Original route details:", originalRoute);

    const reverseRoute = await prisma.route.findFirst({
      where: {
        startCityId: originalRoute.endCityId,
        endCityId: originalRoute.startCityId,
      },
    });

    if (!reverseRoute) {
      console.log("Reverse route not found for startCityId:", originalRoute.endCityId, "endCityId:", originalRoute.startCityId);
      return NextResponse.json(
        { error: "Reverse route not found for the given route" },
        { status: 404 }
      );
    }
    console.log("Reverse route found:", reverseRoute);

    // Create the reverse trip
    const reverseTrip = await prisma.trip.create({
      data: {
        date: recurring ? null : date,
        price,
        busId,
        routeId: reverseRoute.id,
        departureTime,
        recurring,
      },
    });
    console.log("Reverse trip created:", reverseTrip);


    // Skip status updates if the trip is recurring
    if (!recurring) {
      // Update the bus status to "busy"
      await prisma.bus.update({
        where: { id: busId },
        data: { status: "busy" },
      });
      console.log("Bus status updated to 'busy':", busId);

      // Update the driver status to "busy"
      await prisma.driver.update({
        where: { id: driverId },
        data: { status: "busy" },
      });
      console.log("Driver status updated to 'busy':", driverId);

      // Get the route duration (in minutes)
      const route = await prisma.route.findUnique({
        where: { id: routeId },
        select: { duration: true },
      });

      if (!route) {
        console.log("Route not found:", routeId);
        return NextResponse.json({ error: "Route not found" }, { status: 404 });
      }
      console.log("Route duration retrieved:", route.duration);

      // Calculate trip end time by adding the route duration (in minutes) to departureTime
      const departureDate = new Date(departureTime);
      const tripEndTime = new Date(departureDate.getTime() + route.duration * 60000);

      console.log("Calculated trip end time:", tripEndTime);

      // Get the current time
      const currentTime = new Date();

      // Check if the trip has ended
      if (currentTime >= tripEndTime) {
        // If the trip is over, change the bus and driver status back to "available"
        await prisma.bus.update({
          where: { id: busId },
          data: { status: "available" },
        });
        console.log("Bus status updated to 'available':", busId);

        await prisma.driver.update({
          where: { id: driverId },
          data: { status: "available" },
        });
        console.log("Driver status updated to 'available':", driverId);
      }
    }

    console.log("Trips successfully created and statuses updated.");
    return NextResponse.json({ newTrip, reverseTrip }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the trips or updating bus/driver status" },
      { status: 500 }
    );
  }
}
