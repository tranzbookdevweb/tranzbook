import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import nodemailer, { Transporter } from 'nodemailer';
import puppeteer from 'puppeteer';

// Define interfaces for type safety (unchanged)
interface TripResponse {
  id: string;
  tripId: string;
  company: string;
  route: string;
  date: string;
  totalAmount: number;
  currency: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  seatNumbers: number[];
  tripDetails: {
    departureTime: string;
    basePrice: number;
    commission: number;
    commissionType: string;
    recurring: boolean;
    daysOfWeek: number[] | null;
    bus: {
      plateNumber: string;
      capacity: number;
      description: string | null;
      status: string;
      image: string | null;
      amenities: {
        airConditioning: boolean;
        chargingOutlets: boolean;
        wifi: boolean;
        restRoom: boolean;
        seatBelts: boolean;
        onboardFood: boolean;
      };
    } | null;
    route: {
      duration: number;
      distance: number;
    };
    driver: {
      name: string;
      mobile: string | null;
      status: string;
    } | null;
    occurrence: {
      occurrenceDate: string;
      status: string;
      availableSeats: number;
      bookedSeats: number[];
    } | null;
}
}
interface TripOccurrence {
  id: string;
  occurrenceDate: Date;
  status: string;
  availableSeats: number;
  bookedSeats: number[];
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
 * Calculates arrival time based on departure time and duration
 * @param departureTime - Departure time string (e.g., "14:30")
 * @param duration - Duration in minutes
 * @param travelDate - Travel date
 * @returns {string} Formatted arrival time (e.g., "16:30")
 */
const calculateArrivalTime = (departureTime: string, duration: number, travelDate: Date): string => {
  // Parse departure time (e.g., "14:30" -> hours and minutes)
  const [hours, minutes] = departureTime.split(':').map(Number);
  
  // Create a Date object for the departure time on the travel date
  const departureDateTime = new Date(travelDate);
  departureDateTime.setHours(hours, minutes, 0, 0);
  
  // Add duration (in minutes) to get arrival time
  const arrivalDateTime = new Date(departureDateTime.getTime() + duration * 60 * 1000);
  
  // Format arrival time as "HH:mm"
  const arrivalHours = String(arrivalDateTime.getHours()).padStart(2, '0');
  const arrivalMinutes = String(arrivalDateTime.getMinutes()).padStart(2, '0');
  return `${arrivalHours}:${arrivalMinutes}`;
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

  const individualFare = booking.totalAmount / passengerDetails.length;

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
        .header-left { display: flex; align-items: center; gap: 15px; }
        .company-logo { width: 50px; height: 50px; background: white; border-radius: 8px; padding: 5px; }
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
        .info-section { padding: 30px; background: #f8fafc; display: flex; gap: 30px; align-items: flex-start; }
        .info-content { flex: 1; }
        .info-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
        .info-list { list-style: none; }
        .info-list li { color: #6b7280; font-size: 14px; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .info-list li::before { content: '•'; color: #3b82f6; font-weight: bold; position: absolute; left: 0; }
        .qr-section { text-align: center; }
        .qr-code { width: 120px; height: 120px; margin-bottom: 10px; }
        .qr-text { font-size: 12px; color: #6b7280; }
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
          <div class="header-left">
            <img src="${`https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${tripDetails?.bus?.company?.logo}`} alt="Company Logo" class="company-logo">
            <div>
              <h1>${tripDetails?.bus?.company?.name || 'TRANZBOOK INC'}</h1>
              <p>E-Ticket Confirmation</p>
            </div>
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
            <p>${tripDetails?.bus?.busDescription || tripDetails?.bus?.description || 'Standard'}</p>
          </div>
          <div class="detail-item">
            <h4>Individual Price</h4>
            <p class="total-amount">${tripDetails?.currency || 'GHS'} ${individualFare.toFixed(2)}</p>
          </div>
        </div>

        <!-- Important Information with QR Code -->
        <div class="info-section">
          <div class="info-content">
            <div class="info-title">Important Information</div>
            <ul class="info-list">
              <li>Arrive 30 minutes prior to departure for smooth boarding</li>
              <li>Present this e-ticket at the boarding point</li>
              <li>Valid government-issued ID required during verification</li>
              <li>Contact us immediately if you need to make any changes</li>
            </ul>
          </div>
          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://tranzbook.co/validate?ref=${reference}`)}" alt="QR Code" class="qr-code">
            <p class="qr-text">Scan for Verification</p>
          </div>
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
/**
/**
/**
 * Generates a clean, professional email template for notifying TRANZBOOK INC administrators of a new bus booking.
 * @param booking - The booking data with related information
 * @param reference - Unique reference number for the booking
 * @returns {object} Email configuration object
 */
const createAdminNotificationEmail = (booking:any, reference:string) => {
  const passengerCount = Array.isArray(booking.passengerDetails) ? booking.passengerDetails.length : 1;
  const seatNumbers = Array.isArray(booking.seatNumber) ? booking.seatNumber.join(', ') : booking.seatNumber;
  const bookingTime = new Date(booking.createdAt || Date.now()).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    from: `"TRANZBOOK INC" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
    subject: `New Booking - ${reference}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Notification</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #2c3e50; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Booking Alert</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">TRANZBOOK INC Administration</p>
          </div>

          <!-- Booking Summary -->
          <div style="padding: 30px; border-bottom: 1px solid #eee;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #2c3e50;">Booking Reference: ${reference}</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                <div><strong>Booking Time:</strong> ${bookingTime}</div>
                <div><strong>Status:</strong> <span style="color: #27ae60; font-weight: 600;">${booking.status.toUpperCase()}</span></div>
                <div><strong>Passengers:</strong> ${passengerCount}</div>
                <div><strong>Seats:</strong> ${seatNumbers}</div>
              </div>
            </div>

            <!-- Trip Details -->
            <div style="margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; border-bottom: 2px solid #3498db; padding-bottom: 5px; display: inline-block;">Trip Information</h3>
              <table style="width: 100%; font-size: 14px; line-height: 1.6;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; width: 120px;">Trip ID:</td>
                  <td style="padding: 8px 0; font-family: monospace; background-color: #f8f9fa; padding: 4px 8px; border-radius: 3px;">${booking.tripId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Travel Date:</td>
                  <td style="padding: 8px 0;">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600;">Total Amount:</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #27ae60; font-size: 16px;">${booking.trip?.currency || 'GHS'} ${booking.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Passenger Details -->
          <div style="padding: 30px; border-bottom: 1px solid #eee;">
            <h3 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px; border-bottom: 2px solid #3498db; padding-bottom: 5px; display: inline-block;">Passenger Details</h3>
            
            ${Array.isArray(booking.passengerDetails) ? 
              booking.passengerDetails.map((passenger:any, index:number) => `
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="margin: 0; color: #2c3e50; font-size: 16px;">${passenger.name}</h4>
                    <span style="background-color: #3498db; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Seat ${booking.seatNumber[index] || 'TBA'}</span>
                  </div>
                  <table style="width: 100%; font-size: 14px;">
                    <tr>
                      <td style="padding: 4px 0; font-weight: 600; width: 140px;">Age:</td>
                      <td style="padding: 4px 0;">${passenger.age}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 600;">Phone:</td>
                      <td style="padding: 4px 0;">${passenger.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 600;">Emergency Contact:</td>
                      <td style="padding: 4px 0;">${passenger.kinName} - ${passenger.kinContact}</td>
                    </tr>
                  </table>
                </div>
              `).join('') : 
              `
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="margin: 0; color: #2c3e50; font-size: 16px;">${booking.passengerDetails.name}</h4>
                    <span style="background-color: #3498db; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">Seat ${booking.seatNumber}</span>
                  </div>
                  <table style="width: 100%; font-size: 14px;">
                    <tr>
                      <td style="padding: 4px 0; font-weight: 600; width: 140px;">Age:</td>
                      <td style="padding: 4px 0;">${booking.passengerDetails.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 600;">Phone:</td>
                      <td style="padding: 4px 0;">${booking.passengerDetails.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-weight: 600;">Emergency Contact:</td>
                      <td style="padding: 4px 0;">${booking.passengerDetails.kinName} - ${booking.passengerDetails.kinContact}</td>
                    </tr>
                  </table>
                </div>
              `
            }
          </div>

          <!-- Customer Information -->
          <div style="padding: 30px; border-bottom: 1px solid #eee;">
            <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; border-bottom: 2px solid #3498db; padding-bottom: 5px; display: inline-block;">Customer Account</h3>
            <table style="width: 100%; font-size: 14px; line-height: 1.6;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; width: 120px;">Name:</td>
                <td style="padding: 8px 0;">${booking.user?.firstName || ''} ${booking.user?.lastName || ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;">${booking.user?.email || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600;">User ID:</td>
                <td style="padding: 8px 0; font-family: monospace; background-color: #f8f9fa; padding: 4px 8px; border-radius: 3px; display: inline-block;">${booking.userId}</td>
              </tr>
            </table>
          </div>

          <!-- Action Required -->
          <div style="padding: 20px 30px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
            <h4 style="margin: 0 0 8px 0; color: #856404; font-size: 14px;">⚠️ Action Required</h4>
            <p style="margin: 0; font-size: 14px; color: #856404;">Please process this booking and ensure the bus is ready for passenger pickup.</p>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 30px; background-color: #f8f9fa; text-align: center; font-size: 12px; color: #6c757d;">
            <p style="margin: 0;">TRANZBOOK INC | Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

/**
 * Generates a professional email template for confirming booking to the customer with PDF attachment.
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
    subject: `Booking Confirmation - ${reference}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px 30px; color: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">TRANZBOOK</h1>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">INC</p>
              </div>
              <div style="text-align: right;">
                <div style="background-color: rgba(255, 255, 255, 0.1); padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">
                  CONFIRMED
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Reference -->
          <div style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 24px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1e40af;">Booking Reference</h2>
              <p style="margin: 0; font-size: 28px; font-weight: 800; color: #1e40af; letter-spacing: 0.05em;">${reference}</p>
            </div>
          </div>

          <!-- Greeting -->
          <div style="padding: 30px 30px 20px 30px;">
            <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1f2937;">Hello ${primaryPassenger.name},</h3>
            <p style="margin: 0; font-size: 16px; color: #4b5563;">Your bus booking has been confirmed. We've attached your e-ticket to this email for your convenience.</p>
          </div>

          <!-- Trip Summary -->
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
              <h4 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Trip Summary</h4>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Travel Date</p>
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Seat Number${passengerCount > 1 ? 's' : ''}</p>
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${seatNumbers}</p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Passenger${passengerCount > 1 ? 's' : ''}</p>
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${passengerCount}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total Amount</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #059669;">${booking.trip?.currency || 'GHS'} ${booking.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Passenger Details -->
          <div style="padding: 0 30px 30px 30px;">
            <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Passenger Information</h4>
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              ${Array.isArray(booking.passengerDetails) ? 
                booking.passengerDetails.map((passenger: any, index: number) => `
                  <div style="padding: 20px; ${index < booking.passengerDetails.length - 1 ? 'border-bottom: 1px solid #e2e8f0;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${passenger.name}</p>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">Age: ${passenger.age} | Phone: ${passenger.phoneNumber}</p>
                      </div>
                      <div style="background-color: #f3f4f6; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; color: #374151;">
                        Seat ${booking.seatNumber[index] || 'TBA'}
                      </div>
                    </div>
                  </div>
                `).join('') : 
                `
                  <div style="padding: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${booking.passengerDetails.name}</p>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">Age: ${booking.passengerDetails.age} | Phone: ${booking.passengerDetails.phoneNumber}</p>
                      </div>
                      <div style="background-color: #f3f4f6; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; color: #374151;">
                        Seat ${booking.seatNumber}
                      </div>
                    </div>
                  </div>
                `
              }
            </div>
          </div>

          <!-- Important Information -->
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 20px;">
              <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">Before You Travel</h4>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li style="margin-bottom: 8px;">Arrive 30 minutes before departure</li>
                <li style="margin-bottom: 8px;">Bring a valid government-issued ID</li>
                <li style="margin-bottom: 8px;">Present your e-ticket (attached PDF)</li>
                <li>Contact us for any changes or assistance</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Need help? Contact our support team</p>
              <p style="margin: 0; font-size: 14px;">
                <a href="mailto:${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                  ${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}
                </a>
              </p>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af;">Booked on ${new Date().toLocaleDateString()}</p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} TRANZBOOK INC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
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
 * Generates a professional email template for confirming booking to individual passengers with their specific PDF ticket.
 * @param booking - The booking data with related information
 * @param reference - Unique reference number for the booking
 * @param passenger - Individual passenger details
 * @param seatNumber - Specific seat number for this passenger
 * @param pdfBuffer - PDF ticket buffer for this specific passenger
 * @returns {object} Email configuration object
 */
const createIndividualPassengerEmail = (booking: any, reference: string, passenger: any, seatNumber: number, pdfBuffer: Buffer) => {
  return {
    from: `"TRANZBOOK INC" <${process.env.GMAIL_USER}>`,
    to: passenger.email,
    subject: `Your Bus Ticket - ${reference}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Bus Ticket</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px 30px; color: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">TRANZBOOK</h1>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">INC</p>
              </div>
              <div style="text-align: right;">
                <div style="background-color: rgba(255, 255, 255, 0.1); padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">
                  CONFIRMED
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Reference -->
          <div style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 24px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1e40af;">Your Ticket Reference</h2>
              <p style="margin: 0; font-size: 28px; font-weight: 800; color: #1e40af; letter-spacing: 0.05em;">${reference}</p>
            </div>
          </div>

          <!-- Personal Greeting -->
          <div style="padding: 30px 30px 20px 30px;">
            <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1f2937;">Hello ${passenger.name},</h3>
            <p style="margin: 0; font-size: 16px; color: #4b5563;">Your bus ticket has been confirmed. Please find your e-ticket attached to this email.</p>
          </div>

          <!-- Individual Trip Summary -->
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
              <h4 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Your Trip Details</h4>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Travel Date</p>
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Your Seat</p>
                  <p style="margin: 0; font-size: 20px; font-weight: 700; color: #059669;">Seat ${seatNumber}</p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Passenger Name</p>
                  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${passenger.name}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Ticket Price</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 700; color: #059669;">${booking.trip?.currency || 'GHS'} ${(booking.totalAmount / (Array.isArray(booking.seatNumber) ? booking.seatNumber.length : 1)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div style="padding: 0 30px 30px 30px;">
            <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1f2937;">Your Information</h4>
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 16px;">
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Phone Number</p>
                  <p style="margin: 0; font-size: 14px; color: #1f2937;">${passenger.phoneNumber}</p>
                </div>
                <div>
                  <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Email</p>
                  <p style="margin: 0; font-size: 14px; color: #1f2937;">${passenger.email}</p>
                </div>
              </div>
              <div style="padding-top: 16px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Emergency Contact</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #1f2937;">${passenger.kinName}</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">${passenger.kinContact}</p>
              </div>
            </div>
          </div>

          <!-- Important Information -->
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 20px;">
              <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #92400e;">Before You Travel</h4>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li style="margin-bottom: 8px;">Arrive 30 minutes before departure</li>
                <li style="margin-bottom: 8px;">Bring a valid government-issued ID</li>
                <li style="margin-bottom: 8px;">Present your e-ticket (attached PDF)</li>
                <li>Contact us for any changes or assistance</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 30px; border-top: 1px solid #e2e8f0;">
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Need help? Contact our support team</p>
              <p style="margin: 0; font-size: 14px;">
                <a href="mailto:${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                  ${process.env.ADMIN_EMAIL || process.env.GMAIL_USER}
                </a>
              </p>
            </div>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af;">Booked on ${new Date().toLocaleDateString()}</p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} TRANZBOOK INC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `TRANZBOOK-Ticket-${reference}-${passenger.name.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };
};

/**
 * Generates individual PDF ticket for a specific passenger
 * @param booking - The booking data
 * @param reference - Booking reference
 * @param passenger - Individual passenger details
 * @param seatNumber - Specific seat number
 * @param tripDetails - Trip information
 * @returns {string} HTML template for individual PDF generation
 */
const generateIndividualTicketHTML = (booking: any, reference: string, passenger: any, seatNumber: number, tripDetails: any) => {
  const dateString = new Date(booking.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  const individualFare = booking.totalAmount / (Array.isArray(booking.seatNumber) ? booking.seatNumber.length : 1);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bus Ticket - ${reference} - ${passenger.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; }
        .ticket { max-width: 800px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
        .header-left { display: flex; align-items: center; gap: 15px; }
        .company-logo { width: 50px; height: 50px; background: white; border-radius: 8px; padding: 5px; }
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
        .passenger-item { display: flex; justify-content: space-between; padding: 12px 0; }
        .passenger-name { font-weight: 600; color: #1f2937; }
        .seat-number { color: #6b7280; font-size: 18px; font-weight: 700; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .detail-item h4 { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .detail-item p { font-size: 16px; font-weight: 600; color: #1f2937; }
        .info-section { padding: 30px; background: #f8fafc; display: flex; gap: 30px; align-items: flex-start; }
        .info-content { flex: 1; }
        .info-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 15px; }
        .info-list { list-style: none; }
        .info-list li { color: #6b7280; font-size: 14px; margin-bottom: 8px; padding-left: 20px; position: relative; }
        .info-list li::before { content: '•'; color: #3b82f6; font-weight: bold; position: absolute; left: 0; }
        .qr-section { text-align: center; }
        .qr-code { width: 120px; height: 120px; margin-bottom: 10px; }
        .qr-text { font-size: 12px; color: #6b7280; }
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
          <div class="header-left">
            <img src="${tripDetails?.bus?.company?.logo ? `https://dzviyoyyyopfsokiylmm.supabase.co/storage/v1/object/public/${tripDetails.bus.company.logo}` : ''}" alt="Company Logo" class="company-logo">
            <div>
              <h1>${tripDetails?.bus?.company?.name || 'TRANZBOOK INC'}</h1>
              <p>E-Ticket Confirmation</p>
            </div>
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

        <!-- Individual Passenger Details -->
        <div class="passenger-section">
          <div class="section-title">Passenger & Seat</div>
          <div class="passenger-list">
            <div class="passenger-item">
              <span class="passenger-name">${passenger.name}</span>
              <span class="seat-number">Seat ${seatNumber}</span>
            </div>
          </div>
        </div>

        <!-- Trip Details -->
        <div class="details-grid">
          <div class="detail-item">
            <h4>Bus Type</h4>
            <p>${tripDetails?.bus?.busDescription || tripDetails?.bus?.description || 'Standard'}</p>
          </div>
          <div class="detail-item">
            <h4>Ticket Price</h4>
            <p class="total-amount">${tripDetails?.currency || 'GHS'} ${individualFare.toFixed(2)}</p>
          </div>
        </div>

        <!-- Important Information with QR Code -->
        <div class="info-section">
          <div class="info-content">
            <div class="info-title">Important Information</div>
            <ul class="info-list">
              <li>Arrive 30 minutes prior to departure for smooth boarding</li>
              <li>Present this e-ticket at the boarding point</li>
              <li>Valid government-issued ID required during verification</li>
              <li>Contact us immediately if you need to make any changes</li>
            </ul>
          </div>
          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`https://tranzbook.co/validate?ref=${reference}&passenger=${encodeURIComponent(passenger.name)}&seat=${seatNumber}`)}" alt="QR Code" class="qr-code">
            <p class="qr-text">Scan for Verification</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-left">
            <span class="footer-text">Powered by TRANZBOOK INC</span>
          </div>
          <span class="footer-text">Booking Ref: ${reference} | ${passenger.name}</span>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Sends email notifications to both the admin and the customer.
 * @param booking - The booking data
 * @param reference - Unique reference number
 * @param tripDetails - Trip information for PDF generation
 * @returns {Promise<Array>} Array of notification results
 */
/**
 * Sends individual email notifications to each passenger with their specific ticket.
 * @param booking - The booking data
 * @param reference - Unique reference number
 * @param tripDetails - Trip information for PDF generation
 * @returns {Promise<Array>} Array of notification results
 */
const sendEmailNotifications = async (booking: any, reference: string, tripDetails?: any): Promise<Array<{ type: string; success: boolean; messageId?: string; error?: string; passenger?: string }>> => {
  const transporter = createEmailTransporter();
  const notifications: Array<{ type: string; success: boolean; messageId?: string; error?: string; passenger?: string }> = [];

  // Calculate arrival time
  const arrivalTime = calculateArrivalTime(
    tripDetails.departureTime,
    tripDetails.route.duration,
    new Date(booking.date)
  );

  // Update tripDetails with arrivalTime
  const updatedTripDetails = {
    ...tripDetails,
    arrivalTime, // Add the calculated arrival time
  };

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

  // Send individual passenger emails
  const passengerDetails = Array.isArray(booking.passengerDetails) ? booking.passengerDetails : [booking.passengerDetails];
  const seatNumbers = Array.isArray(booking.seatNumber) ? booking.seatNumber : [booking.seatNumber];

  for (let i = 0; i < passengerDetails.length; i++) {
    const passenger = passengerDetails[i];
    const seatNumber = seatNumbers[i];

    try {
      if (passenger.email) {
        // Generate individual PDF ticket
        const individualTicketHTML = generateIndividualTicketHTML(booking, reference, passenger, seatNumber, updatedTripDetails);
        const pdfBuffer = await generatePDFBuffer(individualTicketHTML);
        
        const passengerEmail = createIndividualPassengerEmail(booking, reference, passenger, seatNumber, pdfBuffer);
        const passengerResult = await transporter.sendMail(passengerEmail);
        
        notifications.push({ 
          type: 'passenger', 
          success: true, 
          messageId: passengerResult.messageId,
          passenger: passenger.name
        });
        console.log(`Passenger email sent to ${passenger.name}:`, passengerResult.messageId);
      } else {
        notifications.push({ 
          type: 'passenger', 
          success: false, 
          error: 'Email address not provided',
          passenger: passenger.name
        });
      }
    } catch (error) {
      console.error(`Failed to send email to passenger ${passenger.name}:`, error);
      notifications.push({ 
        type: 'passenger', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        passenger: passenger.name
      });
    }
  }

  // Send to booking user if different from passengers
  try {
    const userEmail = booking.user?.email;
    if (userEmail && !passengerDetails.some((p: any) => p.email === userEmail)) {
      // Send a summary email to the booking user
      const summaryEmail = createCustomerConfirmationEmail(booking, reference, userEmail, await generatePDFBuffer(generateTicketHTML(booking, reference, updatedTripDetails)));
      const userResult = await transporter.sendMail(summaryEmail);
      notifications.push({ 
        type: 'booking_user', 
        success: true, 
        messageId: userResult.messageId 
      });
      console.log('Booking user summary email sent:', userResult.messageId);
    }
  } catch (error) {
    console.error('Failed to send booking user summary email:', error);
    notifications.push({ 
      type: 'booking_user', 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }

  return notifications;
};
export async function POST(req: NextRequest) {
  try {
    console.log("Incoming Request:", req.method, req.url);
    const { searchParams } = new URL(req.url);
    const currentDate = searchParams.get("currentDate");
    const bookedDate = currentDate ? new Date(currentDate) : new Date();

    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "No session found" },
        { status: 401 }
      );
    }

    // Verify session cookie with revocation check
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // Fetch user data
    const userRecord = await adminAuth.getUser(decodedClaims.sub);

    if (!userRecord) {
      // Clear invalid session cookie
      const cookieStore = cookies();
      cookieStore.delete('session');
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }

    // Find or create user in Prisma database
    let dbUser = await prisma.user.findUnique({
      where: { email: userRecord.email! },
      select: { id: true },
    });

    if (!dbUser) {
      // Create user in Prisma if not exists
      dbUser = await prisma.user.create({
        data: {
          id: userRecord.uid, // Use Firebase UID as Prisma user ID
          email: userRecord.email!,
          firstName: userRecord.displayName?.split(' ')[0] || '',
          lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || '',
        },
        select: { id: true },
      });
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
        userId: dbUser.id,
        totalAmount,
        passengerDetails: {
          create: Array.isArray(passengerDetails) ? 
            passengerDetails.map(passenger => ({
              name: passenger.name,
              phoneNumber: passenger.phoneNumber,
              email: passenger.email,
              kinName: passenger.kinName,
              kinContact: passenger.kinContact,
              kinEmail: passenger.kinEmail,
              tripOccurrenceId: tripOccurrence.id
            })) : 
            [{
              name: passengerDetails.name,
              phoneNumber: passengerDetails.phoneNumber,
              email: passengerDetails.email,
              kinName: passengerDetails.kinName,
              kinContact: passengerDetails.kinContact,
              kinEmail: passengerDetails.kinEmail,
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
      duration: trip.route.duration, // Ensure duration is included
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
    // Clear invalid session cookie
    const cookieStore = cookies();
    cookieStore.delete('session');
    return NextResponse.json({ 
      error: 'Invalid session or failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 });
  }
}