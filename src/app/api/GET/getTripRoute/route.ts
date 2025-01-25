import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Extract companyId from query parameters
    const url = new URL(request.url);
    const companyId = url.searchParams.get("companyId");

    // Fetch routes filtered by companyId
    const route = await prisma.route.findMany({
      where: companyId ? { branch: { companyId } } : {}, // Filter only if companyId exists
      include: {
        branch: true, // Optionally include branch details if needed
      },
    });

    return NextResponse.json(route, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching route companies" },
      { status: 500 }
    );
  }
}
