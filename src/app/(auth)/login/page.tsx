'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmail, loginWithGoogle, sendPhoneVerificationCode, verifyPhoneCodeAndSignIn, cleanupRecaptcha, isValidPhoneNumber } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Phone, Loader2 } from 'lucide-react';
import { ConfirmationResult } from 'firebase/auth';
import { checkUserExists } from '@/app/api/auth/login-callback/actions';

declare global {
  interface Window {
    recaptchaVerifier: any | null;
    recaptchaWidgetId?: number;
    grecaptcha?: {
      reset: (widgetId?: number) => void;
      render: (container: string | HTMLElement, parameters: any) => number;
      getResponse: (widgetId?: number) => string;
    };
  }
}

interface UserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const router = useRouter();

  useEffect(() => {
    setErrors({});
    setVerificationCode('');
    setConfirmationResult(null);
    cleanupRecaptcha();
    return () => cleanupRecaptcha();
  }, [formData.phoneNumber, authMethod]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (authMethod === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }
    if (authMethod === 'phone') {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!isValidPhoneNumber(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number with country code';
      }
      if (phoneStep === 'verify' && (!verificationCode || verificationCode.length !== 6)) {
        newErrors.verificationCode = 'Please enter a valid 6-digit code';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetRecaptcha = () => {
    if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined && window.grecaptcha) {
      window.grecaptcha.reset(window.recaptchaWidgetId);
    } else if (window.recaptchaVerifier && window.grecaptcha) {
      window.recaptchaVerifier.render().then((widgetId: number) => {
        window.recaptchaWidgetId = widgetId;
        window.grecaptcha?.reset(widgetId);
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userData: UserData = {
        phoneNumber: formData.phoneNumber || undefined,
      };
      const result = await signInWithEmail(formData.email, formData.password, userData);
      if (result.success) {
        router.push('/');
      }
    } catch (error: any) {
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const userData: UserData = {
        phoneNumber: formData.phoneNumber || undefined,
      };
      const result = await loginWithGoogle(userData);
      if (result.success) {
        router.push('/');
      }
    } catch (error: any) {
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const userCheck = await checkUserExists(undefined, formData.phoneNumber);
      if (!userCheck.exists) {
        setErrors({ phoneNumber: 'No account found with this phone number' });
        return;
      }
      const confirmation = await sendPhoneVerificationCode(formData.phoneNumber);
      setConfirmationResult(confirmation);
      setPhoneStep('verify');
      setErrors({});
    } catch (error: any) {
      setErrors({ general: getFirebaseErrorMessage(error) });
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!validateForm() || !confirmationResult || !formData.phoneNumber) return;

    try {
      setLoading(true);
      const userData: UserData = {
        phoneNumber: formData.phoneNumber,
      };
      const result = await verifyPhoneCodeAndSignIn(confirmationResult, verificationCode, userData);
      if (result.success) {
        router.push('/');
      }
    } catch (error: any) {
      setErrors({ verificationCode: getFirebaseErrorMessage(error) });
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleResendPhoneCode = async () => {
    if (!formData.phoneNumber) {
      setErrors({ phoneNumber: 'Phone number is required to resend code' });
      return;
    }

    try {
      setLoading(true);
      const confirmation = await sendPhoneVerificationCode(formData.phoneNumber);
      setConfirmationResult(confirmation);
      setErrors({ general: 'Verification code resent successfully' });
    } catch (error: any) {
      setErrors({ general: getFirebaseErrorMessage(error) });
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number. Please include country code';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code';
      case 'auth/code-expired':
        return 'Verification code has expired';
      case 'auth/too-many-requests':
        return 'Too many attempts, please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
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
    setConfirmationResult(null);
    cleanupRecaptcha();
  };

  return (
    <div className="min-h-screen bg-[#DEF5FB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/logoalt.png" width={100} height={100} alt="Logo" />
          </div>
          <CardTitle className="text-2xl text-center text-blue-600">Sign In</CardTitle>
          <CardDescription className="text-center">
            Welcome back! Sign in to continue your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
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

          <form onSubmit={handleEmailLogin} className="space-y-4">
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

                {/* <div className="space-y-2">
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
                </div> */}

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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#48A0ff] hover:bg-[#48a0ff60] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </>
            )}

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
                      <p className="text-xs text-gray-500">Include country code (e.g., +1 for US). You’ll receive an SMS code.</p>
                    </div>
                    <Button
                      type="button"
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
                        placeholder="123456"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="border-blue-300 focus:border-blue-500 text-center text-lg tracking-widest"
                        maxLength={6}
                        disabled={loading}
                      />
                      {errors.verificationCode && <p className="text-xs text-red-600">{errors.verificationCode}</p>}
                      <p className="text-xs text-gray-500">Enter the 6-digit code sent to {formData.phoneNumber}</p>
                    </div>
                    <Button
                      type="button"
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
                        'Verify & Sign In'
                      )}
                    </Button>
                    <Button
                      variant="link"
                      onClick={handleResendPhoneCode}
                      disabled={loading}
                      className="w-full text-blue-600 hover:text-blue-800"
                    >
                      Resend Verification Code
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        setPhoneStep('input');
                        setVerificationCode('');
                        setConfirmationResult(null);
                        cleanupRecaptcha();
                      }}
                      disabled={loading}
                      className="w-full text-blue-600 hover:text-blue-800"
                    >
                      Use different phone number
                    </Button>
                  </div>
                )}
              </>
            )}
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="ml-2">Google</span>
            </Button>
          </div>
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

export default Login;