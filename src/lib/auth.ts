import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Create session cookie after login
export async function createSessionCookie(idToken: string) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create session');
  }
  
  return response.json();
}

// Email/Password login
export async function loginWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();
    await createSessionCookie(idToken);
    return result.user;
  } catch (error) {
    throw error;
  }
}

// Google login
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    await createSessionCookie(idToken);
    return result.user;
  } catch (error) {
    throw error;
  }
}

// Register with email/password
export async function registerWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await result.user.getIdToken();
    await createSessionCookie(idToken);
    return result.user;
  } catch (error) {
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (error) {
    throw error;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}