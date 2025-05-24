import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter,
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Scale, 
  Calendar, 
  Package,
  User, 
  Phone, 
  Mail, 
  Home, 
  Building2, 
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Send,
  Banknote
} from 'lucide-react';
import { ComboboxForm } from './ComboBox';
import { CalendarForm } from './Calendar';

export default function EnhancedCargoForm() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState<'book' | 'prefinance' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    // Shipping Details
    fromLocation: '',
    toLocation: '',
    date: null as Date | null,
    cargoWeight: '',
    productDescription: '',
    locationDescription: '',
    
    // Sender Details
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    senderIdNumber: '',
    
    // Receiver Details
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',
    receiverCity: '',
    receiverIdNumber: ''
  });

  const steps = [
    { 
      id: 1, 
      title: 'Shipping Details', 
      description: 'Route and cargo information',
      icon: Package 
    },
    { 
      id: 2, 
      title: 'Sender Information', 
      description: 'Sender contact details',
      icon: User 
    },
    { 
      id: 3, 
      title: 'Receiver Information', 
      description: 'Receiver contact details',
      icon: User 
    }
  ];

  const handleFromLocationSelect = (location: string) => {
    setFormData(prev => ({ ...prev, fromLocation: location }));
    if (errors.length > 0) setErrors([]);
  };

  const handleToLocationSelect = (location: string) => {
    setFormData(prev => ({ ...prev, toLocation: location }));
    if (errors.length > 0) setErrors([]);
  };

  const handleDateChange = (selectedDate: Date | null) => {
    setFormData(prev => ({ ...prev, date: selectedDate }));
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.fromLocation) newErrors.push("From location is required");
    if (!formData.toLocation) newErrors.push("To location is required");
    if (!formData.productDescription) newErrors.push("Product description is required");
    return newErrors;
  };

  const validateStep = (step: number) => {
    const newErrors: string[] = [];
    
    if (step === 1) {
      if (!formData.fromLocation.trim()) newErrors.push("Origin location is required");
      if (!formData.toLocation.trim()) newErrors.push("Destination location is required");
      if (!formData.productDescription.trim()) newErrors.push("Product description is required");
      if (formData.fromLocation === formData.toLocation) newErrors.push("Origin and destination must be different");
    } else if (step === 2) {
      if (!formData.senderName.trim()) newErrors.push("Sender name is required");
      if (!formData.senderPhone.trim()) newErrors.push("Sender phone is required");
      if (!formData.senderAddress.trim()) newErrors.push("Sender address is required");
      if (!formData.senderCity.trim()) newErrors.push("Sender city is required");
      
      if (formData.senderPhone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.senderPhone)) {
        newErrors.push("Please enter a valid phone number");
      }
      
      if (formData.senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
        newErrors.push("Please enter a valid email address");
      }
    } else if (step === 3) {
      if (!formData.receiverName.trim()) newErrors.push("Receiver name is required");
      if (!formData.receiverPhone.trim()) newErrors.push("Receiver phone is required");
      if (!formData.receiverAddress.trim()) newErrors.push("Receiver address is required");
      if (!formData.receiverCity.trim()) newErrors.push("Receiver city is required");
      
      if (formData.receiverPhone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.receiverPhone)) {
        newErrors.push("Please enter a valid receiver phone number");
      }
      
      if (formData.receiverEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receiverEmail)) {
        newErrors.push("Please enter a valid receiver email address");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors([]);
  };

  const handleSubmit = async (type: 'book' | 'prefinance') => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    setSubmissionType(type);

    try {
      // Use the original API call logic
      const response = await fetch('/api/POST/postCargo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date ? formData.date.toISOString() : undefined,
          agroPrefinancing: type === 'prefinance'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit cargo form');
      }

      const result = await response.json();
      setIsDialogOpen(true);
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      setErrors([error instanceof Error ? error.message : 'An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fromLocation: '',
      toLocation: '',
      date: null,
      cargoWeight: '',
      productDescription: '',
      locationDescription: '',
      senderName: '',
      senderPhone: '',
      senderEmail: '',
      senderAddress: '',
      senderCity: '',
      senderIdNumber: '',
      receiverName: '',
      receiverPhone: '',
      receiverEmail: '',
      receiverAddress: '',
      receiverCity: '',
      receiverIdNumber: ''
    });
    setCurrentStep(1);
    setErrors([]);
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Location - Using original styling */}
              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  From <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Circle className="text-black dark:text-white text-xl mr-2" />
                  <div className="w-full">
                    <ComboboxForm
                      onLocationSelect={handleFromLocationSelect}
                      disabledOptions={[formData.toLocation]}
                      locationType="FROM"
                    />
                  </div>
                </div>
              </div>

              {/* To Location - Using original styling */}
              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  To <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <MapPin className="text-black dark:text-white text-xl mr-2" />
                  <div className="w-full">
                    <ComboboxForm
                      onLocationSelect={handleToLocationSelect}
                      disabledOptions={[formData.fromLocation]}
                      locationType="TO"
                    />
                  </div>
                </div>
              </div>

              {/* Date - Using original styling */}
              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Date
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Calendar className="text-black dark:text-white text-xl mr-2" />
                  <CalendarForm onDateChange={handleDateChange} />
                </div>
              </div>

              {/* Weight - Using original styling */}
              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Weight of goods (Optional)
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Scale className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    type="number"
                    value={formData.cargoWeight}
                    onChange={(e) => updateFormData('cargoWeight', e.target.value)}
                    placeholder="1500 kg"
                    className="border-none h-4 outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Product Description - Using original styling */}
            <div className="flex flex-col">
              <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Product Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.productDescription}
                onChange={(e) => updateFormData('productDescription', e.target.value)}
                className="w-full h-24 border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
                placeholder="Enter product details here"
              />
            </div>

            {/* Location Description - Using original styling */}
            <div className="flex flex-col">
              <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Location Description
              </Label>
              <Textarea
                value={formData.locationDescription}
                onChange={(e) => updateFormData('locationDescription', e.target.value)}
                className="w-full h-24 border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
                placeholder="Enter location details here"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <User className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    placeholder="Enter full name"
                    value={formData.senderName}
                    onChange={(e) => updateFormData('senderName', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Phone className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    type="tel"
                    placeholder="+233 24 123 4567"
                    value={formData.senderPhone}
                    onChange={(e) => updateFormData('senderPhone', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Email Address
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Mail className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.senderEmail}
                    onChange={(e) => updateFormData('senderEmail', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  City <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Building2 className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    placeholder="Enter city"
                    value={formData.senderCity}
                    onChange={(e) => updateFormData('senderCity', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col md:col-span-2">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  ID Number (Optional)
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <CreditCard className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    placeholder="National ID or Passport number"
                    value={formData.senderIdNumber}
                    onChange={(e) => updateFormData('senderIdNumber', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Full Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Enter complete address..."
                value={formData.senderAddress}
                onChange={(e) => updateFormData('senderAddress', e.target.value)}
                className="w-full h-20 border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <User className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    placeholder="Enter full name"
                    value={formData.receiverName}
                    onChange={(e) => updateFormData('receiverName', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Phone className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    type="tel"
                    placeholder="+233 20 987 6543"
                    value={formData.receiverPhone}
                    onChange={(e) => updateFormData('receiverPhone', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  Email Address
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Mail className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.receiverEmail}
                    onChange={(e) => updateFormData('receiverEmail', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  City <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <Building2 className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    placeholder="Enter city"
                    value={formData.receiverCity}
                    onChange={(e) => updateFormData('receiverCity', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col md:col-span-2">
                <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                  ID Number (Optional)
                </Label>
                <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
                  <CreditCard className="text-black dark:text-white text-xl mr-2" />
                  <Input
                    placeholder="National ID or Passport number"
                    value={formData.receiverIdNumber}
                    onChange={(e) => updateFormData('receiverIdNumber', e.target.value)}
                    className="border-none outline-none bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Full Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Enter complete address..."
                value={formData.receiverAddress}
                onChange={(e) => updateFormData('receiverAddress', e.target.value)}
                className="w-full h-20 border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Cargo Shipping Form
          </h1>
          <p className="text-gray-600">
            Complete the form below to book your cargo shipment
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-t-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-white">
                    {steps[currentStep - 1].title}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {steps[currentStep - 1].description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm bg-white text-blue-600">
                  Step {currentStep} of {steps.length}
                </Badge>
              </div>
              
              <Progress value={progressPercentage} className="h-2 bg-blue-200" />
              
              {/* Step Indicators */}
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isActive = currentStep === step.id;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center mb-2
                        ${isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isActive 
                            ? 'bg-white text-blue-600' 
                            : 'bg-blue-300 text-blue-600'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className={`text-xs text-center max-w-20
                        ${isActive ? 'text-white font-medium' : 'text-blue-100'}
                      `}>
                        {step.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Error Display */}
            {errors.length > 0 && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Form Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            <Separator className="my-6" />

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 border-orange-400 text-orange-600 hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleSubmit('prefinance')}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                  >
                    <Banknote className="h-4 w-4" />
                    {isSubmitting && submissionType === 'prefinance' 
                      ? 'Applying...' 
                      : 'Apply for Financing'
                    }
                  </Button>
                  <Button
                    onClick={() => handleSubmit('book')}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting && submissionType === 'book' 
                      ? 'Submitting...' 
                      : 'Submit Booking'
                    }
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                {submissionType === 'prefinance' 
                  ? 'Financing Application Received!' 
                  : 'Booking Submitted Successfully!'
                }
              </AlertDialogTitle>
              <AlertDialogDescription>
                We have received your {submissionType === 'prefinance' 
                  ? 'agro-prefinancing application' 
                  : 'cargo booking request'}. Our team will review your submission and contact you within 24 hours.
                <br /><br />
                You will receive a confirmation email shortly with your reference number.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}