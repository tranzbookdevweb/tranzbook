import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { date, price, busId, routeId, driverId, departureTime, branchId } = await req.json();

    if (!date || !price || !busId || !routeId || !driverId || !departureTime || !branchId) {
      return NextResponse.json(
        { error: "Date, price, bus ID, route ID, driver ID, departure time, and branch ID are required" }, 
        { status: 400 }
      );
    }

    const newTrip = await prisma.trip.create({
      data: {
        date,
        price,
        busId,
        routeId,
        driverId,
        departureTime,
        branchId // Added branchId to the data model
      },
    });

    return NextResponse.json(newTrip, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the trip' }, { status: 500 });
  }
}
