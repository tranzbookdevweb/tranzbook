import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface WhycardsProps {
  activeButton: "bus" | "truck"
}

function Whycards({ activeButton }: WhycardsProps) {
  const bookingSteps = [
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
      icon: <img src="/passenger.png" alt="Passenger details icon" className="w-16 h-16 -mt-12 mx-auto" />,
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

  return (
    <div className="w-full max-w-6xl pt-10 mx-auto px-4">
      {activeButton === "bus" && (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl overflow-hidden mb-16">
            <div className="flex flex-col lg:flex-row items-center min-h-[300px] lg:min-h-[400px]">
              {/* Left Content */}
              <div className="flex-1 p-8 md:p-12 z-10 relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Give us a shot</h2>
                <p className="text-white/90 text-lg mb-6 max-w-md">
                  Join over 2000+ travelers journeying across Ghana and beyond with unmatched ease and comfort every
                  day.
                </p>
                <Button
                  asChild
                  className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </div>

              {/* Right Image - Hidden on mobile and tablet, visible on large screens */}
              <div className="hidden lg:flex flex-1 relative h-80 lg:h-96">
                <img
                  src="/woman-looking.jpg"
                  alt="Person looking through window"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Mobile Background Image (Optional - for subtle background on mobile) */}
              <div className="lg:hidden absolute inset-0 opacity-10">
                <img src="/woman-looking.jpg" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Booking Steps Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Book Your Bus Ticket in Just 4 Easy Steps
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our simple and secure booking process makes it easy to reserve your seat in minutes
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {bookingSteps.map((step, index) => (
              <Card
                key={index}
                className="border-0 bg-[#F9FAFB] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

                  {/* Subtle background decoration */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-orange-100 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeButton === "truck" && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Truck Booking Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              We&apos;re working on bringing you the best truck booking experience. Stay tuned for updates!
            </p>
            <Button variant="outline" className="px-6 py-2 bg-transparent">
              Notify Me When Ready
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Whycards
