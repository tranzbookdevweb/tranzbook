import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(req: NextRequest) {
  try {
    // Get the bus ID from the URL query parameters
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ message: "Bus ID is required" }, { status: 400 });
    }

    // Parse the request body as JSON
    const updateData = await req.json();

    // Validate that the bus exists before attempting update
    const existingBus = await prisma.bus.findUnique({
      where: { id },
    });

    if (!existingBus) {
      return NextResponse.json({ message: "Bus not found" }, { status: 404 });
    }

    // Extract updatable fields
    const {
      plateNumber,
      capacity,
      busDescription,
      companyId,
      status,
      airConditioning,
      chargingOutlets,
      wifi,
      restRoom,
      seatBelts,
      onboardFood,
      onArrival,
      // Image handling would be here if updating image
    } = updateData;

    // Create an update object with only the fields that are provided
    const updateObject: any = {};

    // Add non-boolean fields if they are provided
    if (plateNumber !== undefined) updateObject.plateNumber = plateNumber;
    if (capacity !== undefined) updateObject.capacity = Number(capacity);
    if (busDescription !== undefined) updateObject.busDescription = busDescription;
    if (companyId !== undefined) updateObject.companyId = companyId;
    if (status !== undefined) updateObject.status = status;

    // Add boolean fields if they are provided
    if (airConditioning !== undefined) updateObject.airConditioning = Boolean(airConditioning);
    if (chargingOutlets !== undefined) updateObject.chargingOutlets = Boolean(chargingOutlets);
    if (wifi !== undefined) updateObject.wifi = Boolean(wifi);
    if (restRoom !== undefined) updateObject.restRoom = Boolean(restRoom);
    if (seatBelts !== undefined) updateObject.seatBelts = Boolean(seatBelts);
    if (onboardFood !== undefined) updateObject.onboardFood = Boolean(onboardFood);
    if (onArrival !== undefined) updateObject.onArrival = Boolean(onArrival);

    // Update the bus record
    const updatedBus = await prisma.bus.update({
      where: { id },
      data: updateObject,
    });

    return NextResponse.json(updatedBus, { status: 200 });
  } catch (error) {
    console.error("Error updating bus:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}