import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate required fields
    const {
      fromLocation,
      toLocation,
      date,
      cargoWeight,
      productDescription,
      locationDescription,
      agroPrefinancing
    } = body;

    // Basic validation
    if (!fromLocation || !toLocation || !productDescription) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: {
            fromLocation: !!fromLocation,
            toLocation: !!toLocation,
            productDescription: !!productDescription
          }
        }, 
        { status: 400 }
      );
    }

    // Create cargo form in database
    const cargoForm = await prisma.cargoForm.create({
      data: {
        fromLocation,
        toLocation,
        date: date ? new Date(date) : null,
        cargoWeight: parseFloat(cargoWeight),
        productDescription,
        locationDescription: locationDescription || null,
        userId: user.id, // Use Kinde user ID
        agroPrefinancing: agroPrefinancing || false,
        status: agroPrefinancing ? 'processing' : 'pending'
      }
    });

    // Log the submission for tracking
    console.log("Cargo Form Submitted:", {
      userId: user.id,
      email: user.email,
      cargoFormId: cargoForm.id
    });

    // Return successful response
    return NextResponse.json(
      { 
        message: 'Cargo form submitted successfully', 
        cargoForm 
      }, 
      { status: 201 }
    );

  } catch (error) {
    // Log the full error for debugging
    console.error('Cargo Form Submission Error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to submit cargo form', 
          details: error.message 
        }, 
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}