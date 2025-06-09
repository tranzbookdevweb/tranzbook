import prisma from "@/app/lib/db";

export async function checkUserExists(email?: string, phoneNumber?: string) {
  try {
    if (!email && !phoneNumber) {
      return { exists: false, user: null };
    }

    // Normalize inputs
    const normalizedEmail = email ? email.toLowerCase().trim() : undefined;
    const normalizedPhoneNumber = phoneNumber ? phoneNumber.trim() : undefined;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          normalizedEmail ? { email: normalizedEmail } : {},
          normalizedPhoneNumber ? { phoneNumber: normalizedPhoneNumber } : {},
        ].filter(condition => Object.keys(condition).length > 0),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return {
      exists: !!user,
      user: user || null,
    };
  } catch (error: any) {
    console.error('Database check error:', {
      errorMessage: error.message,
      errorCode: error.code,
      email,
      phoneNumber,
      stack: error.stack,
    });
    throw new Error(`Failed to check user existence: ${error.message || 'Unknown database error'}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Create or update user in database
export async function createOrUpdateUser(userData: {
  firebaseUid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
}) {
  try {
    const { firebaseUid, email, firstName, lastName, phoneNumber, profileImage } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase() } : {},
          phoneNumber ? { phoneNumber } : {},
        ].filter(condition => Object.keys(condition).length > 0)
      }
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          email: email?.toLowerCase() || existingUser.email,
          firstName: firstName || existingUser.firstName,
          lastName: lastName || existingUser.lastName,
          phoneNumber: phoneNumber || existingUser.phoneNumber,
          profileImage: profileImage || existingUser.profileImage,
          updatedAt: new Date()
        }
      });
      return updatedUser;
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: firebaseUid, // Use Firebase UID as primary key
          email: email?.toLowerCase(),
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber,
          profileImage,
        }
      });
      return newUser;
    }
  } catch (error) {
    console.error('Database user creation/update error:', error);
    throw new Error('Failed to create/update user in database');
  }
}