import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
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
  
      // Check if route exists before attempting to delete
      const existingRoute = await prisma.route.findUnique({
        where: { id }
      });
  
      if (!existingRoute) {
        return NextResponse.json(
          { error: "Route not found" },
          { status: 404 }
        );
      }
  
      // Check if there are any dependencies (e.g., trips using this route)
      const relatedTrips = await prisma.trip.findMany({
        where: { routeId: id }
      });
  
      if (relatedTrips.length > 0) {
        return NextResponse.json(
          { 
            error: "Cannot delete route that is being used by trips", 
            trips: relatedTrips.length 
          },
          { status: 409 }
        );
      }
  
      // Delete the route
      await prisma.route.delete({
        where: { id }
      });
  
      // Return success response
      return NextResponse.json(
        { message: "Route deleted successfully" },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error deleting route:", error);
      
      // Type guard for Prisma errors
      if (error && typeof error === 'object' && 'code' in error) {
        // Handle case where route doesn't exist (though we checked above)
        if (error.code === 'P2025') {
          return NextResponse.json(
            { error: "Route not found" },
            { status: 404 }
          );
        }
        
        // Handle foreign key constraint violations
        if (error.code === 'P2003') {
          return NextResponse.json(
            { error: "Cannot delete route due to existing references" },
            { status: 409 }
          );
        }
      }
      
      // Handle other errors
      let errorMessage = "Failed to delete route";
      if (error && typeof error === 'object' && 'message' in error && 
          typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      return NextResponse.json(
        { error: "Failed to delete route", details: errorMessage },
        { status: 500 }
      );
    }
  }