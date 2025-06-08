'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  updateProfile,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Phone, Github, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (authMethod === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      // Phone number is optional for email signup, but validate if provided
      if (formData.phoneNumber.trim() && !isValidPhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number with country code (e.g., +1234567890)';
      }
    }

    if (authMethod === 'phone') {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!isValidPhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number with country code (e.g., +1234567890)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidPhoneNumber = (phone: string) => {
    // Basic validation for international phone numbers
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const createSession = async (user: any) => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, phoneNumber: formData.phoneNumber }), // Include phoneNumber
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const callbackResponse = await fetch('/api/auth/callback');
      if (!callbackResponse.ok) {
        throw new Error('Failed to process authentication callback');
      }

      window.location.href = '/login?auth=success';
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to complete sign-up' });
      throw error;
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // If phone number is provided, you can store it in your database during the callback
      // The phone number will be available in formData.phoneNumber for the backend to process
      
      await createSession(userCredential.user);
    } catch (error: any) {
      console.error('Email signup error:', error);
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createSession(result.user);
    } catch (error: any) {
      console.error('Google signup error:', error);
      setErrors({ general: getFirebaseErrorMessage(error) });
      setLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createSession(result.user);
    } catch (error: any) {
      console.error('GitHub signup error:', error);
      setErrors({ general: getFirebaseErrorMessage(error) });
      setLoading(false);
    }
  };

  const setupRecaptcha = useCallback(() => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => console.log('reCAPTCHA solved'),
      'expired-callback': () => setErrors({ general: 'reCAPTCHA expired, please try again' }),
    });
  }, []);

  const sendPhoneVerification = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, formData.phoneNumber, window.recaptchaVerifier!);
      setVerificationId(confirmation.verificationId);
      setPhoneStep('verify');
      setErrors({});
    } catch (error: any) {
      console.error('Phone verification error:', error);
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const resendPhoneVerification = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, formData.phoneNumber, window.recaptchaVerifier!);
      setVerificationId(confirmation.verificationId);
      setErrors({ general: 'Verification code resent successfully' });
    } catch (error: any) {
      console.error('Phone verification resend error:', error);
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({ verificationCode: 'Please enter a valid 6-digit code' });
      return;
    }

    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      const userCredential = await signInWithCredential(auth, credential);
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });
      await createSession(userCredential.user);
    } catch (error: any) {
      console.error('Phone verification error:', error);
      setErrors({ verificationCode: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code';
      case 'auth/code-expired':
        return 'Verification code has expired';
      case 'auth/too-many-requests':
        return 'Too many attempts, please try again later';
      default:
        return error.message || 'Failed to process request';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAuthMethodSwitch = (method: 'email' | 'phone') => {
    setAuthMethod(method);
    setPhoneStep('input');
    setErrors({});
    setVerificationCode('');
    setVerificationId('');
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  return (
    <div className="min-h-screen bg-[#DEF5FB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/pictures/logoNav.png" width={100} height={100} alt="Logo" />
          </div>
          <CardTitle className="text-2xl text-center text-blue-600">Create Account</CardTitle>
          <CardDescription className="text-center">Join us to start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1 hidden">
            <Button
              variant={authMethod === 'email' ? 'default' : 'ghost'}
              onClick={() => handleAuthMethodSwitch('email')}
              className={`flex-1 text-sm ${authMethod === 'email' ? 'bg-white text-blue-600' : 'text-gray-500'}`}
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant={authMethod === 'phone' ? 'default' : 'ghost'}
              onClick={() => handleAuthMethodSwitch('phone')}
              className={`flex-1 text-sm ${authMethod === 'phone' ? 'bg-white text-blue-600' : 'text-gray-500'}`}
              disabled={loading}
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </Button>
          </div>

          {errors.general && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="border-blue-300 focus:border-blue-500"
                  disabled={loading}
                />
                {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="border-blue-300 focus:border-blue-500"
                  disabled={loading}
                />
                {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {authMethod === 'email' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-blue-300 focus:border-blue-500"
                    disabled={loading}
                  />
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2 hidden">
                  <Label htmlFor="phoneNumberEmail">Phone Number <span className="text-gray-500 text-xs">(Optional)</span></Label>
                  <Input
                    id="phoneNumberEmail"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="border-blue-300 focus:border-blue-500"
                    disabled={loading}
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
                  <p className="text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="border-blue-300 focus:border-blue-500 pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="border-blue-300 focus:border-blue-500 pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#48A0ff] hover:bg-[#48a0ff60] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </>
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
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="border-blue-300 focus:border-blue-500"
                          disabled={loading}
                        />
                        {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
                        <p className="text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
                      </div>
                      <Button
                        type="button"
                        onClick={sendPhoneVerification}
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
                        {errors.verificationCode && <p className="text-xs text-red-600">{errors.verificationCode}</p>}
                        <p className="text-xs text-gray-500">Enter the 6-digit code sent to {formData.phoneNumber}</p>
                      </div>
                      <Button
                        type="button"
                        onClick={verifyPhoneCode}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Create Account'
                        )}
                      </Button>
                      <Button
                        variant="link"
                        onClick={resendPhoneVerification}
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
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="ml-2">Google</span>
              </Button>
            <Button
              variant="outline"
              onClick={handleGithubSignUp}
              disabled={loading}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <div id="recaptcha-container" />
    </div>
  );
}

export default SignUp;