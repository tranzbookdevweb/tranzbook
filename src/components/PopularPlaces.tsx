import Link from "next/link";
import Image from "next/image";

export function PopularPlace() {
  const locations = [
    {
      image: '/Regions/EasternRegion.png',
      from: "Accra",
      to: "Aburi",
    },
    {
      image: '/Regions/CapeCoast.png',
      from: "Kumasi",
      to: "Cape Coast",
    },
    {
      image: '/Regions/Kumasi.png',
      from: "Accra",
      to: "Kumasi",
    },
    {
      image: '/Regions/NorthernRegion.png',
      from: "Accra",
      to: "Wudu",
    },
    {
      image: '/Regions/VoltaRegion.png',
      from: "Kumasi",
      to: "Ho",
    },
    {
      image: '/Regions/AccraRegion.png',
      from: "Accra",
      to: "Circle",
    },
  ];

  // Calculate the next day's date
  const nextDayDate = new Date();
  nextDayDate.setDate(nextDayDate.getDate() + 1);
  const formattedNextDayDate = nextDayDate.toISOString(); // ISO 8601 format for date

  return (
    <div className="flex flex-col items-center px-5 py-10 bg-gray-50">
      {/* Title Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Top Destinations</h1>
      <p className="text-lg text-gray-600 mb-8">
        These destinations are popular among travelers like you
      </p>

      {/* Grid Section */}
      <div className="grid px-10 grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {locations.map((location, index) => (
          <Link
            key={index}
            href={{
              pathname: "/search",
              query: {
                fromLocation: location.from,
                toLocation: location.to,
                date: formattedNextDayDate,
                returnDate: "",
                ticketQuantity: 0,
              },
            }}
            passHref
          >
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
              {/* Background Image */}
              <Image
                src={location.image}
                alt={location.from}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transform transition-transform duration-300"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
                <h2 className="text-white text-xl font-bold flex items-center">
                  {location.from}
                  <span className="ml-2 text-[#48A0FF] group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </h2>
                <p className="text-white text-sm">{location.to}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
