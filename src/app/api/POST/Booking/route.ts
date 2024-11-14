import { NextResponse,NextRequest } from "next/server";
import prisma from "@/app/lib/db";


async function parseBookingData(request: NextRequest) {
  const { userId, tripId, seatNumber, date } = await request.json();

  if (!userId || !tripId || !seatNumber) {
    throw new Error(
      "Missing required fields: userId, tripId, or seatNumber"
    );
  }

  return {
    userId,
    tripId,
    seatNumber,
    date: date ? new Date(date) : new Date(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, tripId, seatNumber, date } =
      await parseBookingData(request);

    const booking = await prisma.booking.create({
      data: {
        userId,
        tripId,
        seatNumber,
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(booking);
  } catch (error:any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
