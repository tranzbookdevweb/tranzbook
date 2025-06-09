import { auth } from '@/lib/firebase';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserSessionPersistence,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  ConfirmationResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

// Set persistence to NONE for httpOnly cookies as per Firebase docs
auth.setPersistence ? auth.setPersistence(browserSessionPersistence) : null;

// Generate CSRF token
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get or create CSRF token
function getCSRFToken(): string {
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrfToken='))
    ?.split('=')[1];
  
  if (!csrfToken) {
    csrfToken = generateCSRFToken();
    document.cookie = `csrfToken=${csrfToken}; path=/; SameSite=Lax; ${
      process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    }`;
  }
  
  return csrfToken;
}

// Create session cookie after login
export async function createSessionCookie(
  idToken: string, 
  phoneNumber?: string,
  userData?: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  }
) {
  const csrfToken = getCSRFToken();
  
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      idToken, 
      csrfToken,
      phoneNumber,
      userData
    }),
  });
  
  const responseData = await response.json();
  
  if (!response.ok) {
    if (responseData.requiresUserData) {
      throw new Error('USER_DATA_REQUIRED');
    }
    throw new Error(responseData.error || 'Failed to create session');
  }
  
  return responseData;
}

// Setup reCAPTCHA verifier with better error handling
// Setup reCAPTCHA verifier
export function setupRecaptcha(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
  if ((window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier.clear();
    (window as any).recaptchaVerifier = null;
  }

  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
      throw new Error('reCAPTCHA expired, please try again');
    },
  });

  (window as any).recaptchaVerifier = recaptchaVerifier;
  
  return recaptchaVerifier;
}


// Send phone verification code for sign-in
export async function sendPhoneVerificationCode(phoneNumber: string): Promise<ConfirmationResult> {
  try {
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format. Please include country code (e.g., +1234567890)');
    }

    // Clean up any existing reCAPTCHA before creating new one
    cleanupRecaptcha();
    
    // Small delay to ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const recaptchaVerifier = setupRecaptcha();
    
    // Render the reCAPTCHA explicitly
    // await recaptchaVerifier.render();
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    
    console.log('SMS sent successfully');
    return confirmationResult;
  } catch (error: any) {
    console.error('Phone verification error:', error);
    cleanupRecaptcha();
    
    // Provide more specific error messages
    if (error.code === 'auth/invalid-app-credential') {
      throw new Error('Firebase configuration error. Please check your project setup and authorized domains.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number. Please include country code (e.g., +1234567890)');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    }
    
    throw error;
  }
}

// Verify phone code and sign in
export async function verifyPhoneCodeAndSignIn(
  confirmationResult: ConfirmationResult, 
  verificationCode: string,
  userData: { firstName?: string; lastName?: string; phoneNumber?: string; profileImage?: string }
): Promise<{ user: any; dbUser: any; isNewUser: boolean; success: boolean }> {
  try {
    if (!userData.phoneNumber || !isValidPhoneNumber(userData.phoneNumber)) {
      throw new Error('Valid phone number is required for phone authentication');
    }
    if (!userData.firstName || !userData.lastName) {
      throw new Error('USER_DATA_REQUIRED');
    }

    const result = await confirmationResult.confirm(verificationCode);
    const idToken = await result.user.getIdToken();

    const firebaseUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: userData.firstName + ' ' + userData.lastName,
      phoneNumber: result.user.phoneNumber,
    };

    const sessionData = await createSessionCookie(idToken, userData.phoneNumber, userData);

    await signOut(auth);

    return {
      user: firebaseUser,
      dbUser: sessionData.user,
      isNewUser: sessionData.isNewUser,
      success: true
    };
  } catch (error: any) {
    console.error('Phone verification error:', error);
    throw error;
  }
}

