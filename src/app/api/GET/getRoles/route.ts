import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching roles companies' }, { status: 500 });
  }
}
