import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import prisma from '@/app/lib/db';
import nodemailer, { Transporter } from 'nodemailer';
import { CargoFormStatus } from '@prisma/client';

// Interface for cargo form data to ensure type safety
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
  
  // Additional Options
  agroPrefinancing?: boolean;
}

/**
 * Configures and returns a Nodemailer transporter for sending emails.
 * @returns {Transporter} Configured Nodemailer transporter
 */
const createEmailTransporter = (): Transporter => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

/**
 * Generates an email template for notifying TRANZBOOK INC administrators of a new submission.
 * @param cargoForm - The cargo form data
 * @param reference - Unique reference number for the submission
 * @returns {object} Email configuration object
 */
const createAdminNotificationEmail = (cargoForm: any, reference: string) => {
  const isAgroPrefinancing = cargoForm.agroPrefinancing;

  return {
    from: `"TRANZBOOK INC" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject: `New ${isAgroPrefinancing ? 'Agro-Prefinancing' : 'Cargo Booking'} Request - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">TRANZBOOK INC</h1>
          <h2 style="margin: 10px 0 0;">New ${isAgroPrefinancing ? 'Agro-Prefinancing Application' : 'Cargo Booking Request'}</h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px;">
          <h3 style="color: #1f2937;">Reference: ${reference}</h3>
          <p><strong>Status:</strong> ${cargoForm.status}</p>
          <p><strong>Submitted:</strong> ${new Date(cargoForm.createdAt).toLocaleString()}</p>

          <h3 style="color: #1f2937; margin-top: 20px;">📦 Shipping Details</h3>
          <ul style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <li><strong>Origin:</strong> ${cargoForm.fromLocation}</li>
            <li><strong>Destination:</strong> ${cargoForm.toLocation}</li>
            <li><strong>Product:</strong> ${cargoForm.productDescription}</li>
            <li><strong>Weight:</strong> ${cargoForm.cargoWeight || 'Not specified'} kg</li>
            ${cargoForm.date ? `<li><strong>Date:</strong> ${new Date(cargoForm.date).toLocaleDateString()}</li>` : ''}
            ${cargoForm.locationDescription ? `<li><strong>Location Notes:</strong> ${cargoForm.locationDescription}</li>` : ''}
          </ul>

          <h3 style="color: #1f2937; margin-top: 20px;">👤 Sender Information</h3>
          <ul style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <li><strong>Name:</strong> ${cargoForm.senderName}</li>
            <li><strong>Phone:</strong> ${cargoForm.senderPhone}</li>
            ${cargoForm.senderEmail ? `<li><strong>Email:</strong> ${cargoForm.senderEmail}</li>` : ''}
            <li><strong>Address:</strong> ${cargoForm.senderAddress}, ${cargoForm.senderCity}</li>
          </ul>

          <h3 style="color: #1f2937; margin-top: 20px;">📋 Receiver Information</h3>
          <ul style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <li><strong>Name:</strong> ${cargoForm.receiverName}</li>
            <li><strong>Phone:</strong> ${cargoForm.receiverPhone}</li>
            ${cargoForm.receiverEmail ? `<li><strong>Email:</strong> ${cargoForm.receiverEmail}</li>` : ''}
            <li><strong>Address:</strong> ${cargoForm.receiverAddress}, ${cargoForm.receiverCity}</li>
          </ul>

          <h3 style="color: #1f2937; margin-top: 20px;">👨‍💼 User Information</h3>
          <ul style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <li><strong>Name:</strong> ${cargoForm.user?.firstName} ${cargoForm.user?.lastName}</li>
            <li><strong>Email:</strong> ${cargoForm.user?.email}</li>
          </ul>

          ${isAgroPrefinancing ? `
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">⚠️ Agro-Prefinancing Application</h4>
              <p style="color: #92400e;">This submission requires expedited processing. Please review within 3-5 business days.</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">Please review and process this request promptly.</p>
            <p style="color: #6b7280; font-size: 14px;">TRANZBOOK INC - Logistics & Financing Solutions</p>
          </div>
        </div>
      </div>
    `,
  };
};

/**
 * Generates an email template for confirming submission to the user.
 * @param cargoForm - The cargo form data
 * @param reference - Unique reference number for the submission
 * @param userEmail - User's email address
 * @returns {object} Email configuration object
 */
const createUserConfirmationEmail = (cargoForm: any, reference: string, userEmail: string) => {
  const isAgroPrefinancing = cargoForm.agroPrefinancing;

  return {
    from: `"TRANZBOOK INC" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: `Your ${isAgroPrefinancing ? 'Agro-Prefinancing Application' : 'Cargo Booking'} Confirmation - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">TRANZBOOK INC</h1>
          <h2 style="margin: 10px 0 0;">
            ${isAgroPrefinancing ? 'Agro-Prefinancing Application Received' : 'Cargo Booking Confirmed'}
          </h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #1f2937;">
            Dear ${cargoForm.senderName},<br><br>
            Thank you for choosing TRANZBOOK INC for your 
            ${isAgroPrefinancing ? 'agro-prefinancing application' : 'cargo booking needs'}. 
            Your submission has been successfully received and is under review.
          </p>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Your Reference Number</h3>
            <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">${reference}</p>
          </div>

          <h3 style="color: #1f2937;">📦 Submission Summary</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <p><strong>Origin:</strong> ${cargoForm.fromLocation}</p>
            <p><strong>Destination:</strong> ${cargoForm.toLocation}</p>
            <p><strong>Product:</strong> ${cargoForm.productDescription}</p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${cargoForm.status.toUpperCase()}</span></p>
            <p><strong>Estimated Processing Time:</strong> ${isAgroPrefinancing ? '3-5 business days' : '24-48 hours'}</p>
          </div>

          <h3 style="color: #1f2937;">📞 Contact Information</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <p><strong>Sender:</strong> ${cargoForm.senderName} (${cargoForm.senderPhone})</p>
            <p><strong>Receiver:</strong> ${cargoForm.receiverName} (${cargoForm.receiverPhone})</p>
          </div>

          ${isAgroPrefinancing ? `
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">🌾 Agro-Prefinancing Details</h4>
              <p style="color: #92400e;">
                Your application is being reviewed by our financing team. You will be contacted within 3-5 business days with further details regarding financing options and required documentation.
              </p>
            </div>
          ` : ''}

          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #0c4a6e; margin-top: 0;">📧 Next Steps</h4>
            <ul style="color: #0c4a6e; margin: 10px 0;">
              <li>You will receive email updates on your ${isAgroPrefinancing ? 'application' : 'booking'} status.</li>
              <li>Our team may contact you for additional information if needed.</li>
              <li>Please keep your reference number for any inquiries.</li>
              ${isAgroPrefinancing ? '<li>Prepare necessary documentation for the financing process.</li>' : '<li>Ensure your cargo is ready for pickup as scheduled.</li>'}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">
              For assistance, please contact our support team at 
              <a href="mailto:${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}" style="color: #2563eb; text-decoration: none;">
                ${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Reference: ${reference} | Submitted: ${new Date(cargoForm.createdAt).toLocaleString()}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              TRANZBOOK INC - Logistics & Financing Solutions
            </p>
          </div>
        </div>
      </div>
    `,
  };
};

/**
 * Sends email notifications to both the admin and the user.
 * @param cargoForm - The cargo form data
 * @param reference - Unique reference number
 * @returns {Promise<Array>} Array of notification results
 */
const sendEmailNotifications = async (cargoForm: any, reference: string): Promise<Array<{ type: string; success: boolean; messageId?: string; error?: string }>> => {
  const transporter = createEmailTransporter();
  const notifications: Array<{ type: string; success: boolean; messageId?: string; error?: string }> = [];

  try {
    const adminEmail = createAdminNotificationEmail(cargoForm, reference);
    const adminResult = await transporter.sendMail(adminEmail);
    notifications.push({ type: 'admin', success: true, messageId: adminResult.messageId });
    console.log('Admin notification sent:', adminResult.messageId);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    notifications.push({ type: 'admin', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }

  try {
    const userEmail = cargoForm.senderEmail || cargoForm.user?.email;
    if (userEmail) {
      const confirmationEmail = createUserConfirmationEmail(cargoForm, reference, userEmail);
      const userResult = await transporter.sendMail(confirmationEmail);
      notifications.push({ type: 'user', success: true, messageId: userResult.messageId });
      console.log('User confirmation sent:', userResult.messageId);
    } else {
      notifications.push({ type: 'user', success: false, error: 'User email not provided' });
    }
  } catch (error) {
    console.error('Failed to send user confirmation:', error);
    notifications.push({ type: 'user', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }

  return notifications;
};

/**
 * Validates an email address.
 * @param email - Email address to validate
 * @returns {boolean} True if valid or empty (optional field)
 */
const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number.
 * @param phone - Phone number to validate
 * @returns {boolean} True if valid
 */
const validatePhone = (phone: string): boolean => {
  if (!phone) return false; // Phone is required
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitizes input strings by trimming and normalizing spaces.
 * @param str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * Validates required fields in the cargo form data.
 * @param data - Cargo form data to validate
 * @returns {string[]} Array of validation error messages
 */
const validateRequiredFields = (data: CargoFormData): string[] => {
  const errors: string[] = [];

  // Shipping Details Validation
  if (!data.fromLocation?.trim()) errors.push('Origin location is required');
  if (!data.toLocation?.trim()) errors.push('Destination location is required');
  if (!data.productDescription?.trim()) errors.push('Product description is required');
  if (data.fromLocation?.trim() === data.toLocation?.trim()) errors.push('Origin and destination must be different');

  // Sender Details Validation
  if (!data.senderName?.trim()) errors.push('Sender name is required');
  if (!data.senderPhone?.trim()) errors.push('Sender phone number is required');
  else if (!validatePhone(data.senderPhone)) errors.push('Invalid sender phone number format');
  if (!data.senderAddress?.trim()) errors.push('Sender address is required');
  if (!data.senderCity?.trim()) errors.push('Sender city is required');
  if (data.senderEmail && !validateEmail(data.senderEmail)) errors.push('Invalid sender email address');

  // Receiver Details Validation
  if (!data.receiverName?.trim()) errors.push('Receiver name is required');
  if (!data.receiverPhone?.trim()) errors.push('Receiver phone number is required');
  else if (!validatePhone(data.receiverPhone)) errors.push('Invalid receiver phone number format');
  if (!data.receiverAddress?.trim()) errors.push('Receiver address is required');
  if (!data.receiverCity?.trim()) errors.push('Receiver city is required');
  if (data.receiverEmail && !validateEmail(data.receiverEmail)) errors.push('Invalid receiver email address');

  return errors;
};

/**
 * POST handler for submitting cargo booking or agro-prefinancing applications.
 * @param req - Next.js request object
 * @returns {Promise<NextResponse>} Response with submission details or error
 */export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Get session cookie
    const cookieStore = cookies(); // Fix: Ensure correct cookies() usage
    const sessionCookie = cookieStore.get('__session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to submit a request.' },
        { status: 401 }
      );
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Fetch user data
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    if (!userRecord) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to submit a request.' },
        { status: 401 }
      );
    }

    // Find or create user in Prisma database
    let dbUser = await prisma.user.findUnique({
      where: { email: userRecord.email! },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userRecord.uid,
          email: userRecord.email!,
          firstName: userRecord.displayName?.split(' ')[0] || '',
          lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || '',
        },
        select: { id: true, email: true, firstName: true, lastName: true },
      });
    }

    // Parse and validate request body
    const body: CargoFormData = await req.json();
    const validationErrors = validateRequiredFields(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Prepare sanitized data for database
    const cargoData = {
      fromLocation: sanitizeString(body.fromLocation),
      toLocation: sanitizeString(body.toLocation),
      date: body.date ? new Date(body.date) : null,
      cargoWeight: body.cargoWeight ? parseFloat(body.cargoWeight) : 0,
      productDescription: sanitizeString(body.productDescription),
      locationDescription: body.locationDescription ? sanitizeString(body.locationDescription) : null,
      senderName: sanitizeString(body.senderName),
      senderPhone: sanitizeString(body.senderPhone),
      senderEmail: body.senderEmail ? sanitizeString(body.senderEmail) : null,
      senderAddress: sanitizeString(body.senderAddress),
      senderCity: sanitizeString(body.senderCity),
      receiverName: sanitizeString(body.receiverName),
      receiverPhone: sanitizeString(body.receiverPhone),
      receiverEmail: body.receiverEmail ? sanitizeString(body.receiverEmail) : null,
      receiverAddress: sanitizeString(body.receiverAddress),
      receiverCity: sanitizeString(body.receiverCity),
      userId: dbUser.id,
      agroPrefinancing: body.agroPrefinancing || false,
      status: body.agroPrefinancing ? CargoFormStatus.processing : CargoFormStatus.pending,
    };

    // Validate cargo weight
    if (cargoData.cargoWeight < 0) {
      return NextResponse.json(
        { error: 'Cargo weight cannot be negative' },
        { status: 400 }
      );
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
            lastName: true,
          },
        },
      },
    });

    // Generate unique reference number
    const reference = `CRG-${cargoForm.id.slice(-8).toUpperCase()}-${new Date().getFullYear()}`;

    // Send email notifications
    const emailNotifications = await sendEmailNotifications(cargoForm, reference);

    // Log submission details
    console.log('Cargo Form Submitted:', {
      cargoFormId: cargoForm.id,
      reference,
      userId: dbUser.id,
      userEmail: userRecord.email,
      fromLocation: cargoData.fromLocation,
      toLocation: cargoData.toLocation,
      agroPrefinancing: cargoData.agroPrefinancing,
      submittedAt: new Date().toISOString(),
      emailNotifications,
    });

    // Prepare response
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
        estimatedProcessingTime: cargoData.agroPrefinancing ? '3-5 business days' : '24-48 hours',
      },
      notifications: {
        email: emailNotifications,
        message: 'Email notifications have been dispatched',
      },
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error: unknown) {
    // Log error details for debugging
    console.error('Cargo Form Submission Error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId: (await adminAuth.verifySessionCookie(cookies().get('__session')?.value || '', true).catch(() => null))?.uid,
    });

    // Handle specific Firebase errors
    if (error instanceof Error && 'code' in error && error.code === 'auth/invalid-session-cookie') {
      return NextResponse.json(
        { error: 'Invalid session cookie. Please log in again.' },
        { status: 401 }
      );
    }

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A similar request already exists. Please review your submission.' },
          { status: 409 }
        );
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid user reference. Please contact support.' },
          { status: 400 }
        );
      }
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'An error occurred while processing your request. Please try again or contact TRANZBOOK INC support.',
        code: 'SUBMISSION_FAILED',
      },
      { status: 500 }
    );
  }
}