// Register with email and password
export async function registerWithEmail(
  email: string,
  password: string,
  userData: { firstName?: string; lastName?: string; phoneNumber?: string; profileImage?: string }
): Promise<{ user: any; dbUser: any; isNewUser: boolean; success: boolean }> {
  try {
    if (!userData.firstName || !userData.lastName) {
      throw new Error('USER_DATA_REQUIRED');
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();

    const firebaseUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: userData.firstName + ' ' + userData.lastName,
      phoneNumber: userData.phoneNumber || null,
    };

    const sessionData = await createSessionCookie(idToken, userData.phoneNumber, userData);

    await signOut(auth);

    return {
      user: firebaseUser,
      dbUser: sessionData.user,
      isNewUser: sessionData.isNewUser,
      success: true
    };
  } catch (error: any) {
    console.error('Email registration error:', error);
    throw error;
  }
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string,
  userData: { phoneNumber?: string; profileImage?: string }
): Promise<{ user: any; dbUser: any; isNewUser: boolean; success: boolean }> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();

    const firebaseUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      phoneNumber: userData.phoneNumber || null,
    };

    const sessionData = await createSessionCookie(idToken, userData.phoneNumber, userData);

    await signOut(auth);

    return {
      user: firebaseUser,
      dbUser: sessionData.user,
      isNewUser: sessionData.isNewUser,
      success: true
    };
  } catch (error: any) {
    console.error('Email sign-in error:', error);
    throw error;
  }
}

// Alternative method using credential-based sign-in
export async function signInWithPhoneCredential(
  verificationId: string, 
  verificationCode: string,
  additionalData?: { displayName?: string }
): Promise<{ user: any; success: boolean }> {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const result = await signInWithCredential(auth, credential);
    const idToken = await result.user.getIdToken();
    
    const userData = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || additionalData?.displayName,
      phoneNumber: result.user.phoneNumber,
    };
    
    await createSessionCookie(idToken, result.user.phoneNumber || undefined);
    
    await signOut(auth);
    
    return {
      user: userData,
      success: true
    };
  } catch (error) {
    console.error('Phone credential sign-in error:', error);
    throw error;
  }
}

// Google login
export async function loginWithGoogle(
  userData: { firstName?: string; lastName?: string; phoneNumber?: string; profileImage?: string }
) {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const displayName = result.user.displayName || '';
    const nameParts = displayName.split(' ');
    const firstName = userData.firstName || nameParts[0] || '';
    const lastName = userData.lastName || nameParts.slice(1).join(' ') || '';

    const firebaseUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName,
      photoURL: result.user.photoURL,
      phoneNumber: userData.phoneNumber || null,
    };

    const sessionData = await createSessionCookie(idToken, userData.phoneNumber, {
      firstName,
      lastName,
      profileImage: userData.profileImage || result.user.photoURL || undefined
    });

    await signOut(auth);

    return {
      user: firebaseUser,
      dbUser: sessionData.user,
      isNewUser: sessionData.isNewUser,
      success: true
    };
  } catch (error: any) {
    console.error('Google login error:', error);
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
    
    const response = await fetch('/api/auth/session', { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.warn('Failed to clear server session, but client logout successful');
    }
    
    document.cookie = 'csrfToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
      (window as any).recaptchaVerifier = null;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Get current session from server
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Verify session and get user data
export async function verifySession() {
  try {
    const userData = await getCurrentUser();
    return userData ? userData : null;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Helper function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const userData = await getCurrentUser();
    return userData && userData.status === 'success';
  } catch (error) {
    return false;
  }
}

// Helper function to get user claims
export async function getUserClaims() {
  try {
    const userData = await getCurrentUser();
    return userData?.claims || null;
  } catch (error) {
    console.error('Get user claims error:', error);
    return null;
  }
}

// Helper function to check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const userData = await getCurrentUser();
    return userData?.isAdmin === true;
  } catch (error) {
    return false;
  }
}

// Refresh session
export async function refreshSession() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No current user found');
    }
    
    const idToken = await currentUser.getIdToken(true);
    await createSessionCookie(idToken);
    
    return { success: true };
  } catch (error) {
    console.error('Session refresh error:', error);
    throw new Error('Session refresh failed. Please sign in again.');
  }
}


// Clean up reCAPTCHA verifier
export function cleanupRecaptcha() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (error) {
      console.warn('Error clearing reCAPTCHA:', error);
    }
    window.recaptchaVerifier = null;
  }
  
  // Also clean up any existing reCAPTCHA widgets in the DOM
  const recaptchaContainer = document.getElementById('recaptcha-container');
  if (recaptchaContainer) {
    recaptchaContainer.innerHTML = '';
  }
}
export function isValidPhoneNumber(phone: string): boolean {
  // More comprehensive phone number validation
  const cleanPhone = phone.replace(/\s+/g, '');
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(cleanPhone) && cleanPhone.length >= 8 && cleanPhone.length <= 16;
}