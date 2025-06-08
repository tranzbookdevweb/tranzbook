// ServerNavbar.tsx - Server Component
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { Navbar } from './Navbar';

export async function ServerNavbar() {
  let user = null;

  try {
    // Get session cookie (corrected to __session)
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    if (sessionCookie) {
      // Verify the session cookie using Firebase Admin
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      
      // Get user data from Firebase Admin
      const userRecord = await adminAuth.getUser(decodedClaims.uid);
      
      // Extract data needed for the client component
      user = {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        phoneNumber: userRecord.phoneNumber || null, // Added for phone auth
      };
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    // User remains null if verification fails
  }

  // Pass user data to client component
  return <Navbar user={user} />;
}