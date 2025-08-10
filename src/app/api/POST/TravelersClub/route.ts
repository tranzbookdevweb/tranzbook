import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for the registration form
const travelersClubSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  whatsAppNumber: z.string().min(10, 'WhatsApp number must be at least 10 digits'),
  departureCity: z.string().min(1, 'Departure city is required'),
  destinationCity: z.string().min(1, 'Destination city is required'),
  travelFrequency: z.enum([
    'Daily',
    'Weekly',
    '2-3 times per week',
    'Monthly',
    '2-3 times per month',
    'Occasionally'
  ]),
  travelType: z.enum([
    'Business Travel',
    'Leisure/Tourism',
    'Family Visits',
    'School/Education',
    'Medical',
    'Mixed Purpose'
  ]),
  suggestions: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'Terms and conditions must be accepted'
  }),
  joinWhatsApp: z.boolean().optional().default(false)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = travelersClubSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if email already exists
    const existingMember = await prisma.travelersClubMember.findUnique({
      where: { email: data.email }
    });

    if (existingMember) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered',
          message: 'A member with this email already exists'
        },
        { status: 409 }
      );
    }

    // Check if there's an existing user with this email to link
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    // Create new travelers club member
    const newMember = await prisma.travelersClubMember.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        whatsAppNumber: data.whatsAppNumber,
        departureCity: data.departureCity,
        destinationCity: data.destinationCity,
        travelFrequency: data.travelFrequency,
        travelType: data.travelType,
        suggestions: data.suggestions || null,
        termsAccepted: data.termsAccepted,
        joinWhatsApp: data.joinWhatsApp,
        userId: existingUser?.id || null, // Link to existing user if found
      }
    });

    // Fetch the member with user details if linked
    const memberWithUser = existingUser ? await prisma.travelersClubMember.findUnique({
      where: { id: newMember.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    }) : null;

    // Optional: Send welcome email or WhatsApp message here
    // if (data.joinWhatsApp) {
    //   await sendWhatsAppInvite(data.whatsAppNumber);
    // }
    
    // Optional: Send welcome email
    // await sendWelcomeEmail(data.email, data.name);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Welcome to TranzBook Travelers Club!',
        data: {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          registrationDate: newMember.registrationDate,
          linkedUser: memberWithUser?.user ? {
            id: memberWithUser.user.id,
            name: `${memberWithUser.user.firstName} ${memberWithUser.user.lastName}`
          } : null
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Travelers Club Registration Error:', error);

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Registration failed',
            message: 'Email already exists'
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to process registration. Please try again later.'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Optional GET method to retrieve member information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email or ID parameter is required'
        },
        { status: 400 }
      );
    }

    const whereCondition = email ? { email } : { id: id! };
    
    const member = await prisma.travelersClubMember.findUnique({
      where: whereCondition,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: member.id,
          name: member.name,
          email: member.email,
          phoneNumber: member.phoneNumber,
          whatsAppNumber: member.whatsAppNumber,
          departureCity: member.departureCity,
          destinationCity: member.destinationCity,
          travelFrequency: member.travelFrequency,
          travelType: member.travelType,
          suggestions: member.suggestions,
          joinWhatsApp: member.joinWhatsApp,
          status: member.status,
          registrationDate: member.registrationDate,
          linkedUser: member.user
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get Member Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}