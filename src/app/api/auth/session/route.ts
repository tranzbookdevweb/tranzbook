//api/auth/session
import { adminAuth } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkUserExists, createOrUpdateUser } from '../login-callback/actions';

export async function POST(request: NextRequest) {
  try {
    const { idToken, csrfToken, phoneNumber, userData } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const storedCsrfToken = cookieStore.get('csrfToken')?.value;

    if (!csrfToken || csrfToken !== storedCsrfToken) {
      return NextResponse.json({ error: 'UNAUTHORIZED REQUEST!' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const currentTime = new Date().getTime() / 1000;
    const authTime = decodedToken.auth_time;

    if (currentTime - authTime > 5 * 60) {
      return NextResponse.json({ error: 'Recent sign in required!' }, { status: 401 });
    }

    const firebaseEmail = decodedToken.email;
    const firebasePhone = decodedToken.phone_number || phoneNumber;

    const { exists, user: existingUser } = await checkUserExists(firebaseEmail, firebasePhone);

    let dbUser;
    if (exists && existingUser) {
      dbUser = await createOrUpdateUser({
        firebaseUid: decodedToken.uid,
        email: firebaseEmail,
        firstName: userData?.firstName || existingUser.firstName || '',
        lastName: userData?.lastName || existingUser.lastName || '',
        phoneNumber: firebasePhone || userData?.phoneNumber,
        profileImage: userData?.profileImage || existingUser.profileImage,
      });
    } else {
      if ((userData?.provider === 'google' || decodedToken.phone_number) && !userData?.phoneNumber) {
        return NextResponse.json({ 
          error: 'Phone number is required for new users',
          requiresUserData: true,
          firebaseUid: decodedToken.uid
        }, { status: 400 });
      }
      dbUser = await createOrUpdateUser({
        firebaseUid: decodedToken.uid,
        email: firebaseEmail,
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phoneNumber: firebasePhone || userData?.phoneNumber,
        profileImage: userData?.profileImage,
      });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const options = {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    cookieStore.set('session', sessionCookie, options);
    if (phoneNumber) {
      cookieStore.set('phoneNumber', phoneNumber, {
        ...options,
        httpOnly: false,
      });
    }

    return NextResponse.json({
      status: 'success',
      userId: decodedToken.uid,
      user: dbUser,
      isNewUser: !exists
    });
  } catch (error) {
    console.error('Session creation error:', error);
    
    if (error instanceof Error) {
      const errorCode = (error as any).code;
      
      switch (errorCode) {
        case 'auth/id-token-expired':
          return NextResponse.json({ error: 'Token has expired' }, { status: 401 });
        case 'auth/invalid-id-token':
          return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
        default:
          return NextResponse.json({ 
            error: error.message || 'UNAUTHORIZED REQUEST!' 
          }, { status: 401 });
      }
    }
    
    return NextResponse.json({ error: 'UNAUTHORIZED REQUEST!' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get CSRF token from headers
    const csrfToken = request.headers.get('X-CSRF-Token');
    const cookieStore = cookies();
    const storedCsrfToken = cookieStore.get('csrfToken')?.value;

    // Validate CSRF token
    if (!csrfToken || csrfToken !== storedCsrfToken) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 401 });
    }

    // Clear session cookie
    cookieStore.delete('session');
    cookieStore.delete('phoneNumber');

    // Clear CSRF token cookie (optional, since client also clears it)
    cookieStore.delete('csrfToken');

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
  }
}