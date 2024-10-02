import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, address, location, companyId } = await req.json();

    // Validate required fields
    if (!name || !address || !location || !companyId) {
      return NextResponse.json({ error: "Name, address, location, and company ID are required" }, { status: 400 });
    }

    // Create new branch
    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        location,
        company: {
          connect: { id: companyId }  // Link the branch to an existing company
        },
      },
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the branch' }, { status: 500 });
  }
}