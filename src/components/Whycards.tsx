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

  return (
    <div className="w-full max-w-6xl pt-10 mx-auto px-4">
      {activeButton === "bus" && (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl overflow-hidden mb-16">
            <div className="flex flex-col md:flex-row items-center">
              {/* Left Content */}
              <div className="flex-1 p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Give us a shot</h2>
                <p className="text-white/90 text-lg mb-6 max-w-md">
                  Join over 2000+ travelers journeying across Ghana and beyond with unmatched ease and comfort every
                  day.
                </p>
                <Link href='/sign-up' className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg">
                  Get started
                </Link>
              </div>

              {/* Right Image */}
              <div className="flex-1 relative h-64 md:h-80">
                <img
                  src="/woman-looking.jpg"
                  alt="Person looking through window"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Booking Steps Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Book Your Bus Ticket in Just 4 Easy Steps
            </h3>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {bookingSteps.map((step, index) => (
              <Card key={index} className="border-0 bg-[#F9FAFB] shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeButton === "truck" && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Truck Booking Coming Soon</h3>
          <p className="text-gray-600">We&apos;re working on bringing you the best truck booking experience.</p>
        </div>
      )}
    </div>
  )
}

export default Whycards
