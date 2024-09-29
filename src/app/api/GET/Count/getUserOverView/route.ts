import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { endOfMonth, startOfMonth } from "date-fns";

export async function GET() {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create an array to hold the user count for each month
    const userCounts = [];

    for (let month = 0; month < 12; month++) {
      // Get the start and end dates for the current month
      const startDate = startOfMonth(new Date(currentYear, month));
      const endDate = endOfMonth(new Date(currentYear, month));

      // Count the number of users created within the current month
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Add the count to the array with the corresponding month
      userCounts.push({
        month: startDate.toLocaleString('default', { month: 'long' }),
        count,
      });
    }

    return NextResponse.json({ userCounts }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching user overview' }, { status: 500 });
  }
}
