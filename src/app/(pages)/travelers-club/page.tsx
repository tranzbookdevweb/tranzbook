'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface FormData {
  // Step 1
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  
  // Step 2
  departureCity: string;
  destinationCity: string;
  travelFrequency: string;
  travelType: string;
  
  // Step 3
  suggestions: string;
  termsAccepted: boolean;
  joinWhatsApp: boolean;
}

const TranzbookTravelersClub = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    departureCity: '',
    destinationCity: '',
    travelFrequency: '',
    travelType: '',
    suggestions: '',
    termsAccepted: false,
    joinWhatsApp: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    }

    if (step === 2) {
      if (!formData.departureCity) newErrors.departureCity = 'Departure city is required';
      if (!formData.destinationCity) newErrors.destinationCity = 'Destination city is required';
      if (!formData.travelFrequency) newErrors.travelFrequency = 'Travel frequency is required';
      if (!formData.travelType) newErrors.travelType = 'Travel type is required';
    }

    if (step === 3) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      try {
        // Map form data to API expected format
        const apiData = {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          whatsAppNumber: formData.whatsapp,
          departureCity: formData.departureCity,
          destinationCity: formData.destinationCity,
          travelFrequency: formData.travelFrequency,
          travelType: formData.travelType,
          suggestions: formData.suggestions,
          termsAccepted: formData.termsAccepted,
          joinWhatsApp: formData.joinWhatsApp
        };

        const response = await fetch('/api/POST/TravelersClub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert('Registration submitted successfully! Welcome to Tranzbook Travelers Club!');
          console.log('Registration successful:', result.data);
        } else {
          // Handle API errors
          if (result.details && Array.isArray(result.details)) {
            const apiErrors: Record<string, string> = {};
            result.details.forEach((error: any) => {
              if (error.path && error.path.length > 0) {
                // Map API field names back to form field names
                const fieldName = error.path[0] === 'phoneNumber' ? 'phone' : 
                                 error.path[0] === 'whatsAppNumber' ? 'whatsapp' : 
                                 error.path[0];
                apiErrors[fieldName] = error.message;
              }
            });
            setErrors(apiErrors);
          } else {
            alert(result.message || 'Registration failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit registration. Please check your connection and try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      departureCity: '',
      destinationCity: '',
      travelFrequency: '',
      travelType: '',
      suggestions: '',
      termsAccepted: false,
      joinWhatsApp: false
    });
    setCurrentStep(1);
    setErrors({});
  };

  const cities = [
    'Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi', 'Ho', 'Koforidua', 'Sunyani',
    'Bolgatanga', 'Wa', 'Techiman', 'Obuasi', 'Tema', 'Madina', 'Ashaiman'
  ];

  const travelFrequencyOptions = [
    'Daily', 'Weekly', '2-3 times per week', 'Monthly', '2-3 times per month', 'Occasionally'
  ];

  const travelTypeOptions = [
    'Business Travel', 'Leisure/Tourism', 'Family Visits', 'School/Education', 'Medical', 'Mixed Purpose'
  ];

  const stepTitles = ['Personal Information', 'Travel Profile', 'Finalize Registration'];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-8">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step 
              ? 'bg-green-500 text-white' 
              : currentStep === step
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          <div className={`mt-2 text-xs ${
            currentStep >= step ? 'text-green-600' : 'text-gray-500'
          }`}>
            {stepTitles[index]}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
        <Input
          id="phone"
          placeholder="+233 XX XXX XXXX"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">WhatsApp Number</Label>
        <Input
          id="whatsapp"
          placeholder="+233 XX XXX XXXX"
          value={formData.whatsapp}
          onChange={(e) => updateFormData('whatsapp', e.target.value)}
          className={`mt-1 ${errors.whatsapp ? 'border-red-500' : ''}`}
        />
        {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="departureCity" className="text-sm font-medium text-gray-700">Common Departure City</Label>
        <Select value={formData.departureCity} onValueChange={(value) => updateFormData('departureCity', value)}>
          <SelectTrigger className={`mt-1 ${errors.departureCity ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select your departure city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.departureCity && <p className="text-red-500 text-xs mt-1">{errors.departureCity}</p>}
      </div>

      <div>
        <Label htmlFor="destinationCity" className="text-sm font-medium text-gray-700">Destination City</Label>
        <Select value={formData.destinationCity} onValueChange={(value) => updateFormData('destinationCity', value)}>
          <SelectTrigger className={`mt-1 ${errors.destinationCity ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select your destination city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.destinationCity && <p className="text-red-500 text-xs mt-1">{errors.destinationCity}</p>}
      </div>

      <div>
        <Label htmlFor="travelFrequency" className="text-sm font-medium text-gray-700">How often do you travel by bus?</Label>
        <Select value={formData.travelFrequency} onValueChange={(value) => updateFormData('travelFrequency', value)}>
          <SelectTrigger className={`mt-1 ${errors.travelFrequency ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select travel frequency" />
          </SelectTrigger>
          <SelectContent>
            {travelFrequencyOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.travelFrequency && <p className="text-red-500 text-xs mt-1">{errors.travelFrequency}</p>}
      </div>

      <div>
        <Label htmlFor="travelType" className="text-sm font-medium text-gray-700">What type of travel do you do?</Label>
        <Select value={formData.travelType} onValueChange={(value) => updateFormData('travelType', value)}>
          <SelectTrigger className={`mt-1 ${errors.travelType ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select travel type" />
          </SelectTrigger>
          <SelectContent>
            {travelTypeOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.travelType && <p className="text-red-500 text-xs mt-1">{errors.travelType}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="suggestions" className="text-sm font-medium text-gray-700">Any suggestions for travelers club</Label>
        <Textarea
          id="suggestions"
          placeholder="Share your ideas to help us improve our services..."
          value={formData.suggestions}
          onChange={(e) => updateFormData('suggestions', e.target.value)}
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData('termsAccepted', checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className={`text-sm ${errors.termsAccepted ? 'text-red-500' : 'text-gray-700'}`}>
            I have read and agreed to terms and conditions
          </Label>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted}</p>}

        <div className="flex items-start space-x-2">
          <Checkbox
            id="whatsapp"
            checked={formData.joinWhatsApp}
            onCheckedChange={(checked) => updateFormData('joinWhatsApp', checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="whatsapp" className="text-sm text-gray-700">
            Join our whatsapp group
          </Label>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            TranzBook Travelers Club
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Registration Form
            </p>
          </div>

          {renderStepIndicator()}

          <div className="mb-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          <div className="flex justify-end space-x-3">
          {currentStep === 1 && (
            <Button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
            </Button>
          )}
          
          {currentStep === 2 && (
            <>
              <Button
                variant="outline"
                onClick={prevStep}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
              </Button>
            </>
          )}
          
          {currentStep === 3 && (
            <>
              <Button
                variant="outline"
                onClick={prevStep}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit
              </Button>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default TranzbookTravelersClub;