import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Get the trip ID from the URL parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body to get the updated trip data
    const requestBody = await request.json();

    // Validate the request body
    if (!requestBody) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Extract only the fields that can be updated
    const {
      date,
      recurring,
      daysOfWeek,
      price,
      currency,
      commission,
      commissionType,
      departureTime,
      busId,
      routeId,
      driverId
    } = requestBody;

    // Update the trip using Prisma
    const updatedTrip = await prisma.trip.update({
      where: {
        id: id,
      },
      data: {
        // Only include fields that are defined in the request
        ...(date !== undefined && { date }),
        ...(recurring !== undefined && { recurring }),
        ...(daysOfWeek !== undefined && { daysOfWeek }),
        ...(price !== undefined && { price }),
        ...(currency !== undefined && { currency }),
        ...(commission !== undefined && { commission }),
        ...(commissionType !== undefined && { commissionType }),
        ...(departureTime !== undefined && { departureTime }),
        ...(busId !== undefined && { busId }),
        ...(routeId !== undefined && { routeId }),
        ...(driverId !== undefined && { driverId }),
        updatedAt: new Date(),
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Trip updated successfully", trip: updatedTrip },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating trip:", error);
    
    // Type guard to check for different Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle case where trip doesn't exist
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Trip not found" },
          { status: 404 }
        );
      }
      
      // Handle validation errors
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Validation error with unique constraint" },
          { status: 400 }
        );
      }
    }
    
    // Handle other errors
    let errorMessage = "Failed to update trip";
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string') {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: "Failed to update trip", details: errorMessage },
      { status: 500 }
    );
  }
}