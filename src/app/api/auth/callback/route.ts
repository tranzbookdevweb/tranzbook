import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

interface UserUpdateData {
  phoneNumber?: string | null;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
}

interface CreateUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  phoneNumber?: string | null;
}

export async function GET() {
  noStore();

  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    const phoneNumberFromCookie = cookieStore.get('__phoneNumber')?.value; // Retrieve phone number from cookie

    if (!sessionCookie) {
      console.error("No session cookie found");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=session_missing`);
    }

    // Verify Firebase session
    let decodedClaims;
    let firebaseUser;

    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      firebaseUser = await adminAuth.getUser(decodedClaims.uid);
    } catch (firebaseError) {
      console.error("Firebase session verification failed:", firebaseError);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=invalid_session`);
    }

    if (!firebaseUser || !firebaseUser.email) {
      console.error("User not found in Firebase or email missing");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=user_not_found`);
    }

    console.log(`Processing user: ${firebaseUser.email} (Firebase UID: ${firebaseUser.uid})`);
    console.log('Firebase phone number:', firebaseUser.phoneNumber); // Debug log
    console.log('Cookie phone number:', phoneNumberFromCookie); // Debug log

    // Helper function to generate avatar URL
    const generateAvatarUrl = (name: string, email: string): string => {
      return `https://avatar.vercel.sh/${encodeURIComponent(name || email)}`;
    };

    // Helper function to parse display name
    const parseDisplayName = (displayName: string | undefined) => {
      if (!displayName) return { firstName: '', lastName: '' };
      const nameParts = displayName.trim().split(' ');
      return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      };
    };

    let dbUser = null;

    // Step 1: Check if user exists by email first (for migration scenarios)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (existingUserByEmail && existingUserByEmail.id !== firebaseUser.uid) {
      // Migration scenario: existing user with different ID
      console.log(`Migration detected for ${firebaseUser.email}: ${existingUserByEmail.id} -> ${firebaseUser.uid}`);

      try {
        const { firstName: fbFirstName, lastName: fbLastName } = parseDisplayName(firebaseUser.displayName);

        dbUser = await prisma.user.update({
          where: { email: firebaseUser.email },
          data: {
            profileImage:
              firebaseUser.photoURL ||
              existingUserByEmail.profileImage ||
              generateAvatarUrl(firebaseUser.displayName || '', firebaseUser.email),
            firstName: existingUserByEmail.firstName || fbFirstName,
            lastName: existingUserByEmail.lastName || fbLastName,
            phoneNumber: firebaseUser.phoneNumber || phoneNumberFromCookie || existingUserByEmail.phoneNumber, // Prioritize Firebase, then cookie, then existing
            updatedAt: new Date(),
          },
        });

        console.log(`Successfully migrated user ${firebaseUser.email} while preserving ID ${existingUserByEmail.id}`);
      } catch (migrationError) {
        console.error("Migration failed:", migrationError);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=migration_failed`);
      }
    } else {
      // Step 2: Check if user exists by Firebase UID
      dbUser = await prisma.user.findUnique({
        where: { id: firebaseUser.uid },
      });

      if (!dbUser) {
        // Step 3: Create new user
        console.log(`Creating new user record for ${firebaseUser.email}`);

        try {
          const { firstName, lastName } = parseDisplayName(firebaseUser.displayName);

          const createData: CreateUserData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            firstName,
            lastName,
            profileImage:
              firebaseUser.photoURL || generateAvatarUrl(firebaseUser.displayName || '', firebaseUser.email),
            phoneNumber: firebaseUser.phoneNumber || phoneNumberFromCookie || null, // Use cookie phoneNumber if Firebase doesn't provide it
          };

          dbUser = await prisma.user.create({
            data: createData,
          });

          console.log(`Successfully created new user record for ${firebaseUser.email}`);
        } catch (createError) {
          console.error("User creation failed:", createError);
          if (createError instanceof Error && createError.message.includes('Unique constraint')) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=duplicate_user`);
          }
          return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=user_creation_failed`);
        }
      } else {
        // Step 4: Update existing user with latest Firebase data or cookie data
        const updateData: UserUpdateData = {};
        let shouldUpdate = false;

        // Check phone number
        if ((firebaseUser.phoneNumber && dbUser.phoneNumber !== firebaseUser.phoneNumber) ||
            (phoneNumberFromCookie && dbUser.phoneNumber !== phoneNumberFromCookie)) {
          updateData.phoneNumber = firebaseUser.phoneNumber || phoneNumberFromCookie;
          shouldUpdate = true;
        }

        // Check profile image
        if (firebaseUser.photoURL && dbUser.profileImage !== firebaseUser.photoURL) {
          updateData.profileImage = firebaseUser.photoURL;
          shouldUpdate = true;
        }

        // Check and update names if Firebase has display name and DB fields are empty
        if (firebaseUser.displayName) {
          const { firstName: fbFirstName, lastName: fbLastName } = parseDisplayName(firebaseUser.displayName);
          if (!dbUser.firstName && fbFirstName) {
            updateData.firstName = fbFirstName;
            shouldUpdate = true;
          }
          if (!dbUser.lastName && fbLastName) {
            updateData.lastName = fbLastName;
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          try {
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                ...updateData,
                updatedAt: new Date(),
              },
            });
            console.log(`Updated user ${firebaseUser.email} with latest data`);
          } catch (updateError) {
            console.error("User update failed:", updateError);
            console.log("Continuing with existing user data...");
          }
        }
      }
    }

    // Clean up phone number cookie
    if (phoneNumberFromCookie) {
      cookieStore.delete('__phoneNumber');
    }

    // Ensure we have a valid user
    if (!dbUser) {
      console.error("Failed to create or retrieve user record");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=user_sync_failed`);
    }

    console.log(`Authentication successful for user: ${dbUser.email} (DB ID: ${dbUser.id})`);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/?auth=success`);
  } catch (error) {
    console.error("Authentication callback error:", error);
    let errorCode = 'auth_failed';
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('expired') || errorMessage.includes('exp')) {
        errorCode = 'session_expired';
      } else if (errorMessage.includes('invalid') || errorMessage.includes('malformed')) {
        errorCode = 'invalid_session';
      } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        errorCode = 'network_error';
      } else if (errorMessage.includes('database') || errorMessage.includes('prisma')) {
        errorCode = 'database_error';
      }
    }
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login?error=${errorCode}`);
  }
}