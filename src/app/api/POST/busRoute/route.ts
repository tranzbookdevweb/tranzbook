import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/lib/db";

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { startCityId, endCityId, duration, distance, branchId, companyId } = await req.json();

    console.log("Request payload:", { startCityId, endCityId, duration, distance, branchId, companyId });

    if (!startCityId || !endCityId || !duration || !distance || !branchId || !companyId) {
      return NextResponse.json({ message: 'Missing required fields: startCityId, endCityId, duration, distance, branchId, and companyId are required' }, { status: 400 });
    }

    // Fetch both cities
    const [startCity, endCity] = await Promise.all([
      prisma.city.findUnique({ where: { id: startCityId }, select: { id: true, name: true } }),
      prisma.city.findUnique({ where: { id: endCityId }, select: { id: true, name: true } })
    ]);

    if (!startCity || !endCity) {
      console.log("One or both cities not found.");
      return NextResponse.json({ message: 'One or both cities not found' }, { status: 404 });
    }

    console.log("Start City:", startCity, "End City:", endCity);

    // Fetch branches dynamically within the same company
    const [startBranch, endBranch] = await Promise.all([
      prisma.branch.findFirst({ where: { city: startCity.name, companyId } }),
      prisma.branch.findFirst({ where: { city: endCity.name, companyId } })
    ]);

    if (!startBranch || !endBranch) {
      return NextResponse.json({ message: 'Branches not found for one or both cities within the specified company' }, { status: 400 });
    }

    console.log("Start Branch:", startBranch.id, "End Branch:", endBranch.id);

    // Create the forward route
    const newRoute = await prisma.route.create({
      data: {
        startCityId,
        endCityId,
        duration,
        distance,
        branchId: startBranch.id, // Use dynamically fetched start branch within the company
      },
      include: { startCity: true, endCity: true }
    });

    console.log("Created forward route:", newRoute);

    // Create the reverse route with the correct branch
    const reverseRoute = await prisma.route.create({
      data: {
        startCityId: endCityId,
        endCityId: startCityId,
        duration,
        distance,
        branchId: endBranch.id, // Use dynamically fetched end branch within the company
      },
      include: { startCity: true, endCity: true }
    });
    console.log("Created reverse route:", reverseRoute);

    return NextResponse.json({
      message: "Routes created successfully",
      forward: newRoute,
      reverse: reverseRoute
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating routes:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
