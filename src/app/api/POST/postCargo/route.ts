import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import prisma from '@/app/lib/db';
import nodemailer from 'nodemailer';

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

// Email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
    },
  });
};

// Email templates
const createAdminNotificationEmail = (cargoForm: any, reference: string) => {
  const isAgroPrefinancing = cargoForm.agroPrefinancing;
  
  return {
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER, // Admin email
    subject: `New ${isAgroPrefinancing ? 'Agro-Prefinancing' : 'Cargo'} Request - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          New ${isAgroPrefinancing ? 'Agro-Prefinancing Application' : 'Cargo Booking Request'}
        </h2>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Reference: ${reference}</h3>
          <p><strong>Status:</strong> ${cargoForm.status}</p>
          <p><strong>Submitted:</strong> ${new Date(cargoForm.createdAt).toLocaleString()}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937;">📦 Shipping Details</h3>
          <ul style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            <li><strong>From:</strong> ${cargoForm.fromLocation}</li>
            <li><strong>To:</strong> ${cargoForm.toLocation}</li>
            <li><strong>Product:</strong> ${cargoForm.productDescription}</li>
            <li><strong>Weight:</strong> ${cargoForm.cargoWeight || 'Not specified'} kg</li>
            ${cargoForm.date ? `<li><strong>Date:</strong> ${new Date(cargoForm.date).toLocaleDateString()}</li>` : ''}
            ${cargoForm.locationDescription ? `<li><strong>Location Notes:</strong> ${cargoForm.locationDescription}</li>` : ''}
          </ul>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937;">👤 Sender Information</h3>
          <ul style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            <li><strong>Name:</strong> ${cargoForm.senderName}</li>
            <li><strong>Phone:</strong> ${cargoForm.senderPhone}</li>
            ${cargoForm.senderEmail ? `<li><strong>Email:</strong> ${cargoForm.senderEmail}</li>` : ''}
            <li><strong>Address:</strong> ${cargoForm.senderAddress}, ${cargoForm.senderCity}</li>
          </ul>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937;">📋 Receiver Information</h3>
          <ul style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            <li><strong>Name:</strong> ${cargoForm.receiverName}</li>
            <li><strong>Phone:</strong> ${cargoForm.receiverPhone}</li>
            ${cargoForm.receiverEmail ? `<li><strong>Email:</strong> ${cargoForm.receiverEmail}</li>` : ''}
            <li><strong>Address:</strong> ${cargoForm.receiverAddress}, ${cargoForm.receiverCity}</li>
          </ul>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #1f2937;">👨‍💼 User Information</h3>
          <ul style="background-color: #f9fafb; padding: 15px; border-radius: 6px;">
            <li><strong>User ID:</strong> ${cargoForm.userId}</li>
            <li><strong>Name:</strong> ${cargoForm.user?.firstName} ${cargoForm.user?.lastName}</li>
            <li><strong>Email:</strong> ${cargoForm.user?.email}</li>
          </ul>
        </div>

        ${isAgroPrefinancing ? `
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">⚠️ Agro-Prefinancing Application</h4>
            <p style="color: #92400e; margin-bottom: 0;">This is an agro-prefinancing application that requires special attention and processing within 3-5 business days.</p>
          </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #6b7280;">Please review and process this request accordingly.</p>
        </div>
      </div>
    `,
  };
};

const createUserConfirmationEmail = (cargoForm: any, reference: string, userEmail: string) => {
  const isAgroPrefinancing = cargoForm.agroPrefinancing;
  
  return {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: `${isAgroPrefinancing ? 'Agro-Prefinancing Application' : 'Cargo Booking'} Confirmed - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">
            ${isAgroPrefinancing ? '🌾 Agro-Prefinancing Application Received' : '📦 Cargo Booking Confirmed'}
          </h1>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #1f2937;">
            Thank you for your ${isAgroPrefinancing ? 'agro-prefinancing application' : 'cargo booking request'}! 
            We have received your submission and it's being processed.
          </p>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">📋 Your Reference Number</h3>
            <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">${reference}</p>
          </div>

          <h3 style="color: #1f2937;">📦 Booking Summary</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <p><strong>From:</strong> ${cargoForm.fromLocation}</p>
            <p><strong>To:</strong> ${cargoForm.toLocation}</p>
            <p><strong>Product:</strong> ${cargoForm.productDescription}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${cargoForm.status.toUpperCase()}</span></p>
            <p><strong>Estimated Processing:</strong> ${isAgroPrefinancing ? '3-5 business days' : '24-48 hours'}</p>
          </div>

          <h3 style="color: #1f2937;">📞 Contact Information</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <p><strong>Sender:</strong> ${cargoForm.senderName} (${cargoForm.senderPhone})</p>
            <p><strong>Receiver:</strong> ${cargoForm.receiverName} (${cargoForm.receiverPhone})</p>
          </div>

          ${isAgroPrefinancing ? `
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">🌾 Agro-Prefinancing Information</h4>
              <p style="color: #92400e;">Your agro-prefinancing application is under review. Our team will contact you within 3-5 business days with further details about financing options and requirements.</p>
            </div>
          ` : ''}

          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #0c4a6e; margin-top: 0;">📧 What's Next?</h4>
            <ul style="color: #0c4a6e; margin: 10px 0;">
              <li>You'll receive email updates about your ${isAgroPrefinancing ? 'application' : 'booking'} status</li>
              <li>Our team will contact you if additional information is needed</li>
              <li>Keep your reference number handy for any inquiries</li>
              ${isAgroPrefinancing ? '<li>Prepare necessary documents for the financing process</li>' : '<li>Prepare your cargo for pickup as scheduled</li>'}
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">
              Need help? Contact us at <strong>${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}</strong>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Reference: ${reference} | Submitted: ${new Date(cargoForm.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    `,
  };
};

// Send email notifications
const sendEmailNotifications = async (cargoForm: any, reference: string) => {
  const transporter = createEmailTransporter();
  const notifications = [];

  try {
    // Send admin notification
    const adminEmail = createAdminNotificationEmail(cargoForm, reference);
    const adminResult = await transporter.sendMail(adminEmail);
    notifications.push({ type: 'admin', success: true, messageId: adminResult.messageId });
    
    console.log('Admin notification sent:', adminResult.messageId);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    notifications.push({ type: 'admin', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }

  try {
    // Send user confirmation email
    const userEmail = cargoForm.user?.email;
    if (userEmail) {
      const confirmationEmail = createUserConfirmationEmail(cargoForm, reference, userEmail);
      const userResult = await transporter.sendMail(confirmationEmail);
      notifications.push({ type: 'user', success: true, messageId: userResult.messageId });
      
      console.log('User confirmation sent:', userResult.messageId);
    } else {
      notifications.push({ type: 'user', success: false, error: 'User email not available' });
    }
  } catch (error) {
    console.error('Failed to send user confirmation:', error);
    notifications.push({ type: 'user', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }

  return notifications;
};

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

    // Send email notifications
    const emailNotifications = await sendEmailNotifications(cargoForm, reference);

    // Log the submission for tracking and analytics
    console.log("Cargo Form Submitted:", {
      cargoFormId: cargoForm.id,
      reference,
      userId: user.id,
      userEmail: user.email,
      fromLocation: cargoData.fromLocation,
      toLocation: cargoData.toLocation,
      agroPrefinancing: cargoData.agroPrefinancing,
      submittedAt: new Date().toISOString(),
      emailNotifications
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
      },
      notifications: {
        email: emailNotifications,
        message: 'Email notifications have been sent'
      }
    };

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