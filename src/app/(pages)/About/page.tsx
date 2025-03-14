import React from 'react';

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full bg-gray-50">
      
      {/* Hero Section with rounded edges and background image */}
      <div 
        className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-900 -mb-5 z-10 flex items-center justify-center text-white rounded-b-3xl overflow-hidden"
        style={{
          backgroundImage: "url('/womaninbus.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Dark overlay over background image */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
             
        {/* Content */}
        <div className="z-10 text-center px-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">About Us</h1>
          <p className="text-base md:text-lg lg:text-xl px-2">
            Driving innovation in transportation and logistics
            making travel and cargo booking seamless, secure,
            and efficient across Africa.
          </p>
        </div>
      </div>

      {/* Vision & Mission Section with World Map Background */}
      <div className="bg-blue-600 text-white py-10 px-4 md:p-12 lg:p-20 relative overflow-hidden">
        {/* World Map Background */}
        <div className="absolute inset-0 opacity-20">
          {/* This would be replaced with the actual world map with connection dots */}
          <div 
            className="w-full h-full bg-contain bg-no-repeat bg-center md:bg-right"
            style={{
              backgroundImage: "url('/map.png')"
            }}
          ></div>
        </div>
        <div className="container mx-auto relative z-10">
          {/* Vision */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Vision</h2>
            <p className="text-base md:text-lg max-w-lg">
              To be Africa&apos;s preferred transportation and logistics platform, 
              fostering a connected, efficient, and sustainable community
              of travelers, shippers, and carriers.
            </p>
          </div>
          
          {/* Mission */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Mission</h2>
            <p className="text-base md:text-lg max-w-lg">
              To be the leading digital platform for seamless bus ticketing
              and cargo booking across Africa, prioritizing convenience,
              safety, and sustainable practices while expanding our reach
              and promoting customer-centered innovation.
            </p>
          </div>
        </div>
      </div>

      {/* White section with rounded top corners and background pattern */}
      <div 
        className="bg-white rounded-t-3xl px-4 sm:px-6 md:px-10 lg:px-20 -mt-4 relative z-20"
        style={{
          backgroundImage: "url('/subtle-pattern.png')",
          backgroundRepeat: "repeat"
        }}
      >
        {/* Who We Are Section */}
        <div className="py-8 md:py-12 container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-6 md:mb-8 px-2 sm:px-4 md:px-6 lg:px-16">WHO WE ARE!</h2>
          
          <div className="flex flex-col-reverse lg:flex-row gap-6 md:gap-8 px-2 sm:px-4 md:px-6 lg:px-16">
            {/* Left column with text */}
            <div className="flex-1 flex flex-col">
              <p className="text-gray-700 mb-4 md:mb-6">
                TranziBook Technology is a transportation and logistics technology solution that enables travelers and goods owners to book bus tickets and cargo vehicles for their goods through web and mobile applications.
              </p>
              
              <p className="text-gray-700 mb-4 md:mb-6">
                The platform allows travelers to search for available bus routes, view schedules, and book tickets online. They can also choose their preferred seat and pay for their ticket securely through the platform. The solution also provides real-time updates on the status of the bus and estimated arrival times.
              </p>
              
              {/* Image below text on left side */}
              <div className="mt-2 md:mt-4 mb-6">
                <img 
                  src="/womaninbus.jpg" 
                  alt="Happy woman customer" 
                  className="rounded-[1pc] md:rounded-[2pc] shadow-md w-full h-48 sm:h-64 md:h-72 lg:h-full object-cover" 
                />
              </div>
            </div>
            
            {/* Right column with image and more text */}
            <div className="flex-1 flex flex-col">
              {/* Image on top of right side */}
              <div className="mb-4 md:mb-6">
                <img 
                  src="/manwithson.jpg" 
                  alt="Bus driver" 
                  className="rounded-[1pc] md:rounded-[2pc] shadow-md w-full h-48 sm:h-64 md:h-72 lg:h-full object-cover" 
                />
              </div>
              
              {/* Text below image on right side */}
              <p className="text-gray-700 mb-4 md:mb-6">
                For cargo trucks booking, the platform enables businesses and individuals seamlessly book for truck services to move their goods safely and conveniently, and book transportation services for their goods. They can also track the movement of their goods in real-time, receive delivery notifications, and manage their shipments through the platform.
              </p>
              
              <p className="text-gray-700">
                Our solution typically uses advanced logistics management software and GPS tracking technology to optimize routes and improve delivery efficiency. This helps to reduce costs and improve delivery times, while providing a seamless customer experience for both travelers and cargo shippers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;