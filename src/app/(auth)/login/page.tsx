// src/app/(auth)/login/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Phone } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, User } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Clear error and reCAPTCHA when auth method or inputs change
  useEffect(() => {
    setError(null);
    setVerificationCode('');
    setVerificationId('');
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  }, [email, password, phoneNumber, authMethod]);

  const validateForm = () => {
    if (authMethod === 'email') {
      if (!email.trim()) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
      if (!password) return 'Password is required';
    }
    if (authMethod === 'phone') {
      if (phoneStep === 'input') {
        if (!phoneNumber.trim()) return 'Phone number is required';
        // Add phone number validation if needed
        // if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) return 'Please enter a valid phone number with country code (e.g., +1234567890)';
      }
      if (phoneStep === 'verify') {
        if (!verificationCode || verificationCode.length !== 6) return 'Please enter a valid 6-digit code';
      }
    }
    return null;
  };

  const setupRecaptcha = useCallback(() => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => console.log('reCAPTCHA solved'),
      'expired-callback': () => setError('reCAPTCHA expired, please try again'),
    });
  }, []);

  const createSession = async (user: User, phoneNumber?: string) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/login-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, phoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create session');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete login');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await loginWithEmail(email, password); // Returns firebase.User
      await createSession(user);
      router.push('/my-journeys');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await loginWithGoogle(); // Returns firebase.User
      await createSession(user);
      router.push('/my-journeys');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!);
      setVerificationId(confirmation.verificationId);
      setPhoneStep('verify');
      setError(null);
    } catch (err: any) {
      console.error('Phone login error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(auth, credential);
      await createSession(userCredential.user, phoneNumber);
      router.push('/my-journeys');
    } catch (err: any) {
      console.error('Phone verification error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendPhoneCode = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier!);
      setVerificationId(confirmation.verificationId);
      setError('Verification code resent successfully');
    } catch (err: any) {
      console.error('Phone resend error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code';
      case 'auth/code-expired':
        return 'Verification code has expired';
      case 'auth/too-many-requests':
        return 'Too many attempts, please try again later';
      default:
        return error.message || 'Failed to login';
    }
  };

  return (
    <div className="min-h-screen bg-[#DEF5FB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/pictures/logoNav.png" width={100} height={100} alt="Logo" />
          </div>
          <CardTitle className="text-2xl text-center text-blue-600">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to your account to continue your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1 hidden">
            <Button
              variant={authMethod === 'email' ? 'default' : 'ghost'}
              onClick={() => setAuthMethod('email')}
              className={`flex-1 text-sm ${authMethod === 'email' ? 'bg-white text-blue-600' : 'text-gray-500'}`}
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant={authMethod === 'phone' ? 'default' : 'ghost'}
              onClick={() => {
                setAuthMethod('phone');
                setPhoneStep('input');
              }}
              className={`flex-1 text-sm ${authMethod === 'phone' ? 'bg-white text-blue-600' : 'text-gray-500'}`}
              disabled={loading}
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </Button>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#48A0ff] hover:bg-[#48a0ff60] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          )}
          <div className="hidden">
            {authMethod === 'phone' && (
              <>
                {phoneStep === 'input' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="border-blue-300 focus:border-blue-500"
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
                    </div>
                    <Button
                      onClick={handlePhoneLogin}
                      disabled={loading}
                      className="w-full bg-[#48A0ff] hover:bg-[#48a0ff60] text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending Code...
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </Button>
                  </div>
                )}
                {phoneStep === 'verify' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Verification Code</Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="border-blue-300 focus:border-blue-500 text-center text-lg tracking-widest"
                        maxLength={6}
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500">Enter the 6-digit code sent to {phoneNumber}</p>
                    </div>
                    <Button
                      onClick={handleVerifyPhoneCode}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Sign in'
                      )}
                    </Button>
                    <Button
                      variant="link"
                      onClick={handleResendPhoneCode}
                      disabled={loading}
                      className="w-full text-blue-600 hover:underline"
                    >
                      Resend Verification Code
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        setPhoneStep('input');
                        setVerificationCode('');
                        setVerificationId('');
                        if (window.recaptchaVerifier) {
                          window.recaptchaVerifier.clear();
                          window.recaptchaVerifier = null;
                        }
                      }}
                      disabled={loading}
                      className="w-full text-blue-600 hover:underline"
                    >
                      Use different phone number
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="ml-2">Sign in with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      <div id="recaptcha-container" />
    </div>
  );
}