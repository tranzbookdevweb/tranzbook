import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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

    // Delete the trip using Prisma
    const deletedTrip = await prisma.trip.delete({
      where: {
        id: id,
      },
    });

    // Return success response
    return NextResponse.json(
      { message: "Trip deleted successfully", trip: deletedTrip },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting trip:", error);
    
    // Type guard to check if error is an object with code property
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }
    
    // Handle other errors
    let errorMessage = "Failed to delete trip";
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string') {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: "Failed to delete trip", details: errorMessage },
      { status: 500 }
    );
  }
}