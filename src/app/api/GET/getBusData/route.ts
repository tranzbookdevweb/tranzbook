import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      include: {
        company: true, // Fetch associated BusCompany details
      },
    });

    return NextResponse.json({ buses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch buses" }, { status: 500 });
  }
}
