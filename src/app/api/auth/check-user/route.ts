import { NextRequest, NextResponse } from "next/server";
import { checkUserExists } from "../login-callback/actions";

export async function POST(request: NextRequest) {
  try {
    const { email, phoneNumber } = await request.json();
    
    if (!email && !phoneNumber) {
      return NextResponse.json({ error: 'Email or phone number required' }, { status: 400 });
    }
    
    const { exists, user } = await checkUserExists(email, phoneNumber);
    
    return NextResponse.json({
      exists,
      user: exists ? {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: user?.phoneNumber
      } : null
    });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ error: 'Failed to check user' }, { status: 500 });
  }
}