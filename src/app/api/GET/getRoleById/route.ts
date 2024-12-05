import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// GET request to fetch a role by its ID along with its permissions
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id"); // Get the 'id' from the query string

  if (!id) {
    return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
  }

  try {
    // Fetch the role by ID and include permissions
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true, // Include permissions associated with the role
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
  }
}
