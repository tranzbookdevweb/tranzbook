// pages/api/auth/login-callback.js
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

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

export async function POST(request: Request) {
  noStore();

  try {
    const { idToken, phoneNumber } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    // Verify Firebase ID token
    let decodedClaims;
    let firebaseUser;

    try {
      decodedClaims = await adminAuth.verifyIdToken(idToken);
      firebaseUser = await adminAuth.getUser(decodedClaims.uid);
    } catch (firebaseError) {
      console.error("Firebase token verification failed:", firebaseError);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!firebaseUser || !firebaseUser.email) {
      console.error("User not found in Firebase or email missing");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`Processing login for user: ${firebaseUser.email} (Firebase UID: ${firebaseUser.uid})`);

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

    // Check if user exists by email (for migration scenarios)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (existingUserByEmail && existingUserByEmail.id !== firebaseUser.uid) {
      // Migration scenario: update existing user
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
            phoneNumber: firebaseUser.phoneNumber || phoneNumber || existingUserByEmail.phoneNumber,
            updatedAt: new Date(),
          },
        });

        console.log(`Successfully migrated user ${firebaseUser.email} while preserving ID ${existingUserByEmail.id}`);
      } catch (migrationError) {
        console.error("Migration failed:", migrationError);
        return NextResponse.json({ error: "Migration failed" }, { status: 500 });
      }
    } else {
      // Check if user exists by Firebase UID
      dbUser = await prisma.user.findUnique({
        where: { id: firebaseUser.uid },
      });

      if (!dbUser) {
        // Create new user if not found
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
            phoneNumber: firebaseUser.phoneNumber || phoneNumber || null,
          };

          dbUser = await prisma.user.create({
            data: createData,
          });

          console.log(`Successfully created new user record for ${firebaseUser.email}`);
        } catch (createError) {
          console.error("User creation failed:", createError);
          return NextResponse.json({ error: "User creation failed" }, { status: 500 });
        }
      } else {
        // Update existing user with latest Firebase data or phone number
        const updateData: UserUpdateData = {};
        let shouldUpdate = false;

        if ((firebaseUser.phoneNumber && dbUser.phoneNumber !== firebaseUser.phoneNumber) ||
            (phoneNumber && dbUser.phoneNumber !== phoneNumber)) {
          updateData.phoneNumber = firebaseUser.phoneNumber || phoneNumber;
          shouldUpdate = true;
        }

        if (firebaseUser.photoURL && dbUser.profileImage !== firebaseUser.photoURL) {
          updateData.profileImage = firebaseUser.photoURL;
          shouldUpdate = true;
        }

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

    // Set session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    cookies().set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    if (phoneNumber) {
      cookies().set('__phoneNumber', phoneNumber, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn / 1000,
        path: '/',
      });
    }

    return NextResponse.json({ success: true, user: dbUser }, { status: 200 });
  } catch (error) {
    console.error("Login callback error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}