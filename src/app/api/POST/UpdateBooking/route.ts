import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, status, paymentReference } = body;

    if (!reference || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the booking by reference
    const booking = await prisma.booking.findUnique({
      where: { reference }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { reference },
      data: {
        status: status as any, // TypeScript casting
        // You can also save the payment reference if needed
        // paymentReference: paymentReference
      }
    });

    return NextResponse.json({
      booking: updatedBooking,
      message: "Booking status updated successfully"
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}