// pages/api/admin.js
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName,  branchId } = await req.json();

    if (!email || !password || !firstName || !lastName  || !branchId) {
      return NextResponse.json({ error: "Email, password, firstName, lastName, companyId, and branchId are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        branchId,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the admin' }, { status: 500 });
  }
}
