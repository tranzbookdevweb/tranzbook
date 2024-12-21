import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import man from "../../public/pictures/manHomepage.png"; // Ensure the path is correct
import truck from "../../public/pictures/cargotruck.jpg"; // Ensure the path is correct
import Whycards from "./Whycards";

interface WhyProps {
  activeButton: 'Bus' | 'Cargo'; // Accept activeButton as a prop
}

const Why: React.FC<WhyProps> = ({ activeButton }) => {
  return (
    <div className="px-4 py-8 w-full items-center max-w-7xl mx-auto">
      {/* Intro Section */}
      <p className="text-center text-lg md:text-xl text-gray-700 mb-10 px-4">
        {activeButton === 'Bus'
          ? "Your Comfort, Our Priority. Imagine planning your trip without ever leaving your home. With TranzBook, you can find and book the best buses right from your couch, saving yourself the hassle of crowded bus stations. Wherever you’re headed, just pull out your phone or laptop, and let TranzBook bring the journey to you."
          : "Move Your World with TranzBook Cargo! Simplify your logistics with TranzBook Cargo, the ultimate solution for seamless cargo transportation within Ghana and across borders. Whether you're a business owner shipping goods or an individual sending packages, we make it effortless, affordable, and reliable."}
      </p>

      {/* Conditional Rendering based on activeButton */}
      <div className="grid grid-cols-2 max-w-5xl mx-auto max-lg:grid-cols-1 gap-5">
        <div>
          {activeButton === 'Bus' && (
            <>
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
            </>
          )}

          {activeButton === 'Cargo' && (
            <>
              <h4 className="text-2xl font-semibold mb-4">Why Choose TranzBook for Cargo?</h4>
              <div className="space-y-6">
                <FactListItem
                  title="Nationwide Coverage"
                  description="Send your cargo to any corner of Ghana with confidence."
                />
                <FactListItem
                  title="Cross-Border Shipping"
                  description="Expand your reach with reliable cargo services to Nigeria, Togo, Benin, Burkina Faso, Côte d'Ivoire, Mali, and beyond."
                />
                <FactListItem
                  title="Real-Time Tracking"
                  description="Stay connected with your shipment every step of the way."
                />
                <FactListItem
                  title="Speed and Security"
                  description="We prioritize swift delivery and utmost care for your goods."
                />
                <FactListItem
                  title="24/7 Support"
                  description="Our team is ready to assist anytime, ensuring a stress-free experience."
                />
              </div>
            </>
          )}
        </div>

        <motion.div className="flex relative w-full h-full">
          <Image
            quality={100}
            src={activeButton === 'Bus' ? man : truck}
            alt={activeButton === 'Bus' ? "Man with laptop" : "Cargo truck"}
            className="rounded-xl object-fill w-full max-h-[600px] max-lg:max-h-[500px] max-md:max-h-[350px]"
          />
        </motion.div>
      </div>
      <Whycards activeButton={activeButton} />
      </div>
  );
};

const FactListItem: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div>
    <h2 className="text-xl font-semibold flex items-center mb-2">
      <CheckCircleIcon className="text-blue-300 mr-2" />
      {title}
    </h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Why;
