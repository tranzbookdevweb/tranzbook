import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { Navbar } from './Navbar';

export async function ServerNavbar() {
  let user = null;

  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (sessionCookie) {
      // Verify the session cookie using Firebase Admin with revocation check
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      
      // Get user data from Firebase Admin
      const userRecord = await adminAuth.getUser(decodedClaims.sub);
      
      // Extract data needed for the client component
      user = {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        phoneNumber: userRecord.phoneNumber || null, // Added for phone auth
      };
      console.log(userRecord.photoURL)
    }
  } catch (error) {
    console.error('Session verification error:', error);
    // Clear invalid session cookie
    const cookieStore = cookies();
    cookieStore.delete('session');
    // User remains null if verification fails
  }

  // Pass user data to client component
  return <Navbar user={user} />;
}