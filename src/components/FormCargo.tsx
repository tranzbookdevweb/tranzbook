"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRightLeft, Calendar, MapPin, Search, Package, ChevronDown, ChevronUp, Circle, User, Phone, Mail, Building2, CheckCircle2, ArrowLeft, ArrowRight, Send, Banknote, Truck, Clock, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ComboboxForm } from "./ComboBox"
import { CalendarForm } from "./Calendar"

export default function Cargo() {
  // Search form states
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [weight, setWeight] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // View management
  const [currentView, setCurrentView] = useState<'search' | 'booking' | 'success'>('search')
  const [currentStep, setCurrentStep] = useState(1)
  const [submissionType, setSubmissionType] = useState<'book' | 'prefinance' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Booking form data
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    date: null as Date | null,
    cargoWeight: '',
    productDescription: '',
    locationDescription: '',
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    senderAddress: '',
    senderCity: '',
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',
    receiverCity: '',
  })

  const { toast } = useToast()
  const router = useRouter()

  const steps = [
    { 
      id: 1, 
      title: 'Booking Details', 
      description: 'Enter pickup and drop-off locations, cargo weight, and date of transport.',
      icon: Truck,
      fields: ['fromLocation', 'toLocation', 'productDescription']
    },
    { 
      id: 2, 
      title: 'Sender Information', 
      description: 'Provide your company name and contact details for dispatch.',
      icon: User,
      fields: ['senderName', 'senderPhone', 'senderAddress', 'senderCity']
    },
    { 
      id: 3, 
      title: 'Receiver Information', 
      description: 'Add receiver\'s name and location to complete the delivery info.',
      icon: User,
      fields: ['receiverName', 'receiverPhone', 'receiverAddress', 'receiverCity']
    }
  ]

  // Search form handlers
  const handleFromLocationSelect = (location: string) => {
    setFromLocation(location)
    if (location === toLocation) {
      setToLocation("")
    }
  }

  const handleToLocationSelect = (location: string) => {
    setToLocation(location)
    if (location === fromLocation) {
      setFromLocation("")
    }
  }

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate)
  }

  const handleSwapLocations = () => {
    const temp = fromLocation
    setFromLocation(toLocation)
    setToLocation(temp)
  }

  const handleWeightChange = (increment: boolean) => {
    if (increment && weight < 1000) {
      setWeight(weight + 1)
    } else if (!increment && weight > 1) {
      setWeight(weight - 1)
    }
  }

  const validateSearchForm = () => {
    if (!fromLocation) {
      toast({
        title: "Missing departure location",
        description: "Please select a departure location",
        variant: "destructive",
      })
      return false
    }

    if (!toLocation) {
      toast({
        title: "Missing destination",
        description: "Please select a destination",
        variant: "destructive",
      })
      return false
    }

    if (!date) {
      toast({
        title: "Missing departure date",
        description: "Please select a departure date",
        variant: "destructive",
      })
      return false
    }

    if (weight <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight",
        variant: "destructive",
        action: (
          <ToastAction altText="Set to 1kg" onClick={() => setWeight(1)}>
            Set to 1kg
          </ToastAction>
        ),
      })
      return false
    }

    return true
  }

  const handleProceedToBooking = () => {
    if (!validateSearchForm()) return

    setIsLoading(true)
    
    // Transfer search data to booking form
    setFormData(prev => ({
      ...prev,
      fromLocation,
      toLocation,
      date,
      cargoWeight: weight.toString()
    }))

    setTimeout(() => {
      setCurrentView('booking')
      setCurrentStep(1)
      setErrors([])
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  }

  // Booking form handlers
  const handleBookingFromLocationSelect = (location: string) => {
    setFormData(prev => ({ ...prev, fromLocation: location }))
    clearErrors()
  }

  const handleBookingToLocationSelect = (location: string) => {
    setFormData(prev => ({ ...prev, toLocation: location }))
    clearErrors()
  }

  const handleBookingDateChange = (selectedDate: Date | null) => {
    setFormData(prev => ({ ...prev, date: selectedDate }))
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    clearErrors()
  }

  const clearErrors = () => {
    if (errors.length > 0) setErrors([])
  }

  const validateStep = (step: number) => {
    const newErrors: string[] = []
    
    switch (step) {
      case 1:
        if (!formData.fromLocation.trim()) newErrors.push("Origin location is required")
        if (!formData.toLocation.trim()) newErrors.push("Destination location is required")
        if (!formData.productDescription.trim()) newErrors.push("Product description is required")
        if (formData.fromLocation === formData.toLocation) newErrors.push("Origin and destination must be different")
        break
        
      case 2:
        if (!formData.senderName.trim()) newErrors.push("Sender name is required")
        if (!formData.senderPhone.trim()) newErrors.push("Sender phone is required")
        if (!formData.senderAddress.trim()) newErrors.push("Sender address is required")
        if (!formData.senderCity.trim()) newErrors.push("Sender city is required")
        
        if (formData.senderPhone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.senderPhone)) {
          newErrors.push("Please enter a valid phone number")
        }
        
        if (formData.senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
          newErrors.push("Please enter a valid email address")
        }
        break
        
      case 3:
        if (!formData.receiverName.trim()) newErrors.push("Receiver name is required")
        if (!formData.receiverPhone.trim()) newErrors.push("Receiver phone is required")
        if (!formData.receiverAddress.trim()) newErrors.push("Receiver address is required")
        if (!formData.receiverCity.trim()) newErrors.push("Receiver city is required")
        
        if (formData.receiverPhone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.receiverPhone)) {
          newErrors.push("Please enter a valid receiver phone number")
        }
        
        if (formData.receiverEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.receiverEmail)) {
          newErrors.push("Please enter a valid receiver email address")
        }
        break
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setErrors([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToSearch = () => {
    setCurrentView('search')
    setCurrentStep(1)
    setErrors([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (type: 'book' | 'prefinance') => {
    if (!validateStep(3)) return
    
    setIsSubmitting(true)
    setSubmissionType(type)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
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
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit cargo form')
      }

      setCurrentView('success')
      resetForm()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Submission error:', error)
      setErrors([error instanceof Error ? error.message : 'An unexpected error occurred'])
    } finally {
      setIsSubmitting(false)
    }
  }

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
      receiverName: '',
      receiverPhone: '',
      receiverEmail: '',
      receiverAddress: '',
      receiverCity: '',
    })
    setCurrentStep(1)
    setErrors([])
  }

  const handleNewBooking = () => {
    setCurrentView('search')
    setFromLocation('')
    setToLocation('')
    setDate(null)
    setWeight(1)
    resetForm()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isSearchFormValid = fromLocation && toLocation && date && weight > 0
  const progressPercentage = (currentStep / steps.length) * 100

  // Simplified Step Indicator for Booking View
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1 relative">
          {/* Step Circle */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300
            ${currentStep > step.id 
              ? 'bg-blue-500 text-white' 
              : currentStep === step.id 
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-400'
            }
          `}>
            {currentStep > step.id ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </div>
          
          {/* Step Content */}
          <div className="text-center max-w-xs">
            <h3 className={`font-semibold text-sm mb-1 ${
              currentStep === step.id ? 'text-blue-500' : 'text-gray-600'
            }`}>
              {step.title}
            </h3>
            <p className="text-xs text-gray-500 leading-tight">
              {step.description}
            </p>
          </div>

          {/* Connection Line */}
          {index < steps.length - 1 && (
            <div className={`
              absolute top-6 left-1/2 w-full h-0.5 -z-10 transition-all duration-300
              ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-200'}
            `} 
            style={{ 
              marginLeft: '1.5rem', 
              width: 'calc(100% - 3rem)' 
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // Form step content renderer with simplified UI
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* From and To Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Circle className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <div className="w-full">
                    <ComboboxForm
                      onLocationSelect={handleBookingFromLocationSelect}
                      disabledOptions={[formData.toLocation]}
                      locationType="Select Origin"
                      value={formData.fromLocation}
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <MapPin className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <div className="w-full">
                    <ComboboxForm
                      onLocationSelect={handleBookingToLocationSelect}
                      disabledOptions={[formData.fromLocation]}
                      locationType="Select Destination"
                      value={formData.toLocation}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Weight Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Calendar className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <CalendarForm onDateChange={handleBookingDateChange} />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Package className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <input
                    type="number"
                    value={formData.cargoWeight}
                    onChange={(e) => updateFormData('cargoWeight', e.target.value)}
                    placeholder="Weight (kg) - Optional"
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="relative">
              <div className="flex items-start border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <Package className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                <textarea
                  value={formData.productDescription}
                  onChange={(e) => updateFormData('productDescription', e.target.value)}
                  placeholder="Product Description *"
                  rows={3}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Location Description */}
            <div className="relative">
              <div className="flex items-start border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <MapPin className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                <textarea
                  value={formData.locationDescription}
                  onChange={(e) => updateFormData('locationDescription', e.target.value)}
                  placeholder="Additional Location Details (Optional)"
                  rows={2}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <User className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Full Name: Kofi Doe"
                  value={formData.senderName}
                  onChange={(e) => updateFormData('senderName', e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <Mail className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email: example@gmail.com"
                  value={formData.senderEmail}
                  onChange={(e) => updateFormData('senderEmail', e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Phone and City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Phone className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="Phone: +233 253 235 641"
                    value={formData.senderPhone}
                    onChange={(e) => updateFormData('senderPhone', e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Building2 className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="City: Accra"
                    value={formData.senderCity}
                    onChange={(e) => updateFormData('senderCity', e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Full Address */}
            <div className="relative">
              <div className="flex items-start border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <MapPin className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                <textarea
                  placeholder="Full Address"
                  value={formData.senderAddress}
                  onChange={(e) => updateFormData('senderAddress', e.target.value)}
                  rows={3}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <User className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Full Name: Jane Smith"
                  value={formData.receiverName}
                  onChange={(e) => updateFormData('receiverName', e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <Mail className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email: receiver@gmail.com"
                  value={formData.receiverEmail}
                  onChange={(e) => updateFormData('receiverEmail', e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Phone and City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Phone className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <input
                    type="tel"
                    placeholder="Phone: +233 244 123 456"
                    value={formData.receiverPhone}
                    onChange={(e) => updateFormData('receiverPhone', e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                  <Building2 className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="City: Kumasi"
                    value={formData.receiverCity}
                    onChange={(e) => updateFormData('receiverCity', e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Full Address */}
            <div className="relative">
              <div className="flex items-start border-2 border-blue-200 rounded-2xl px-4 py-4 bg-white focus-within:border-blue-400 transition-colors">
                <MapPin className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-1" />
                <textarea
                  placeholder="Full Address"
                  value={formData.receiverAddress}
                  onChange={(e) => updateFormData('receiverAddress', e.target.value)}
                  rows={3}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Success View (keeping original)
  if (currentView === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="shadow-2xl border-0 overflow-hidden">
            {/* Success Header */}
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mb-4">
                {submissionType === 'prefinance' 
                  ? 'Financing Application Received!' 
                  : 'Booking Submitted Successfully!'
                }
              </CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Your request is being processed by our team
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">What happens next?</h3>
                  <p className="text-green-700">
                    We have received your {submissionType === 'prefinance' 
                      ? 'agro-prefinancing application' 
                      : 'cargo booking request'}. Our team will review your submission and contact you within 24 hours.
                  </p>
                </div>

                {/* Reference Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">Confirmation Details</span>
                  </div>
                  <p className="text-blue-700">
                    You will receive a confirmation email shortly with your reference number and tracking details.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleNewBooking}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-base flex-1"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Book Another Shipment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 text-base flex-1"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Booking Form View with Simplified UI
  if (currentView === 'booking') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBackToSearch}
            className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>

          {/* Step Indicator */}
          {renderStepIndicator()}
          
          {/* Form Container */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {/* Error Display */}
            {errors.length > 0 && (
              <Alert variant="destructive" className="mb-8 border-red-200 bg-red-50">
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Form Content */}
            <div className="mb-10">
              {renderStepContent()}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`
                  flex items-center px-8 py-3 rounded-2xl font-medium transition-all duration-200
                  ${currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-100 text-orange-500 hover:bg-yellow-200 border-2 border-yellow-300'
                  }
                `}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  onClick={handleNext}
                  className="flex items-center px-10 py-3 rounded-2xl font-medium transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleSubmit('prefinance')}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-[12px] bg-green-500 text-white  hover:bg-green-100 border-green-200 px-6 py-3 text-base"
                  >
                    <Banknote className="h-5 w-5" />
                    {isSubmitting && submissionType === 'prefinance' 
                      ? 'Processing...' 
                      : 'Apply for Financing'
                    }
                  </Button>
                  <Button
                    onClick={() => handleSubmit('book')}
                    disabled={isSubmitting}
                    className="flex items-center rounded-[12px] text-white gap-2 px-8 py-3 text-base bg-blue-500 hover:bg-blue-600"
                  >
                    {isSubmitting && submissionType === 'book' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Submit Booking
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default Search View (keeping original)
  return (
    <div className="w-full max-w-7xl mx-auto p-4">

      <form className="bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Desktop Layout - Hidden on tablet and mobile */}
        <div className="hidden lg:flex">
          {/* Form Fields Container */}
          <div className="flex items-center gap-2 p-6 flex-1">
            {/* From Location */}
            <div className="flex items-center gap-3 w-52">
              <Circle className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleFromLocationSelect}
                  disabledOptions={[toLocation]}
                  locationType="Select Origin"
                  value={fromLocation}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-200 flex-shrink-0 mx-2 hover:shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* To Location */}
            <div className="flex items-center gap-3 w-52">
              <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleToLocationSelect}
                  disabledOptions={[fromLocation]}
                  locationType="Select Destination"
                  value={toLocation}
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="flex items-center gap-3 w-52">
              <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm onDateChange={handleDateChange} calendarType="departure" />
              </div>
            </div>

            {/* Weight */}
            <div className="flex items-center gap-3 w-28">
              <Package className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium min-w-[2.5rem] text-center text-sm">{weight}kg</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleWeightChange(true)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={weight >= 1000}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWeightChange(false)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={weight <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button Container */}
          <div className="flex items-stretch">
            <button
              type="button"
              onClick={handleProceedToBooking}
              disabled={!isSearchFormValid || isLoading}
              className={`flex items-center gap-3 px-8 rounded-2xl text-white font-semibold transition-all duration-300 h-full text-base ${
                isSearchFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Book Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tablet Layout - Hidden on desktop and mobile */}
        <div className="hidden md:block lg:hidden p-6 space-y-6">
          {/* First Row: From Location and To Location */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Circle className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleFromLocationSelect}
                  disabledOptions={[toLocation]}
                  locationType="Select Origin"
                  value={fromLocation}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-200 flex-shrink-0 hover:shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleToLocationSelect}
                  disabledOptions={[fromLocation]}
                  locationType="Select Destination"
                  value={toLocation}
                />
              </div>
            </div>
          </div>

          {/* Second Row: Date, Weight, and Book */}
          <div className="flex items-center gap-4">
            {/* Departure Date */}
            <div className="flex items-center gap-3 flex-1">
              <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm onDateChange={handleDateChange} calendarType="departure" />
              </div>
            </div>

            {/* Weight */}
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium min-w-[2.5rem] text-center text-sm">{weight}kg</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleWeightChange(true)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={weight >= 1000}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWeightChange(false)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={weight <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <button
              type="button"
              onClick={handleProceedToBooking}
              disabled={!isSearchFormValid || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-300 text-base ${
                isSearchFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Book Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Layout - Hidden on tablet and desktop */}
        <div className="block md:hidden p-6 space-y-6">
          {/* First Row: From Location */}
          <div className="flex items-center gap-3">
            <Circle className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div className="flex-1">
              <ComboboxForm
                onLocationSelect={handleFromLocationSelect}
                disabledOptions={[toLocation]}
                locationType="Select Origin"
                value={fromLocation}
              />
            </div>
            {/* Swap Button on mobile - positioned to the right */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-200 flex-shrink-0 hover:shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Second Row: To Location */}
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div className="flex-1">
              <ComboboxForm
                onLocationSelect={handleToLocationSelect}
                disabledOptions={[fromLocation]}
                locationType="Select Destination"
                value={toLocation}
              />
            </div>
          </div>

          {/* Third Row: Departure Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-500 flex-shrink-0" />
            <div className="flex-1">
              <CalendarForm onDateChange={handleDateChange} calendarType="departure" />
            </div>
          </div>

          {/* Fourth Row: Weight and Book */}
          <div className="flex items-center gap-4">
            {/* Weight */}
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-orange-500 flex-shrink-0" />
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium min-w-[2.5rem] text-center text-sm">{weight}kg</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleWeightChange(true)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={weight >= 1000}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWeightChange(false)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={weight <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Book Button - takes remaining space */}
            <button
              type="button"
              onClick={handleProceedToBooking}
              disabled={!isSearchFormValid || isLoading}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-300 flex-1 text-base ${
                isSearchFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Book Now
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}