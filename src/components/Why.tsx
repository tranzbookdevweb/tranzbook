import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';
import Image from 'next/image';
import man from '../../public/pictures/manHomepage.png';
import bus from '../../public/pictures/busHomepage.jpeg';

interface WhyProps {
  activeButton: string;
}

const Why: React.FC<WhyProps> = ({ activeButton }) => {
  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">

      <p className="text-center text-lg md:text-xl text-gray-700 mb-10 px-4">
        Your Comfort, Our Priority. Imagine planning your trip without ever leaving your home. 
        With TranzBook, you can find and book the best buses right from your couch, saving yourself 
        the hassle of crowded bus stations. Wherever you're headed, just pull out your phone or laptop, 
        and let TranzBook bring the journey to you.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          <h4 className="text-2xl font-semibold mb-4">Why Choose TranzBook?</h4>
          <div className="space-y-6">
            <FactListItem
              title="Save More, Every Trip"
              description="Travel more, pay less. When you book with TranzBook, you unlock exclusive discounts just for being a loyal traveler. Plus, with our referral rewards, every friend or family member you introduce to TranzBook is another opportunity for you to save. Traveling has never felt this rewarding."
            />
            <FactListItem
              title="Affordable Travel Made Easy"
              description="Your travel budget matters. That’s why we’ve built a platform where you can compare fares from multiple bus providers to find the best deal for your journey. Want to save on your next trip? TranzBook lets you choose the most affordable options, ensuring every journey fits your budget."
            />
            <FactListItem
              title="Safe Journeys, Peace of Mind"
              description="Every TranzBook partner bus is more than just a ride; it’s a safe, secure space for you to relax as you travel. With professional drivers and 24/7 tracking, you can trust that your safety is a top priority. Rest easy as our team watches over you, so you can focus on the road ahead—or just enjoy the view."
            />
          </div>
        </div>

        {/* Right Section */}
        <motion.div className="flex justify-center">
          <Image
            quality={100}
            src={man}
            alt="Man with laptop"
            className="rounded-xl max-w-full h-auto"
          />
        </motion.div>
      </div>

      {/* Ticket Booking Section */}
      <div className="mt-16">
        <h4 className="text-center text-2xl font-semibold mb-4">
          BOOK TICKET IN THREE STEPS:
        </h4>
        <ul className="list-decimal list-inside text-lg text-gray-700 space-y-3 px-6">
          <li>
            <strong>Search for Your Route:</strong> Enter your departure and destination locations, select your travel date, and find available buses.
          </li>
          <li>
            <strong>Choose Your Bus:</strong> Browse the options, check amenities, prices, and seat availability, then pick the bus that suits you best.
          </li>
          <li>
            <strong>Confirm and Pay:</strong> Enter your details, confirm the booking, and securely make your payment. You’ll receive a ticket confirmation instantly!
          </li>
        </ul>
      </div>

      {/* Tips Section */}
      <div className="mt-16">
        <h4 className="text-center text-2xl font-semibold mb-4">
          How to Get Cheap Tickets
        </h4>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-3 px-6">
          <li>
            <strong>Book in Advance:</strong> Early bookings typically offer the best discounts. Planning ahead can help you secure the lowest prices.
          </li>
          <li>
            <strong>Search and Compare Prices:</strong> Use the search function to browse available buses, compare their prices, and choose the best deal for your journey.
          </li>
          <li>
            <strong>Refer Friends and Get Discounts:</strong> Invite friends to TranzBook, and earn discounts on your next purchase when they book a ticket.
          </li>
          <li>
            <strong>Sign Up for Alerts:</strong> Subscribe to TranzBook’s notifications for price drops and special deals so you never miss out on discounts.
          </li>
        </ul>
      </div>
    </div>
  );
};

interface FactListItemProps {
  title: string;
  description: string;
}

const FactListItem: React.FC<FactListItemProps> = ({ title, description }) => (
  <div>
    <h2 className="text-xl font-semibold flex items-center mb-2">
      <CheckCircleIcon className="text-blue-300 mr-2" />
      {title}
    </h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Why;
