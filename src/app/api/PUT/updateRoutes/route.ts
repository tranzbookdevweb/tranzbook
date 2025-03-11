// PUT handler for updating routes
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Get the route ID from the URL parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Route ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body to get the updated route data
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
      duration,
      distance,
      startCityId, // Optional: in case you want to change the start city
      endCityId,   // Optional: in case you want to change the end city
      branchId     // Optional: in case you want to change the branch
    } = requestBody;

    // Update the route using Prisma
    const updatedRoute = await prisma.route.update({
      where: {
        id: id,
      },
      data: {
        // Only include fields that are defined in the request
        ...(duration !== undefined && { duration }),
        ...(distance !== undefined && { distance }),
        ...(startCityId !== undefined && { startCityId }),
        ...(endCityId !== undefined && { endCityId }),
        ...(branchId !== undefined && { branchId }),
        updatedAt: new Date(),
      },
      include: {
        startCity: true,
        endCity: true,
        branch: true
      }
    });

    // Return success response
    return NextResponse.json(
      { message: "Route updated successfully", route: updatedRoute },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating route:", error);
    
    // Type guard to check for different Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle case where route doesn't exist
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Route not found" },
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
    let errorMessage = "Failed to update route";
    if (error && typeof error === 'object' && 'message' in error && 
        typeof error.message === 'string') {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: "Failed to update route", details: errorMessage },
      { status: 500 }
    );
  }
}