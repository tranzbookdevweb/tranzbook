import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/lib/db";

export async function GET(req: NextRequest) {
  try {
    const routes = await prisma.route.findMany({
      include: {
        startCity: true,
        endCity: true,
        branch: true,
      },
    });

    if (!routes.length) {
      return NextResponse.json({ message: 'No routes found' }, { status: 404 });
    }

    return NextResponse.json({ routes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
