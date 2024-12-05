import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const city = await prisma.city.findMany();
    return NextResponse.json(city, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching city companies' }, { status: 500 });
  }
}
