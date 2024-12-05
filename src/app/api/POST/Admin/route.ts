// pages/api/admin.js
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, roleId, branchId } = await req.json();

    // Ensure all required fields are provided
    if (!email || !password || !firstName || !lastName || !roleId || !branchId) {
      return NextResponse.json({ error: "Email, password, firstName, lastName, roleId, and branchId are required" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin
    const newAdmin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId,  // Role reference
        branchId,  // Branch reference
      },
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the admin' }, { status: 500 });
  }
}
