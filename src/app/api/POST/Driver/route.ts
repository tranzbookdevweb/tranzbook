import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { firstName, email, mobile, lastName, licenseNumber, companyId,status } = await req.json();

    if (!firstName || !lastName || !licenseNumber || !companyId || !mobile || !email ||!status) {
      return NextResponse.json({ error: "First name, last name, license number,status, branch ID, mobile, and email are required" }, { status: 400 });
    }

    const newDriver = await prisma.driver.create({
      data: {
        firstName,
        lastName,
        licenseNumber,
        status,
        companyId,  // Corrected from companyId to companyId
        email,
        mobile
      },
    });

    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the driver' }, { status: 500 });
  }
}
