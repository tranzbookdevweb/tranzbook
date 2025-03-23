import React from 'react';

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full bg-white">
      
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
        <div className="z-10 text-center px-4 max-w-3xl">
          <h1 className="text-3xl w-full md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
          Join Us in Revolutionizing Mobility and Logistics Across Africa.
          </h1>
        </div>
      </div>
  {/* Join The TranzBook Team Section */}
  <div className="py-8 md:py-12 container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-500 mb-6">Join The TranzBook Team!</h2>
        <p className="text-gray-700 max-w-4xl mx-auto">
          Ready to be part of a company reshaping both travel and logistics across West Africa? At TranzBook, we&apos;re on a mission to
          simplify and enhance cross-border transportation and logistics. From booking bus journeys across Ghana, Nigeria, and Côte
          d&apos;Ivoire, to offering seamless logistics solutions for businesses, TranzBook is connecting people and goods across the region
          with ease and reliability.
        </p>
      </div>
 {/* Why Tranzbook Section */}
 <div className="py-8 md:py-12 container bg-[#F5FCFF] rounded-tr-[20pc] rounded-bl-[30pc] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-6 md:mb-8 px-2 sm:px-4 md:px-6 lg:px-16">WHO WE ARE!</h2>
          
          <div className="flex flex-col-reverse  lg:flex-row gap-6 md:gap-8 px-2 sm:px-4 md:px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 px-2 sm:px-4 md:px-6 lg:px-16">
    {/* Left column with features */}
    <div className="flex-1 flex flex-col">
      <div className="mb-6">
        <div className="flex items-start mb-2">
          <span className="text-blue-500 mr-2">✓</span>
          <h3 className="font-bold">Innovative Spirit</h3>
        </div>
        <p className="text-gray-700 ml-6 mb-4">
          At TranzBook, we leverage technology to make transportation and logistics smooth and accessible for everyone. Whether you&apos;re coding a new feature for our booking platform or optimizing logistics operations, you&apos;ll be innovating every day.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-start mb-2">
          <span className="text-blue-500 mr-2">✓</span>
          <h3 className="font-bold">Customer Focus</h3>
        </div>
        <p className="text-gray-700 ml-6 mb-4">
          For us, it&apos;s all about the experience. We&apos;re dedicated to providing a reliable, seamless experience for both passengers and businesses alike.
        </p>
      </div>
              
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
      <div className="mb-6">
        <div className="flex items-start mb-2">
          <span className="text-blue-500 mr-2">✓</span>
          <h3 className="font-bold">Collaborative Culture</h3>
        </div>
        <p className="text-gray-700 ml-6 mb-4">
          Work with a passionate, diverse team where your ideas are valued. Together, we&apos;re building solutions that empower travel and trade across West Africa.
        </p>
      </div>
      
      <div>
        <div className="flex items-start mb-2">
          <span className="text-blue-500 mr-2">✓</span>
          <h3 className="font-bold">Growth-Driven</h3>
        </div>
        <p className="text-gray-700 ml-6">
          Be part of an ambitious team that&apos;s not just solving today&apos;s challenges but paving the way for the future of African transportation and logistics.
        </p>
      </div>
    </div>
            </div>
          </div>
        </div>
      
    {/* What We Offer Section with images on both sides */}
<div className="w-full bg-white py-16">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row">
      {/* Left side image */}
      <div className="hidden lg:block lg:w-1/6">
        <img 
          src="/arch.jpeg" 
          alt="Transportation logistics" 
          className="w-full h-full rounded-r-[2pc] object-cover"
        />
      </div>
      
      {/* Center content */}
      <div className="w-full lg:w-5/6 px-4">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">What We Offer</h2>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6">
          {/* Card 1 - Professional Development */}
          <div className="bg-[#F5FCFF] rounded-[1pc] p-6 shadow-md">
            <div className="bg-blue-400 w-12 h-12 rounded-[1pc] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Professional Development</h3>
            <p className="text-gray-600">
              From in-depth training to career advancement programs, we support your growth every step of the way.
            </p>
          </div>
          
          {/* Card 2 - Flexible Work Options */}
          <div className="bg-[#F5FCFF] rounded-[1pc] p-6 shadow-md">
            <div className="bg-blue-400 w-12 h-12 rounded-[1pc] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Work Options</h3>
            <p className="text-gray-600">
              We offer flexibility in working hours and remote options, so you can bring your best wherever you are.
            </p>
          </div>
          
          {/* Card 3 - Health & Wellness Benefits */}
          <div className="bg-[#F5FCFF] rounded-[1pc] p-6 shadow-md">
            <div className="bg-blue-400 w-12 h-12 rounded-[1pc] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Health & Wellness Benefits</h3>
            <p className="text-gray-600">
              Comprehensive health coverage to keep you in top form.
            </p>
          </div>
          
          {/* Card 4 - Travel and Shipping Discounts */}
          <div className="bg-[#F5FCFF] rounded-[1pc] p-6 shadow-md">
            <div className="bg-blue-400 w-12 h-12 rounded-[1pc] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Travel and Shipping Discounts:</h3>
            <p className="text-gray-600">
              Enjoy exclusive discounts on TranzBook&apos;s travel and logistics services!
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side image */}
      <div className="hidden lg:block lg:w-1/6">
        <img 
          src="/arch.jpeg" 
          alt="Cargo logistics" 
          className="w-full rounded-l-[2pc] h-full object-cover"
        />
      </div>
    </div>
  </div>
</div>
      
      {/* Ready to Start Your Journey Section with rounded top-right corner */}
      <div className="w-full bg-[#FEA603] relative rounded-tr-[32rem] max-lg:rounded-tr-[12pc]">
      <div className="container mx-auto justify-center px-32 max-lg:px-20 py-12 pb-32">
        {/* Title in separate div */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Ready to Start Your Journey?</h2>
        </div>
        
        {/* Grid layout for content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left Content - 3/5 of the grid */}
          <div className="md:col-span-3 text-white z-10">
            {/* Description */}
            <p className="mb-8 max-w-xl">
              For cargo trucks booking, the platform enables businesses and individuals, seamlessly book for truck services to move their goods safely and conveniently, and book transportation services for their goods. They can also track the movement of their goods in real-time, receive delivery notifications, and manage their shipments through the platform.
            </p>
            
            <p className="mb-10 max-w-xl">
              Our solution typically uses advanced logistics management software and GPS tracking technology to optimize routes and improve delivery efficiency. This helps to reduce costs and improve delivery times, while providing a seamless customer experience for both travelers and cargo shippers.
            </p>
            
            {/* Open Roles Section */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Open Roles</h3>
              
              {/* Role 1 */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                    <div className="bg-blue-500 rounded-full w-4 h-4"></div>
                  </div>
                  <h4 className="text-xl font-bold">Customer Support Specialists</h4>
                </div>
                <p className="ml-9">
                  Assisting both travelers and logistics clients with a top-tier support experience.
                </p>
              </div>
              
              {/* Role 2 */}
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                    <div className="bg-blue-500 rounded-full w-4 h-4"></div>
                  </div>
                  <h4 className="text-xl font-bold">Marketing & Brand Managers</h4>
                </div>
                <p className="ml-9">
                  Growing our presence across Africa and building trust with customers.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Image - 2/5 of the grid */}
          <div className="md:col-span-2 flex items-center justify-center z-10">
            <div className="rounded-xl overflow-hidden shadow-lg h-full w-full">
              <img 
                src="/womanout.jpg" 
                alt="Woman using mobile phone"
                className="w-full h-full max-h-[500px] object-cover" 
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