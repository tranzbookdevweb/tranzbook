import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';

// Import the CargoFormStatus enum from Prisma client
import { CargoFormStatus } from '@prisma/client';

// Types for better type safety
interface CargoFormData {
  // Shipping Details
  fromLocation: string;
  toLocation: string;
  date?: string | null;
  cargoWeight?: string;
  productDescription: string;
  locationDescription?: string;
  
  // Sender Details
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  senderAddress: string;
  senderCity: string;
  senderIdNumber?: string;
  
  // Receiver Details
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  receiverAddress: string;
  receiverCity: string;
  receiverIdNumber?: string;
  
  // Additional options
  agroPrefinancing?: boolean;
}

// Validation helper functions
const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return false; // Phone is required
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

const validateRequiredFields = (data: CargoFormData): string[] => {
  const errors: string[] = [];
  
  // Shipping details validation
  if (!data.fromLocation?.trim()) {
    errors.push("Origin location is required");
  }
  if (!data.toLocation?.trim()) {
    errors.push("Destination location is required");
  }
  if (!data.productDescription?.trim()) {
    errors.push("Product description is required");
  }
  if (data.fromLocation?.trim() === data.toLocation?.trim()) {
    errors.push("Origin and destination must be different");
  }
  
  // Sender details validation
  if (!data.senderName?.trim()) {
    errors.push("Sender name is required");
  }
  if (!data.senderPhone?.trim()) {
    errors.push("Sender phone number is required");
  } else if (!validatePhone(data.senderPhone)) {
    errors.push("Please enter a valid sender phone number");
  }
  if (!data.senderAddress?.trim()) {
    errors.push("Sender address is required");
  }
  if (!data.senderCity?.trim()) {
    errors.push("Sender city is required");
  }
  if (data.senderEmail && !validateEmail(data.senderEmail)) {
    errors.push("Please enter a valid sender email address");
  }
  
  // Receiver details validation
  if (!data.receiverName?.trim()) {
    errors.push("Receiver name is required");
  }
  if (!data.receiverPhone?.trim()) {
    errors.push("Receiver phone number is required");
  } else if (!validatePhone(data.receiverPhone)) {
    errors.push("Please enter a valid receiver phone number");
  }
  if (!data.receiverAddress?.trim()) {
    errors.push("Receiver address is required");
  }
  if (!data.receiverCity?.trim()) {
    errors.push("Receiver city is required");
  }
  if (data.receiverEmail && !validateEmail(data.receiverEmail)) {
    errors.push("Please enter a valid receiver email address");
  }
  
  return errors;
};

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
    const body: CargoFormData = await req.json();

    // Validate required fields
    const validationErrors = validateRequiredFields(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors
        }, 
        { status: 400 }
      );
    }

    // Sanitize and prepare data for database
    const cargoData = {
      // Shipping Details
      fromLocation: sanitizeString(body.fromLocation),
      toLocation: sanitizeString(body.toLocation),
      date: body.date ? new Date(body.date) : null,
      cargoWeight: body.cargoWeight ? parseFloat(body.cargoWeight) : 0,
      productDescription: sanitizeString(body.productDescription),
      locationDescription: body.locationDescription ? sanitizeString(body.locationDescription) : null,
      
      // Sender Details
      senderName: sanitizeString(body.senderName),
      senderPhone: sanitizeString(body.senderPhone),
      senderEmail: body.senderEmail ? sanitizeString(body.senderEmail) : null,
      senderAddress: sanitizeString(body.senderAddress),
      senderCity: sanitizeString(body.senderCity),
      
      // Receiver Details
      receiverName: sanitizeString(body.receiverName),
      receiverPhone: sanitizeString(body.receiverPhone),
      receiverEmail: body.receiverEmail ? sanitizeString(body.receiverEmail) : null,
      receiverAddress: sanitizeString(body.receiverAddress),
      receiverCity: sanitizeString(body.receiverCity),
      
      // User and system fields
      userId: user.id,
      agroPrefinancing: body.agroPrefinancing || false,
      // Use the proper enum values instead of strings
      status: body.agroPrefinancing ? CargoFormStatus.processing : CargoFormStatus.pending
    };

    // Additional business logic validation
    if (cargoData.cargoWeight < 0) {
      return NextResponse.json(
        { error: 'Cargo weight cannot be negative' },
        { status: 400 }
      );
    }

    // Check if user exists in our database, create if not
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!existingUser) {
      // Create user record if it doesn't exist
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
          firstName: user.given_name || '',
          lastName: user.family_name || '',
          profileImage: user.picture || null,
        }
      });
    }

    // Create cargo form in database
    const cargoForm = await prisma.cargoForm.create({
      data: cargoData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Generate a unique reference number for tracking
    const reference = `CRG-${cargoForm.id.slice(-8).toUpperCase()}-${new Date().getFullYear()}`;

    // Log the submission for tracking and analytics
    console.log("Cargo Form Submitted:", {
      cargoFormId: cargoForm.id,
      reference,
      userId: user.id,
      userEmail: user.email,
      fromLocation: cargoData.fromLocation,
      toLocation: cargoData.toLocation,
      agroPrefinancing: cargoData.agroPrefinancing,
      submittedAt: new Date().toISOString()
    });

    // Prepare response data
    const responseData = {
      message: cargoData.agroPrefinancing 
        ? 'Agro-prefinancing application submitted successfully' 
        : 'Cargo booking submitted successfully',
      reference,
      cargoForm: {
        id: cargoForm.id,
        reference,
        status: cargoForm.status,
        agroPrefinancing: cargoForm.agroPrefinancing,
        fromLocation: cargoForm.fromLocation,
        toLocation: cargoForm.toLocation,
        productDescription: cargoForm.productDescription,
        createdAt: cargoForm.createdAt,
        estimatedProcessingTime: cargoData.agroPrefinancing ? '3-5 business days' : '24-48 hours'
      }
    };

    // TODO: Add email notification logic here
    // - Send confirmation email to user
    // - Send notification to cargo companies
    // - Send notification to admin team if agroPrefinancing is true

    // TODO: Add webhook/notification logic for real-time updates
    // - Notify cargo companies in the route
    // - Update dashboard/admin panel

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    // Log the full error for debugging
    console.error('Cargo Form Submission Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId: (await getKindeServerSession().getUser())?.id
    });

    // Handle specific Prisma errors
    if (error instanceof Error) {
      // Database constraint violations
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A similar request already exists' },
          { status: 409 }
        );
      }
      
      // Foreign key constraint violations
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid user reference' },
          { status: 400 }
        );
      }
      
      // Database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database temporarily unavailable. Please try again.' },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Failed to submit cargo form. Please try again.',
        code: 'SUBMISSION_FAILED'
      }, 
      { status: 500 }
    );
  }
}
