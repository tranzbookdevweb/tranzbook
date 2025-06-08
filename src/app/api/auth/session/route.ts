///api/auth/session
import { adminAuth } from '@/lib/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { idToken, phoneNumber } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Create session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set the session cookie
    const cookieStore = cookies();
    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Store phoneNumber in a cookie if provided
    if (phoneNumber) {
      cookieStore.set('__phoneNumber', phoneNumber, {
        maxAge: expiresIn / 1000, // Match session cookie expiration
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Session created successfully',
      userId: decodedToken.uid,
    });
 } catch (error) {
      if (error instanceof Error) {
     
  console.error('Full error object:', error);
  console.error('Error code:', error.message);
  console.error('Error message:', error.message);
  
  let errorMessage = 'Failed to create session';
  let statusCode = 401;
  
  if (error.message === 'auth/id-token-expired') {
    errorMessage = 'Token has expired';
  } else if (error.message === 'auth/invalid-id-token') {
    errorMessage = 'Invalid token format';
  } else if (error.message === 'auth/project-not-found') {
    errorMessage = 'Firebase project configuration error';
    statusCode = 500;
  }
  
  return NextResponse.json({ error: errorMessage }, { status: statusCode });
}} }

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('__session');
    cookieStore.delete('__phoneNumber'); // Clean up phoneNumber cookie

    return NextResponse.json({ success: true, message: 'Session cleared' });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
  }
}