import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { 
      date, 
      price, 
      busId, 
      routeId, 
      driverId, 
      departureTime, 
      recurring,
      daysOfWeek,
      currency,
      commission,
      commissionType
    } = await req.json();
    
    console.log("Request payload:", { 
      date, 
      price, 
      busId, 
      routeId, 
      driverId, 
      departureTime, 
      recurring,
      daysOfWeek,
      currency,
      commission,
      commissionType
    });

    if (!price || !busId || !routeId || !departureTime || recurring === undefined) {
      console.log("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Price, bus ID, route ID, departure time, and recurring status are required" },
        { status: 400 }
      );
    }

    // Additional validation for recurring trips
    if (recurring && (!daysOfWeek || daysOfWeek.length === 0)) {
      console.log("Validation failed: Recurring trips require days of week");
      return NextResponse.json(
        { error: "Days of week are required for recurring trips" },
        { status: 400 }
      );
    }

    // Additional validation for non-recurring trips
    if (!recurring && (!date || !driverId)) {
      console.log("Validation failed: Non-recurring trips require date and driver");
      return NextResponse.json(
        { error: "Date and driver ID are required for non-recurring trips" },
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
        driverId: recurring ? null : driverId,
        departureTime,
        recurring,
        daysOfWeek: recurring ? daysOfWeek : [],
        currency: currency || "GHS",
        commission: commission || 0,
        commissionType: commissionType || "FIXED",
      },
    });
    console.log("Primary trip created:", newTrip);

    // Find the original route and related cities
    const originalRoute = await prisma.route.findUnique({
      where: { id: routeId },
      select: { 
        startCityId: true, 
        endCityId: true 
      },
    });

    if (!originalRoute) {
      console.log("Original route not found:", routeId);
      return NextResponse.json({ error: "Original route not found" }, { status: 404 });
    }
    console.log("Original route details:", originalRoute);

    // Fetch the start and end city details including their countries
    const [startCity, endCity] = await Promise.all([
      prisma.city.findUnique({ where: { id: originalRoute.startCityId }, select: { country: true, currency: true } }),
      prisma.city.findUnique({ where: { id: originalRoute.endCityId }, select: { country: true, currency: true } })
    ]);

    if (!startCity || !endCity) {
      console.log("One or both cities not found.");
      return NextResponse.json({ error: "Start or end city not found" }, { status: 404 });
    }

    console.log("Start City:", startCity, "End City:", endCity);

    // **Only create a reverse trip if the cities are in the same country**
    if (startCity.country === endCity.country) {
      const reverseRoute = await prisma.route.findFirst({
        where: {
          startCityId: originalRoute.endCityId,
          endCityId: originalRoute.startCityId,
        },
      });

      if (!reverseRoute) {
        console.log("Reverse route not found for startCityId:", originalRoute.endCityId, "endCityId:", originalRoute.startCityId);
      } else {
        console.log("Reverse route found:", reverseRoute);

        // Create the reverse trip
        const reverseTrip = await prisma.trip.create({
          data: {
            date: recurring ? null : date,
            price,
            busId,
            routeId: reverseRoute.id,
            driverId: recurring ? null : driverId,
            departureTime,
            recurring,
            daysOfWeek: recurring ? daysOfWeek : [],
            currency: currency || "GHS",
            commission: commission || 0,
            commissionType: commissionType || "FIXED",
          },
        });
        console.log("Reverse trip created:", reverseTrip);
      }
    } else {
      console.log("Cities belong to different countries. Reverse trip not created.");
    }

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
    }

    return NextResponse.json({ message: "Trip created successfully", trip: newTrip }, { status: 201 });

  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json({ error: "An error occurred while creating the trip" }, { status: 500 });
  }
}
