import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import CargoRegistrationDialog from "./CargoRegistration"

interface WhycardsProps {
  activeButton: "bus" | "truck"
}

function Whycards({ activeButton }: WhycardsProps) {
  const [isCargoDialogOpen, setIsCargoDialogOpen] = useState(false)

  const busBookingSteps = [
    {
      icon: <img src="/search.png" alt="Search route icon" className="w-16 h-16 -mt-12 mx-auto" />,
      title: "Search for Your Route",
      description:
        "Enter your departure and destination locations, choose your travel date, and view available buses in seconds.",
    },
    {
      icon: <img src="/seathome.png" alt="Choose bus icon" className="w-16 h-16 -mt-12 mx-auto" />,
      title: "Choose Your Bus & Seat",
      description:
        "Compare bus options based on price, time, and amenities. Select your preferred bus and pick the seat you love.",
    },
    {
      icon: (
        <img src="/passenger.png" alt="Passenger details icon" className="w-16 h-16 -mt-12 mx-auto" />
      ),
      title: "Enter Passenger Details",
      description:
        "Fill in the passenger name, contact info, and an emergency contact. Double-check to ensure everything is correct.",
    },
    {
      icon: <img src="/pay.png" alt="Payment icon" className="w-16 h-16 -mt-12 mx-auto" />,
      title: "Confirm & Pay",
      description:
        "Review your booking, choose a payment method (Mobile Money, card or bank), and complete your booking.",
    },
  ]

  const truckBookingSteps = [
    {
      icon: <img src="/search.png" alt="Search truck icon" className="w-16 h-16 -mt-12 mx-auto" />,
      title: "Enter Booking Details",
      description:
        "Provide pickup and drop-off locations, cargo weight, date, time, and extra notes.",
    },
    {
      icon: <img src="/truck-select.png" alt="Choose truck icon" className="w-16 h-16 -mt-12 mx-auto" />,
      title: " Add Sender Information",
      description:
        "Enter sender's name, phone number, contact person, and address.",
    },
    {
      icon: (
        <img src="/cargo-details.png" alt="Cargo details icon" className="w-16 h-16 -mt-12 mx-auto" />
      ),
      title: "Fill Receiver Details",
      description:
        "Add receiver's name, delivery address, contact number, time, and instructions..",
    },
    {
      icon: <img src="/pay.png" alt="Payment icon" className="w-16 h-16 -mt-12 mx-auto" />,
      title: "Wait for Our Call to Confirm",
      description:
        "We'll call to verify details, confirm availability, answer questions, and book.",
    },
  ]

  const content = activeButton === "bus" ? {
    heroGradient: "from-orange-400 to-yellow-400",
    heroTitle: "Give us a shot",
    heroDescription: "Join over 200+ travelers journeying across Ghana and beyond with unmatched ease and comfort every day.",
    heroButtonText: "Get started",
    heroImage: "/woman-looking.jpg",
    heroImageAlt: "Person looking through window",
    stepsTitle: "Book Your Bus Ticket in Just 4 Easy Steps",
    bookingSteps: busBookingSteps
  } : {
    heroGradient: "from-blue-500 to-blue-700",
    heroTitle: "Own a Truck? Let's Drive Success Together!",
    heroDescription: "Join the TranzBook network and watch your cargo truck stay busy while you relax and enjoy consistent earnings. We connect you with reliable cargo needs, ensuring your truck never sits idle.More business. More smiles. More trips to the bank.Sign up now and start your journey to seamless earnings!",
    heroButtonText: "Get started",
    heroImage: "/woman-looking.jpg",
    heroImageAlt: "Person looking through window",
    stepsTitle: "Book Your Cargo in Just 4 Easy Steps",
    bookingSteps: truckBookingSteps
  }

  const handleGetStartedClick = () => {
    if (activeButton === "truck") {
      setIsCargoDialogOpen(true)
    }
    // For bus, the Link component will handle navigation
  }

  return (
    <div className="w-full max-w-6xl pt-10 mx-auto px-4">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r ${content.heroGradient} rounded-2xl overflow-hidden mb-16`}>
        <div className="flex flex-col lg:flex-row items-center min-h-[300px] lg:min-h-[300px]">
          {/* Left Content */}
          <div className="flex-1 p-8 md:p-12 z-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.heroTitle}</h2>
            <p className="text-white/90 text-lg mb-6 max-w-md">
              {content.heroDescription}
            </p>
            
            {/* Conditional Button Rendering */}
            {activeButton === "bus" ? (
              <Button
                asChild
                className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/sign-up">{content.heroButtonText}</Link>
              </Button>
            ) : (
              <Button
                onClick={handleGetStartedClick}
                className="bg-white text-blue-500 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {content.heroButtonText}
              </Button>
            )}
          </div>

          {/* Right Image - Hidden on mobile and tablet, visible on large screens */}
          <div className="hidden lg:flex flex-1 relative h-80 lg:h-96">
            <img
              src={content.heroImage}
              alt={content.heroImageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Mobile Background Image (Optional - for subtle background on mobile) */}
          <div className="lg:hidden absolute inset-0 opacity-10">
            <img src={content.heroImage} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Booking Steps Section */}
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {content.stepsTitle}
        </h3>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {content.bookingSteps.map((step, index) => (
          <Card key={index} className="border-0 bg-[#F9FAFB] shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h4 className="font-semibold text-lg text-gray-900 mb-3">{step.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cargo Registration Dialog */}
      <CargoRegistrationDialog 
        isOpen={isCargoDialogOpen}
        onOpenChange={setIsCargoDialogOpen}
      />
    </div>
  )
}

export default Whycards