import SearchIcon from "@mui/icons-material/Search";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PaymentIcon from "@mui/icons-material/Payment";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CompareIcon from "@mui/icons-material/Compare";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import React from 'react'

interface CardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
  }
  
  const Card: React.FC<CardProps> = ({ title, description, icon }) => (
    <div className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-start">
      <div className="mb-3">{icon}</div>
      <h5 className="text-xl font-semibold mb-2">{title}</h5>
      <p className="text-gray-600">{description}</p>
    </div>
  );
function Whycards() {
  return (
    <div>
          {/* How to Book Section */}
      <div className="mt-16">
        <h4 className="text-center text-2xl font-semibold mb-6">
          BOOK TICKET IN THREE STEPS:
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Search for Your Route",
              description:
                "Enter your departure and destination locations, select your travel date, and find available buses.",
              icon: <SearchIcon className="text-blue-500" fontSize="large" />,
            },
            {
              title: "Choose Your Bus",
              description:
                "Browse the options, check amenities, prices, and seat availability, then pick the bus that suits you best.",
              icon: <DirectionsBusIcon className="text-green-500" fontSize="large" />,
            },
            {
              title: "Confirm and Pay",
              description:
                "Enter your details, confirm the booking, and securely make your payment. You’ll receive a ticket confirmation instantly!",
              icon: <PaymentIcon className="text-red-500" fontSize="large" />,
            },
          ].map((step, index) => (
            <Card key={index} {...step} />
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h4 className="text-center text-2xl font-semibold mb-6">
          How to Get Cheap Tickets
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[
            {
              title: "Book in Advance",
              description:
                "Early bookings typically offer the best discounts. Planning ahead can help you secure the lowest prices.",
              icon: <BookmarkIcon className="text-purple-500" fontSize="large" />,
            },
            {
              title: "Search and Compare Prices",
              description:
                "Use the search function to browse available buses, compare their prices, and choose the best deal for your journey.",
              icon: <CompareIcon className="text-orange-500" fontSize="large" />,
            },
            {
              title: "Refer Friends and Get Discounts",
              description:
                "Invite friends to TranzBook, and earn discounts on your next purchase when they book a ticket.",
              icon: <PeopleIcon className="text-pink-500" fontSize="large" />,
            },
            {
              title: "Sign Up for Alerts",
              description:
                "Subscribe to TranzBook’s notifications for price drops and special deals so you never miss out on discounts.",
              icon: (
                <NotificationsActiveIcon
                  className="text-yellow-500"
                  fontSize="large"
                />
              ),
            },
          ].map((tip, index) => (
            <Card key={index} {...tip} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Whycards