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

    {/* Vision & Mission Section with World Map Image */}
<div className="bg-blue-600 text-white py-10 px-4 md:p-12 lg:p-20">
  <div className="container mx-auto">
    <div className="flex flex-col lg:flex-row items-center">
      {/* Text content */}
      <div className="lg:w-1/2  p-6 rounded-lg mb-8 lg:mb-0">
        {/* Vision */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Vision</h2>
          <p className="text-base md:text-lg">
            To be Africa&apos;s preferred transportation and logistics platform, 
            fostering a connected, inclusive, and sustainable community
            of travelers, shippers, and carriers.
          </p>
        </div>
        
        {/* Mission */}
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Mission</h2>
          <p className="text-base md:text-lg">
            To be the leading digital platform for seamless bus ticketing
            and cargo booking across Africa, prioritizing convenience,
            safety, and sustainable practices while expanding our reach
            and promoting customer-centered innovation.
          </p>
        </div>
      </div>
      
      {/* World Map Image - flexed beside the text */}
      <div className="lg:w-1/2 lg:pl-8">
        <img 
          src="/map.png" 
          alt="World map with connection points" 
          className="w-full"
        />
      </div>
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
              TranzBook Technologies is a transportation and logistics technology solution that enables travelers and goods owners to book bus tickets and cargo vehicles for their goods through web and mobile applications.
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
        
{/* Our Core Values Section */}
<div className="py-8 md:py-12 container mx-auto">
  <div className="px-2 sm:px-4 md:px-6 lg:px-16">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-black">OUR CORE VALUE</h2>
      <div className="text-amber-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
    
    <div className="h-1 w-full bg-amber-500 mb-8"></div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column for values - takes 2 columns on large screens */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Safety & Security */}
          <div className="bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-400 w-8 h-8 rounded flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Safety & Security</h3>
            <p className="text-sm text-gray-700">
              Secure payments, verified transport, and real-time tracking for peace of mind.
            </p>
          </div>
          
          {/* Comfort */}
          <div className="bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-400 w-8 h-8 rounded flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Comfort</h3>
            <p className="text-sm text-gray-700">
              A smooth booking experience with seat selection and real-time updates.
            </p>
          </div>
          
          {/* Integrity */}
          <div className="bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-400 w-8 h-8 rounded flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Integrity</h3>
            <p className="text-sm text-gray-700">
              Transparent pricing and reliable service you can trust.
            </p>
          </div>
          
          {/* Respect */}
          <div className="bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-400 w-8 h-8 rounded flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="font-bold mb-2">Respect</h3>
            <p className="text-sm text-gray-700">
              Valuing every traveler, shipper, and partner in our ecosystem.
            </p>
          </div>
        </div>
      </div>
      
      {/* Right column for image - takes 1 column on large screens */}
      <div className="lg:col-span-1">
        <img 
          src="/arch.jpeg" 
          alt="Ghana station building with flags" 
          className="rounded-[1pc] shadow-md w-full h-full object-cover" 
        />
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default AboutUs;