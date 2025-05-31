import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from 'nodemailer';
import puppeteer from 'puppeteer';

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
 * Generates PDF ticket HTML template
 * @param booking - The booking data
 * @param reference - Booking reference
 * @param tripDetails - Trip information
 * @returns {string} HTML template for PDF generation
 */
const generateTicketHTML = (booking: any, reference: string, tripDetails: any) => {
  const passengerDetails = Array.isArray(booking.passengerDetails) ? booking.passengerDetails : [booking.passengerDetails];
  const seatNumbers = Array.isArray(booking.seatNumber) ? booking.seatNumber : [booking.seatNumber];
  const dateString = new Date(booking.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bus Ticket - ${reference}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
        .ticket { max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
        .header h1 { font-size: 28px; font-weight: bold; }
        .header p { font-size: 14px; opacity: 0.9; }
        .route-section { background: #f8fafc; padding: 30px; border-bottom: 1px solid #e5e7eb; text-align: center; }
        .route-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 20px; align-items: center; }
        .route-point { text-align: center; }
        .route-point h3 { font-size: 20px; color: #1f2937; margin-bottom: 8px; }
        .route-point p { color: #6b7280; font-size: 14px; }
        .route-arrow { width: 60px; height: 2px; background: #3b82f6; position: relative; }
        .route-arrow::after { content: ''; position: absolute; right: -8px; top: -4px; width: 0; height: 0; border-left: 10px solid #3b82f6; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .passenger-section { padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .section-title { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
        .passenger-list { background: #f9fafb; padding: 20px; border-radius: 8px; }
        .passenger-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .passenger-item:last-child { border-bottom: none; }
        .passenger-name { font-weight: 600; color: #1f2937; }
        .seat-number { color: #6b7280; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .detail-item h4 { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .detail-item p { font-size: 16px; font-weight: 600; color: #1f2937; }
        .info-section { padding: 30px; background: #f8fafc; }
        .info-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
        .info-list { list-style: none; }
        .info-list li { color: #6b7280; font-size: 14px; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .info-list li::before { content: '•'; color: #3b82f6; font-weight: bold; position: absolute; left: 0; }
        .footer { background: #f1f5f9; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; }
        .footer-left { display: flex; align-items: center; gap: 10px; }
        .footer-text { font-size: 12px; color: #6b7280; }
        .total-amount { color: #059669; font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <!-- Header -->
        <div class="header">
          <div>
            <h1>${tripDetails?.bus?.company?.name || 'TRANZBOOK INC'}</h1>
            <p>E-Ticket Confirmation</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 16px; font-weight: 600;">${dateString}</p>
            <p style="font-size: 12px; opacity: 0.8;">Ticket #${reference}</p>
          </div>
        </div>

        <!-- Route Information -->
        <div class="route-section">
          <div class="route-grid">
            <div class="route-point">
              <h3>${tripDetails?.route?.startCity?.name || 'Departure'}</h3>
              <p>${tripDetails?.departureTime || 'Time TBA'}</p>
            </div>
            <div class="route-arrow"></div>
            <div class="route-point">
              <h3>${tripDetails?.route?.endCity?.name || 'Arrival'}</h3>
              <p>${tripDetails?.arrivalTime || 'Time TBA'}</p>
            </div>
          </div>
        </div>

        <!-- Passenger Details -->
        <div class="passenger-section">
          <div class="section-title">Passenger(s) & Seat(s)</div>
          <div class="passenger-list">
            ${passengerDetails.map((passenger: any, index: number) => `
              <div class="passenger-item">
                <span class="passenger-name">${passenger.name}</span>
                <span class="seat-number">Seat ${seatNumbers[index] || 'TBA'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Trip Details -->
        <div class="details-grid">
          <div class="detail-item">
            <h4>Bus Type</h4>
            <p>${tripDetails?.bus?.busDescription || 'Standard'}</p>
          </div>
          <div class="detail-item">
            <h4>Total Price</h4>
            <p class="total-amount">${tripDetails?.currency || 'GHS'} ${booking.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <!-- Important Information -->
        <div class="info-section">
          <div class="info-title">Important Information</div>
          <ul class="info-list">
            <li>Arrive 30 minutes prior to departure for smooth boarding</li>
            <li>Present this e-ticket at the boarding point</li>
            <li>Valid government-issued ID required during verification</li>
            <li>Contact us immediately if you need to make any changes</li>
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-left">
            <span class="footer-text">Powered by TRANZBOOK INC</span>
          </div>
          <span class="footer-text">Booking Ref: ${reference}</span>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generates PDF buffer from HTML using Puppeteer
 * @param htmlContent - HTML content to convert to PDF
 * @returns {Promise<Buffer>} PDF buffer
 */
const generatePDFBuffer = async (htmlContent: string): Promise<Buffer> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Generates an email template for notifying TRANZBOOK INC administrators of a new bus booking.
 * @param booking - The booking data with related information
 * @param reference - Unique reference number for the booking
 * @returns {object} Email configuration object
 */
const createAdminNotificationEmail = (booking: any, reference: string) => {
  const passengerCount = Array.isArray(booking.passengerDetails) ? booking.passengerDetails.length : 1;
  const seatNumbers = Array.isArray(booking.seatNumber) ? booking.seatNumber.join(', ') : booking.seatNumber;

  return {
    from: `"TRANZBOOK INC" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject: `New Bus Booking - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">TRANZBOOK INC</h1>
          <h2 style="margin: 10px 0 0;">New Bus Booking Confirmation</h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px;">
          <h3 style="color: #1f2937;">Reference: ${reference}</h3>
          <p><strong>Status:</strong> ${booking.status}</p>
          <p><strong>Booked:</strong> ${new Date(booking.createdAt || Date.now()).toLocaleString()}</p>

          <h3 style="color: #1f2937; margin-top: 20px;">🚌 Trip Details</h3>
          <ul style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <li><strong>Trip ID:</strong> ${booking.tripId}</li>
            <li><strong>Travel Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
            <li><strong>Seat(s):</strong> ${seatNumbers}</li>
            <li><strong>Passengers:</strong> ${passengerCount}</li>
            <li><strong>Total Amount:</strong> ${booking.trip?.currency || 'GHS'} ${booking.totalAmount.toFixed(2)}</li>
          </ul>

          <h3 style="color: #1f2937; margin-top: 20px;">👥 Passenger Information</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            ${Array.isArray(booking.passengerDetails) ? 
              booking.passengerDetails.map((passenger: any, index: number) => `
                <div style="margin-bottom: ${index < booking.passengerDetails.length - 1 ? '15px' : '0'}; ${index < booking.passengerDetails.length - 1 ? 'border-bottom: 1px solid #e5e7eb; padding-bottom: 15px;' : ''}">
                  <p><strong>Passenger ${index + 1}:</strong> ${passenger.name} (Age: ${passenger.age})</p>
                  <p><strong>Phone:</strong> ${passenger.phoneNumber}</p>
                  <p><strong>Emergency Contact:</strong> ${passenger.kinName} - ${passenger.kinContact}</p>
                </div>
              `).join('') : 
              `
                <p><strong>Name:</strong> ${booking.passengerDetails.name} (Age: ${booking.passengerDetails.age})</p>
                <p><strong>Phone:</strong> ${booking.passengerDetails.phoneNumber}</p>
                <p><strong>Emergency Contact:</strong> ${booking.passengerDetails.kinName} - ${booking.passengerDetails.kinContact}</p>
              `
            }
          </div>

          <h3 style="color: #1f2937; margin-top: 20px;">👨‍💼 Customer Information</h3>
          <ul style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <li><strong>User ID:</strong> ${booking.userId}</li>
            <li><strong>Name:</strong> ${booking.user?.firstName || ''} ${booking.user?.lastName || ''}</li>
            <li><strong>Email:</strong> ${booking.user?.email || 'Not provided'}</li>
          </ul>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">Please process this booking and prepare for passenger pickup.</p>
            <p style="color: #6b7280; font-size: 14px;">TRANZBOOK INC - Transport & Logistics Solutions</p>
          </div>
        </div>
      </div>
    `,
  };
};

/**
 * Generates an email template for confirming booking to the customer with PDF attachment.
 * @param booking - The booking data with related information
 * @param reference - Unique reference number for the booking
 * @param userEmail - Customer's email address
 * @param pdfBuffer - PDF ticket buffer
 * @returns {object} Email configuration object
 */
const createCustomerConfirmationEmail = (booking: any, reference: string, userEmail: string, pdfBuffer: Buffer) => {
  const passengerCount = Array.isArray(booking.passengerDetails) ? booking.passengerDetails.length : 1;
  const seatNumbers = Array.isArray(booking.seatNumber) ? booking.seatNumber.join(', ') : booking.seatNumber;
  const primaryPassenger = Array.isArray(booking.passengerDetails) ? booking.passengerDetails[0] : booking.passengerDetails;

  return {
    from: `"TRANZBOOK INC" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: `Bus Booking Confirmation - ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">TRANZBOOK INC</h1>
          <h2 style="margin: 10px 0 0;">Bus Booking Confirmed</h2>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #1f2937;">
            Dear ${primaryPassenger.name},<br><br>
            Thank you for choosing TRANZBOOK INC for your travel needs. 
            Your bus booking has been successfully confirmed and we're excited to have you aboard!
          </p>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Your Booking Reference</h3>
            <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">${reference}</p>
          </div>

          <h3 style="color: #1f2937;">🚌 Trip Summary</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            <p><strong>Travel Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Seat Number(s):</strong> ${seatNumbers}</p>
            <p><strong>Number of Passengers:</strong> ${passengerCount}</p>
            <p><strong>Total Amount:</strong> <span style="color: #059669; font-weight: bold;">${booking.trip?.currency || 'GHS'} ${booking.totalAmount.toFixed(2)}</span></p>
            <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${booking.status.toUpperCase()}</span></p>
          </div>

          <h3 style="color: #1f2937;">👥 Passenger Details</h3>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
            ${Array.isArray(booking.passengerDetails) ? 
              booking.passengerDetails.map((passenger: any, index: number) => `
                <div style="margin-bottom: ${index < booking.passengerDetails.length - 1 ? '15px' : '0'}; ${index < booking.passengerDetails.length - 1 ? 'border-bottom: 1px solid #e5e7eb; padding-bottom: 15px;' : ''}">
                  <p><strong>Passenger ${index + 1}:</strong> ${passenger.name} (Age: ${passenger.age})</p>
                  <p><strong>Contact:</strong> ${passenger.phoneNumber}</p>
                </div>
              `).join('') : 
              `
                <p><strong>Passenger:</strong> ${booking.passengerDetails.name} (Age: ${booking.passengerDetails.age})</p>
                <p><strong>Contact:</strong> ${booking.passengerDetails.phoneNumber}</p>
              `
            }
          </div>

          <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #047857; margin-top: 0;">📎 Your Ticket is Attached</h4>
            <p style="color: #047857; margin: 5px 0;">
              Your e-ticket has been attached to this email as a PDF. You can download and print it, 
              or show it on your mobile device at the boarding point.
            </p>
          </div>

          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #0c4a6e; margin-top: 0;">📋 Important Travel Information</h4>
            <ul style="color: #0c4a6e; margin: 10px 0;">
              <li>Please arrive at the departure point at least 30 minutes before scheduled departure</li>
              <li>Bring a valid ID for verification purposes</li>
              <li>Keep your booking reference handy for easy check-in</li>
              <li>Contact us immediately if you need to make any changes</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">⚠️ Cancellation Policy</h4>
            <p style="color: #92400e; margin: 5px 0;">
              Cancellations must be made at least 24 hours before departure for a full refund. 
              Same-day cancellations may incur charges.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">
              For assistance or changes to your booking, contact us at 
              <a href="mailto:${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}" style="color: #2563eb; text-decoration: none;">
                ${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}
              </a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              Reference: ${reference} | Booked: ${new Date().toLocaleString()}
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              TRANZBOOK INC - Safe, Reliable, Comfortable Travel
            </p>
          </div>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `TRANZBOOK-Ticket-${reference}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };
};

/**
 * Sends email notifications to both the admin and the customer.
 * @param booking - The booking data
 * @param reference - Unique reference number
 * @param tripDetails - Trip information for PDF generation
 * @returns {Promise<Array>} Array of notification results
 */
const sendEmailNotifications = async (booking: any, reference: string, tripDetails?: any): Promise<Array<{ type: string; success: boolean; messageId?: string; error?: string }>> => {
  const transporter = createEmailTransporter();
  const notifications: Array<{ type: string; success: boolean; messageId?: string; error?: string }> = [];

  // Send admin notification
  try {
    const adminEmail = createAdminNotificationEmail(booking, reference);
    const adminResult = await transporter.sendMail(adminEmail);
    notifications.push({ type: 'admin', success: true, messageId: adminResult.messageId });
    console.log('Admin notification sent:', adminResult.messageId);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    notifications.push({ type: 'admin', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }

  // Send customer confirmation with PDF attachment
  try {
    const userEmail = booking.user?.email;
    if (userEmail) {
      // Generate PDF ticket
      const ticketHTML = generateTicketHTML(booking, reference, tripDetails);
      const pdfBuffer = await generatePDFBuffer(ticketHTML);
      
      const confirmationEmail = createCustomerConfirmationEmail(booking, reference, userEmail, pdfBuffer);
      const userResult = await transporter.sendMail(confirmationEmail);
      notifications.push({ type: 'customer', success: true, messageId: userResult.messageId });
      console.log('Customer confirmation with PDF sent:', userResult.messageId);
    } else {
      notifications.push({ type: 'customer', success: false, error: 'Customer email not provided' });
    }
  } catch (error) {
    console.error('Failed to send customer confirmation:', error);
    notifications.push({ type: 'customer', success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }

  return notifications;
};

export async function POST(req: NextRequest) {
  try {
    console.log("Incoming Request:", req.method, req.url);
    const { searchParams } = new URL(req.url);
    const currentDate = searchParams.get("currentDate");
    const bookedDate = currentDate ? new Date(currentDate) : new Date();

    // Get the current user using Kinde authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    console.log("Authenticated User:", user);

    // If no user is found, return an error
    if (!user) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Parse the request body to get the booking data
    const body = await req.json();
    console.log("Request Body:", body);

    const { reference, tripId, seatNumber, passengerDetails } = body;

    // Ensure that all required fields are provided in the request
    if (!reference || !tripId || !seatNumber || !passengerDetails) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the trip details with bus and route information
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bus: {
          include: {
            company: true
          }
        },
        route: {
          include: {
            startCity: true,
            endCity: true
          }
        }
      }
    });

    if (!trip) {
      return NextResponse.json({ 
        error: 'Trip not found' 
      }, { status: 404 });
    }

    // Find or create the trip occurrence for the selected date
    let tripOccurrence = await prisma.tripOccurrence.findUnique({
      where: {
        tripId_occurrenceDate: {
          tripId: tripId,
          occurrenceDate: bookedDate
        }
      }
    });

    // If trip occurrence doesn't exist for this date, create it
    if (!tripOccurrence) {
      if (!trip.bus) {
        return NextResponse.json({ 
          error: 'Trip has no associated bus' 
        }, { status: 400 });
      }
      
      // Create the trip occurrence with full capacity
      tripOccurrence = await prisma.tripOccurrence.create({
        data: {
          tripId: tripId,
          occurrenceDate: bookedDate,
          availableSeats: trip.bus.capacity,
          bookedSeats: [],
          status: 'scheduled'
        }
      });
    }

    // Check if requested seats are available
    const requestedSeats = Array.isArray(seatNumber) ? seatNumber.map(Number) : [Number(seatNumber)];
    
    // Validate seat numbers
    if (requestedSeats.some(seat => isNaN(seat) || seat < 1 || seat > (trip.bus?.capacity || Infinity))) {
      return NextResponse.json({ 
        error: 'Invalid seat numbers' 
      }, { status: 400 });
    }

    // Check if any requested seat is already booked
    const alreadyBookedSeats = requestedSeats.filter(seat => 
      tripOccurrence.bookedSeats.includes(seat)
    );
    
    if (alreadyBookedSeats.length > 0) {
      return NextResponse.json({ 
        error: `Seats ${alreadyBookedSeats.join(', ')} are already booked` 
      }, { status: 400 });
    }
    
    // Check if there are enough available seats
    if (requestedSeats.length > tripOccurrence.availableSeats) {
      return NextResponse.json({ 
        error: 'Not enough available seats' 
      }, { status: 400 });
    }

    // Validate passenger details count matches seat count
    const passengerCount = Array.isArray(passengerDetails) ? passengerDetails.length : 1;
    if (passengerCount !== requestedSeats.length) {
      return NextResponse.json({ 
        error: 'Number of passengers must match number of seats' 
      }, { status: 400 });
    }

    // Update the trip occurrence with new booked seats
    const updatedBookedSeats = [...tripOccurrence.bookedSeats, ...requestedSeats];
    await prisma.tripOccurrence.update({
      where: { id: tripOccurrence.id },
      data: {
        availableSeats: tripOccurrence.availableSeats - requestedSeats.length,
        bookedSeats: updatedBookedSeats
      }
    });

    // Calculate total amount based on number of seats
    const totalAmount = trip.price * requestedSeats.length;

    // Create the booking with passenger details and include user relationship
    const booking = await prisma.booking.create({
      data: {
        reference,
        tripId,
        seatNumber: requestedSeats,
        status: "confirmed",
        date: bookedDate,
        userId: user.id,
        totalAmount,
        passengerDetails: {
          create: Array.isArray(passengerDetails) ? 
            passengerDetails.map(passenger => ({
              name: passenger.name,
              age: String(passenger.age),
              phoneNumber: passenger.phoneNumber,
              kinName: passenger.kinName,
              kinContact: passenger.kinContact,
              tripOccurrenceId: tripOccurrence.id
            })) : 
            [{
              name: passengerDetails.name,
              age: String(passengerDetails.age),
              phoneNumber: passengerDetails.phoneNumber,
              kinName: passengerDetails.kinName,
              kinContact: passengerDetails.kinContact,
              tripOccurrenceId: tripOccurrence.id
            }]
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        passengerDetails: true,
        trip: {
          include: {
            route: {
              include: {
                startCity: true,
                endCity: true
              }
            }
          }
        }
      }
    });

    // Send email notifications with PDF attachment
    const emailNotifications = await sendEmailNotifications(booking, reference, {
      bus: trip.bus,
      route: trip.route,
      departureTime: trip.departureTime,
      currency: trip.currency
    });

    // Check email notification results
    const customerEmailResult = emailNotifications.find(n => n.type === 'customer');
    if (!customerEmailResult?.success) {
      console.warn('Customer email failed to send:', customerEmailResult?.error);
    }

    return NextResponse.json({
      booking,
      emailNotifications
    }, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}