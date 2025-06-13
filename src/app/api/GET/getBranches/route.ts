// app/api/branches/route.ts
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        admins: {
          select: {
            id: true,
          },
        },
        routes: {
          select: {
            id: true,
          },
        },
      },
    });
    return NextResponse.json(branches, { status: 200 });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'An error occurred while fetching branches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, phoneNumber, city, companyId } = body;

    // Validate required fields
    if (!name || !address || !city || !companyId) {
      return NextResponse.json(
        { error: 'Name, address, city, and companyId are required' },
        { status: 400 }
      );
    }

    // Verify company exists
    const company = await prisma.busCompany.findUnique({
      where: { id: companyId },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }

    // Create new branch
    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        phoneNumber: phoneNumber || null,
        city,
        companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ error: 'An error occurred while creating the branch' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, address, phoneNumber, city, companyId } = body;

    // Verify branch exists first
    const existingBranch = await prisma.branch.findUnique({
      where: { id },
    });

    if (!existingBranch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // For editing, we only validate name and address as required
    // Other fields will keep their existing values if not provided
    if (!name || !address) {
      return NextResponse.json(
        { error: 'Name and address are required for updates' },
        { status: 400 }
      );
    }

    // If companyId is provided in the update, verify it exists
    if (companyId && companyId !== existingBranch.companyId) {
      const company = await prisma.busCompany.findUnique({
        where: { id: companyId },
        select: { id: true },
      });

      if (!company) {
        return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
      }
    }

    // Build update data - only update provided fields
    const updateData: any = {
      name,
      address,
    };

    // Only update other fields if they're explicitly provided
    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber || null;
    }
    if (city) {
      updateData.city = city;
    }
    if (companyId) {
      updateData.companyId = companyId;
    }

    // Update branch
    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: updateData,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedBranch, { status: 200 });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json({ error: 'An error occurred while updating the branch' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
    }

    // Check if branch exists and has related records
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        admins: {
          select: { id: true },
        },
        routes: {
          select: { id: true },
        },
      },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Prevent deletion if branch has associated admins or routes
    if (branch.admins.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete branch with associated admins. Please reassign or remove admins first.' },
        { status: 409 }
      );
    }

    if (branch.routes.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete branch with associated routes. Please remove routes first.' },
        { status: 409 }
      );
    }

    // Delete branch
    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Branch deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the branch' }, { status: 500 });
  }
}