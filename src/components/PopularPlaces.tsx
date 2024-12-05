import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function PopularPlace() {
  const locations = [
    {
      image: '/Regions/EasternRegion.png',
      title: "Nairobi",
      subtitle: "Kenya",
    },
    {
      image: '/Regions/CapeCoast.png',
      title: "Kisumu",
      subtitle: "Kenya",
    },
    {
      image: '/Regions/Kumasi.png',
      title: "Kitale",
      subtitle: "Kenya",
    },
    {
      image: '/Regions/NorthernRegion.png',
      title: "Bungoma",
      subtitle: "Kenya",
    },
    {
      image: '/Regions/VoltaRegion.png',
      title: "Kampala",
      subtitle: "Uganda",
    },
    {
      image: '/Regions/AccraRegion.png',
      title: "Mombasa",
      subtitle: "Kenya",
    },
  ];

  return (
    <div className="flex flex-col items-center px-5 py-10 bg-gray-50">
      {/* Title Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Top Destinations</h1>
      <p className="text-lg text-gray-600 mb-8">
        These destinations are popular among travelers like you
      </p>

      {/* Grid Section */}
      <div className="grid px-10  grid-cols-1 md:grid-cols-3 gap-6 w-full ">
        {locations.map((location, index) => (
          <div
            key={index}
            className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            {/* Background Image */}
            <Image
              src={location.image}
              alt={location.title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-110 transform transition-transform duration-300"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
              <h2 className="text-white text-xl font-bold flex items-center">
                {location.title}
                {/* Arrow */}
                <span className="ml-2 text-[#48A0FF] group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </h2>
              <p className="text-white text-sm">{location.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
