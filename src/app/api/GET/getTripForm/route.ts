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

    // Fetch distinct routes with startCity and endCity names
    const routes = await prisma.route.findMany({
      where: {
        branch: {
          companyId, // Filter routes by company ID through the branch relation
        },
      },
      include: {
        startCity: {
          select: { name: true }, // Include the name of the start city
        },
        endCity: {
          select: { name: true }, // Include the name of the end city
        },
      },
    });

    // Fetch buses filtered by companyId and status = 'available'
    const buses = await prisma.bus.findMany({
      where: {
        companyId,
        status: "available",
      },
    });

    // Fetch drivers filtered by companyId and status = 'available'
    const drivers = await prisma.driver.findMany({
      where: {
        companyId,
        status: "available",
      },
    });

    // Combine results
    const result = {
      routes: routes.map((route) => ({
        id: route.id,
        startCity: route.startCity.name,
        endCity: route.endCity.name,
        duration: route.duration,
        distance: route.distance,
      })),
      buses,
      drivers,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
