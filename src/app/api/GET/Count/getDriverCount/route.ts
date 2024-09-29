import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await prisma.driver.count();
    return NextResponse.json({ count: userCount }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching user count' }, { status: 500 });
  }
}
