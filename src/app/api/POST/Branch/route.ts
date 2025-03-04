import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Fetch all cities from the database
    const cities = await prisma.city.findMany();
    if (!cities.length) {
      return NextResponse.json({ error: "No cities found in the database" }, { status: 404 });
    }

    // Check if company exists
    const company = await prisma.busCompany.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Generate branches for each city
    const branches = await prisma.$transaction(
      cities.map((city) =>
        prisma.branch.create({
          data: {
            name: `${company.name} - ${city.name} Branch`,
            address: `Default Address in ${city.name}`,
            city: city.name,
            company: { connect: { id: companyId } },
          },
        })
      )
    );

    return NextResponse.json(branches, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating branches" },
      { status: 500 }
    );
  }
}
