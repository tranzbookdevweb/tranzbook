import { Calendar, Search, Users, Bell } from "lucide-react"

export default function CheapTicketsTips() {
  const tips = [
    {
      id: 1,
      title: "Book in Advance",
      description:
        "Early bookings typically offer the best discounts. Planning ahead can help you secure the lowest prices.",
      icon: Calendar,
    },
    {
      id: 2,
      title: "Search and Compare Prices",
      description:
        "Use the search function to browse available buses, compare their prices and choose the best deal for your journey.",
      icon: Search,
    },
    {
      id: 3,
      title: "Refer Friends and Get Discounts",
      description: "Invite friends to TravelBook and earn discounts on your next purchase when they book a ticket.",
      icon: Users,
    },
    {
      id: 4,
      title: "Sign Up for Alerts",
      description:
        "Subscribe to TravelBook's notifications for price drops and special deals so you never miss out on discounts.",
      icon: Bell,
    },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How to Get Cheap Tickets</h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Smart tips to save money and travel for less.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="flex items-start space-x-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Icon Container */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <tip.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{tip.title}</h3>
                <p className="text-blue-100 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
