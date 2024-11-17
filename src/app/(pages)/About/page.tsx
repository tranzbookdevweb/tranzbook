/* eslint-disable @next/next/no-img-element */
import React from "react";

const AboutUs: React.FC = () => {
  const sections = [
    {
      title: "About TranzBook",
      imageSrc: "/about/transport.png",
      imageAlt: "Transportation and logistics",
      content: `TranzBook Technology is a transportation and logistics solution that enables travelers to book bus tickets and cargo vehicles for their goods through web and mobile applications. Travelers can search for available bus routes, view schedules, choose seats, and securely book tickets, with real-time updates on bus status and arrival times.`,
    },
    {
      title: "Cargo Booking Services",
      imageSrc: "/about/cargo.jpg",
      imageAlt: "Cargo vehicle booking",
      content: `For cargo vehicle booking, the platform enables businesses or individuals to locate nearby vehicles, book transportation for goods, track movements in real-time, receive delivery notifications, and manage shipments effectively.`,
    },
    {
      title: "Technology & Efficiency",
      imageSrc: "/about/technology.gif",
      imageAlt: "Logistics management software",
      content: `Our solution uses advanced logistics management software and GPS tracking to optimize routes, reduce costs, and improve delivery times, providing a seamless experience for both travelers and cargo shippers.`,
    },
  ];

  const visionMission = [
    {
      title: "Vision Statement",
      imageSrc: "/about/vision.webp",
      imageAlt: "Vision of the future",
      content: `To be Africa’s preferred transportation and logistics platform, fostering a connected, inclusive, and sustainable community of travelers, shippers, and carriers.`,
    },
    {
      title: "Mission Statement",
      imageSrc: "/about/mission.jpg",
      imageAlt: "Mission for Africa",
      content: `To be the leading digital platform for seamless bus ticketing and cargo booking across Africa, prioritizing convenience, safety, and sustainable practices while promoting customer-centered innovation.`,
    },
  ];

  const coreValues = [
    {
      name: "Safety & Security",
      description:
        "Ensuring all customers' journeys and cargo are safe.",
      imageSrc: "/about/safety.webp",
    },
    {
      name: "Comfort",
      description:
        "Providing the best experience for every trip and shipment.",
      imageSrc: "/about/comfort.jpg",
    },
    {
      name: "Integrity",
      description:
        "Upholding high ethical standards and transparent practices.",
      imageSrc: "/about/integrity.jpg",
    },
    {
      name: "Respect",
      description: "Fostering an inclusive and respectful community.",
      imageSrc: "/about/respect.jpg",
    },
  ];

  const teamMembers = [
    {
      name: "Andres Berlin",
      role: "CEO",
      description: "Leading TranzBook's growth and vision.",
      imageSrc: "/about/avatar1.png",
    },
    {
      name: "Alice Mbeke",
      role: "CTO",
      description: "Overseeing technology and innovation.",
      imageSrc: "/about/avatar2.png",
    },
    {
      name: "Michael Owusu",
      role: "COO",
      description: "Optimizing operations and customer experience.",
      imageSrc: "/about/avatar3.jpg",
    },
  ];

  return (
    <div className='bg-gray-50 min-h-screen flex'>
      {/* Left Aside - Ad */}
      {/* <aside className='hidden lg:flex lg:w-1/5 bg-white p-4 border-r border-gray-200 lg:justify-center '>
        <div className='flex flex-col p-5 sticky'>
          <div className='space-y-3'>
            <img
              src='/about/ad1.jpg'
              alt='Ad 1'
              className='rounded-xl  p-2 object-cover opacity-60'
            />
            <img
              src='/about/ad2.jpg'
              alt='Ad 2'
              className='rounded-xl  p-2 object-cover opacity-60'
            />
            <div className='bg-green-50 text-center text-green-700 font-semibold p-4 rounded-lg shadow'>
              Advertise with Us
            </div>
          </div>
        </div>
      </aside> */}

      <div className='container px-6 py-12 bg-gray-50'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <div className='relative mb-6'>
            <h1 className='text-4xl font-extrabold text-gray-900 relative z-10'>
              All you need to know about us
            </h1>
            <div className='absolute inset-0 bg-blue-50 rounded-full blur-3xl h-32 w-32 md:h-64 md:w-64 mx-auto -top-8 opacity-20'></div>
          </div>
          <p className='text-lg text-gray-600'>
            Connecting Africa through innovative transportation and
            logistics solutions.
          </p>
        </div>

        {/* About Sections */}
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center mb-16 bg-white shadow-lg rounded-xl ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}>
            <div className='md:w-1/2 p-4'>
              <img
                src={section.imageSrc}
                alt={section.imageAlt}
                className='w-full h-auto rounded-xl object-cover'
              />
            </div>
            <div className='md:w-1/2 p-6'>
              <h2 className='text-2xl font-semibold mb-4'>
                {section.title}
              </h2>
              <p className='text-gray-600'>{section.content}</p>
            </div>
          </div>
        ))}

        {/* Vision & Mission Section */}
        <div className='grid md:grid-cols-2 gap-8 mb-16'>
          {visionMission.map((vm, index) => (
            <div
              key={index}
              className='bg-white shadow-lg rounded-xl p-6'>
              <img
                src={vm.imageSrc}
                alt={vm.imageAlt}
                className='w-full h-64 object-cover rounded-xl mb-4'
              />
              <h3 className='text-xl font-semibold'>{vm.title}</h3>
              <p className='text-gray-600'>{vm.content}</p>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className='mb-16'>
          <h2 className='text-3xl font-semibold text-center mb-8'>
            Core Values
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {coreValues.map((value, index) => (
              <div
                key={index}
                className='flex flex-col items-center text-center bg-white shadow-lg rounded-xl p-6'>
                <img
                  src={value.imageSrc}
                  alt={value.name}
                  className='w-20 h-20 mb-4 rounded-full bg-gray-100 p-2 '
                />
                <h4 className='text-lg font-semibold'>
                  {value.name}
                </h4>
                <p className='text-gray-600'>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className='text-3xl font-semibold text-center mb-8'>
            Our Team
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className='flex flex-col items-center text-center bg-white shadow-lg rounded-xl p-6'>
                <img
                  src={member.imageSrc}
                  alt={member.name}
                  className='w-32 h-32 rounded-full mb-4 object-cover'
                />
                <h4 className='text-lg font-semibold'>
                  {member.name}
                </h4>
                <p className='text-gray-600'>{member.role}</p>
                <p className='text-gray-500 text-sm'>
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Aside - Ad */}
      {/* <aside className='hidden lg:flex lg:w-1/5 bg-white p-4 border-l border-gray-200 lg:justify-center '>
        <div className='flex flex-col p-5 sticky'>
          <div className='space-y-3'>
            <img
              src='/about/ad3.jpg'
              alt='Ad 3'
              className='rounded-xl  p-2 object-cover opacity-60'
            />
            <img
              src='/about/ad4.jpg'
              alt='Ad 4'
              className='rounded-xl  p-2 object-cover opacity-60'
            />
            <div className='bg-green-50 text-center text-green-700 font-semibold p-4 rounded-lg shadow'>
              Advertise with Us
            </div>
          </div>
        </div>
      </aside> */}
    </div>
  );
};

export default AboutUs;
