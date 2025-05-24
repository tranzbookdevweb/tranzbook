import prisma from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cargoCompany = await prisma.cargoCompany.create({
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        address: body.address,
        city: body.city,
        country: body.country,
        registrationNumber: body.registrationNumber || null,
        logo: body.logo || null,
        website: body.website || null,
        description: body.description || null,
        maxWeightCapacity: body.maxWeightCapacity || null,
        serviceAreas: body.serviceAreas || [],
        specializations: body.specializations || [],
        contactPersonName: body.contactPersonName || null,
        contactPersonPhone: body.contactPersonPhone || null,
        contactPersonEmail: body.contactPersonEmail || null,
        licenseNumber: body.licenseNumber || null,
        insuranceDetails: body.insuranceDetails || null,
        operatingHours: body.operatingHours || null,
        emergencyContact: body.emergencyContact || null,
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Cargo company registered successfully!',
        data: cargoCompany
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating cargo company:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to register cargo company',
        message: 'Please try again later' 
      },
      { status: 500 }
    );
  }
}


// import prisma from '@/app/lib/db';
// import { NextRequest, NextResponse } from 'next/server';

// // Define the interface for the request body
// interface CargoCompanyData {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   city: string;
//   country: string;
//   registrationNumber?: string;
//   logo?: string;
//   website?: string;
//   description?: string;
//   maxWeightCapacity?: number;
//   serviceAreas: string[];
//   specializations: string[];
//   contactPersonName?: string;
//   contactPersonPhone?: string;
//   contactPersonEmail?: string;
//   licenseNumber?: string;
//   insuranceDetails?: string;
//   operatingHours?: string;
//   emergencyContact?: string;
// }

// export async function POST(req: NextRequest) {
//   try {
//     // Parse the request body
//     const body: CargoCompanyData = await req.json();

//     // Validate required fields
//     const requiredFields = ['name', 'email', 'phoneNumber', 'address', 'city', 'country'];
//     const missingFields = requiredFields.filter(field => !body[field]);

//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { 
//           error: 'Validation failed',
//           message: `Missing required fields: ${missingFields.join(', ')}`,
//           missingFields 
//         },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(body.email)) {
//       return NextResponse.json(
//         { 
//           error: 'Validation failed',
//           message: 'Invalid email format' 
//         },
//         { status: 400 }
//       );
//     }

//     // Check if cargo company with this email already exists
//     const existingCompany = await prisma.cargoCompany.findUnique({
//       where: { email: body.email }
//     });

//     if (existingCompany) {
//       return NextResponse.json(
//         { 
//           error: 'Company already exists',
//           message: 'A cargo company with this email is already registered' 
//         },
//         { status: 409 }
//       );
//     }

//     // Check if registration number already exists (if provided)
//     if (body.registrationNumber) {
//       const existingRegistration = await prisma.cargoCompany.findUnique({
//         where: { registrationNumber: body.registrationNumber }
//       });

//       if (existingRegistration) {
//         return NextResponse.json(
//           { 
//             error: 'Registration number already exists',
//             message: 'A cargo company with this registration number is already registered' 
//           },
//           { status: 409 }
//         );
//       }
//     }

//     // Validate contact person email if provided
//     if (body.contactPersonEmail && !emailRegex.test(body.contactPersonEmail)) {
//       return NextResponse.json(
//         { 
//           error: 'Validation failed',
//           message: 'Invalid contact person email format' 
//         },
//         { status: 400 }
//       );
//     }

//     // Validate website URL if provided
//     if (body.website) {
//       try {
//         new URL(body.website);
//       } catch {
//         return NextResponse.json(
//           { 
//             error: 'Validation failed',
//             message: 'Invalid website URL format' 
//           },
//           { status: 400 }
//         );
//       }
//     }

//     // Create the cargo company
//     const cargoCompany = await prisma.cargoCompany.create({
//       data: {
//         name: body.name.trim(),
//         email: body.email.toLowerCase().trim(),
//         phoneNumber: body.phoneNumber.trim(),
//         address: body.address.trim(),
//         city: body.city.trim(),
//         country: body.country.trim(),
//         registrationNumber: body.registrationNumber?.trim() || null,
//         logo: body.logo?.trim() || null,
//         website: body.website?.trim() || null,
//         description: body.description?.trim() || null,
//         maxWeightCapacity: body.maxWeightCapacity || null,
//         serviceAreas: body.serviceAreas.filter(area => area.trim()),
//         specializations: body.specializations.filter(spec => spec.trim()),
//         contactPersonName: body.contactPersonName?.trim() || null,
//         contactPersonPhone: body.contactPersonPhone?.trim() || null,
//         contactPersonEmail: body.contactPersonEmail?.toLowerCase().trim() || null,
//         licenseNumber: body.licenseNumber?.trim() || null,
//         insuranceDetails: body.insuranceDetails?.trim() || null,
//         operatingHours: body.operatingHours?.trim() || null,
//         emergencyContact: body.emergencyContact?.trim() || null,
//         status: 'pending_verification', // Set status to pending verification
//         isVerified: false, // Default to not verified
//       }
//     });

//     // Return success response with created company data (excluding sensitive info)
//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Cargo company registered successfully! Your application is under review.',
//         data: {
//           id: cargoCompany.id,
//           name: cargoCompany.name,
//           email: cargoCompany.email,
//           status: cargoCompany.status,
//           createdAt: cargoCompany.createdAt
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Error creating cargo company:', error);

//     // Handle Prisma specific errors
//     if (error instanceof Error) {
//       // Handle unique constraint violations
//       if (error.message.includes('Unique constraint')) {
//         return NextResponse.json(
//           { 
//             error: 'Duplicate entry',
//             message: 'A cargo company with this information already exists' 
//           },
//           { status: 409 }
//         );
//       }

//       // Handle other Prisma errors
//       if (error.message.includes('Invalid input')) {
//         return NextResponse.json(
//           { 
//             error: 'Invalid data',
//             message: 'The provided data is invalid' 
//           },
//           { status: 400 }
//         );
//       }
//     }

//     // Generic error response
//     return NextResponse.json(
//       { 
//         error: 'Internal server error',
//         message: 'An unexpected error occurred while registering the cargo company' 
//       },
//       { status: 500 }
//     );
//   }
// }