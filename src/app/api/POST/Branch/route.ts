import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, address, city, companyId } = await req.json();

    // Validate required fields
    if (!name || !address || !city || !companyId) {
      return NextResponse.json({ 
        error: "Name, address, city, and company ID are required" 
      }, { status: 400 });
    }

    // Check if company exists
    const company = await prisma.busCompany.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Create the branch with manually entered data
    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        city,
        company: { connect: { id: companyId } },
      },
      include: {
        company: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the branch" },
      { status: 500 }
    );
  }
}