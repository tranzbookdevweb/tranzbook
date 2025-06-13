import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        company: true, // Include company details
        admins: true,  // Include admin details if needed
        routes: true,  // Include routes if needed
      }
    });
    return NextResponse.json(branches, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching branches' }, { status: 500 });
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

    // Validate required fields based on schema
    if (!name || !address || !city || !companyId) {
      return NextResponse.json({ 
        error: 'Name, address, city, and companyId are required' 
      }, { status: 400 });
    }

    // Verify that the company exists
    const companyExists = await prisma.busCompany.findUnique({
      where: { id: companyId }
    });

    if (!companyExists) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }

    // Update the branch
    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        name,
        address,
        phoneNumber, // Optional field
        city,
        companyId,
      },
      include: {
        company: true, // Include company details in response
      }
    });

    return NextResponse.json(updatedBranch, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while updating the branch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, phoneNumber, city, companyId } = body;

    // Validate required fields
    if (!name || !address || !city || !companyId) {
      return NextResponse.json({ 
        error: 'Name, address, city, and companyId are required' 
      }, { status: 400 });
    }

    // Verify that the company exists
    const companyExists = await prisma.busCompany.findUnique({
      where: { id: companyId }
    });

    if (!companyExists) {
      return NextResponse.json({ error: 'Invalid company ID' }, { status: 400 });
    }

    // Create new branch
    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        phoneNumber, // Optional field
        city,
        companyId,
      },
      include: {
        company: true, // Include company details in response
      }
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the branch' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
    }

    // Check if branch exists
    const existingBranch = await prisma.branch.findUnique({
      where: { id },
      include: {
        admins: true,
        routes: true,
      }
    });

    if (!existingBranch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check if branch has related records that might prevent deletion
    if (existingBranch.admins.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete branch with associated admins. Please reassign or remove admins first.' 
      }, { status: 409 });
    }

    if (existingBranch.routes.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete branch with associated routes. Please remove routes first.' 
      }, { status: 409 });
    }

    // Delete the branch
    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Branch deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the branch' }, { status: 500 });
  }
}