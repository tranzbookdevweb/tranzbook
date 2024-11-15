// components/AboutUs.tsx

import React from "react";

const AboutUs: React.FC = () => {
  const sections = [
    {
      title: "About TranzBook",
      imageSrc: "https://example.com/about-image.jpg",
      imageAlt: "Transportation and logistics",
      content: `TranzBook Technology is a transportation and logistics solution that enables travelers to book bus tickets and cargo vehicles for their goods through web and mobile applications. Travelers can search for available bus routes, view schedules, choose seats, and securely book tickets, with real-time updates on bus status and arrival times.`,
    },
    {
      title: "Cargo Booking Services",
      imageSrc: "https://example.com/cargo-image.jpg",
      imageAlt: "Cargo vehicle booking",
      content: `For cargo vehicle booking, the platform enables businesses or individuals to locate nearby vehicles, book transportation for goods, track movements in real-time, receive delivery notifications, and manage shipments effectively.`,
    },
    {
      title: "Technology & Efficiency",
      imageSrc: "https://example.com/technology-image.jpg",
      imageAlt: "Logistics management software",
      content: `Our solution uses advanced logistics management software and GPS tracking to optimize routes, reduce costs, and improve delivery times, providing a seamless experience for both travelers and cargo shippers.`,
    },
  ];

  const visionMission = [
    {
      title: "Vision Statement",
      imageSrc: "https://example.com/vision-image.jpg",
      imageAlt: "Vision of the future",
      content: `To be Africa’s preferred transportation and logistics platform, fostering a connected, inclusive, and sustainable community of travelers, shippers, and carriers.`,
    },
    {
      title: "Mission Statement",
      imageSrc: "https://example.com/mission-image.jpg",
      imageAlt: "Mission for Africa",
      content: `To be the leading digital platform for seamless bus ticketing and cargo booking across Africa, prioritizing convenience, safety, and sustainable practices while promoting customer-centered innovation.`,
    },
  ];

  const coreValues = [
    { name: "Safety & Security", description: "Ensuring all customers' journeys and cargo are safe.", imageSrc: "https://example.com/safety-image.jpg" },
    { name: "Comfort", description: "Providing the best experience for every trip and shipment.", imageSrc: "https://example.com/comfort-image.jpg" },
    { name: "Integrity", description: "Upholding high ethical standards and transparent practices.", imageSrc: "https://example.com/integrity-image.jpg" },
    { name: "Respect", description: "Fostering an inclusive and respectful community.", imageSrc: "https://example.com/respect-image.jpg" },
  ];

  const teamMembers = [
    { name: "Andres Berlin", role: "CEO", description: "Leading TranzBook's growth and vision.", imageSrc: "https://example.com/andres-berlin.jpg" },
    { name: "Alice Mbeke", role: "CTO", description: "Overseeing technology and innovation.", imageSrc: "https://example.com/alice-mbeke.jpg" },
    { name: "Michael Owusu", role: "COO", description: "Optimizing operations and customer experience.", imageSrc: "https://example.com/michael-owusu.jpg" },
  ];

  return (
    <div className="container mx-auto px-8 py-16 space-y-16">
      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {sections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <img className="w-full h-40 rounded-lg mb-4 object-cover" src={section.imageSrc} alt={section.imageAlt} />
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Vision and Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visionMission.map((vm, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img className="w-full h-40 rounded-lg mb-4 object-cover" src={vm.imageSrc} alt={vm.imageAlt} />
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{vm.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{vm.content}</p>
          </div>
        ))}
      </div>

      {/* Core Values */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Core Values</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {coreValues.map((value, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg text-center">
            <img className="w-full h-32 rounded-lg mb-4 object-cover" src={value.imageSrc} alt={value.name} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{value.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">Meet Our Team</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
            <img className="w-32 h-32 rounded-full mb-4 mx-auto object-cover" src={member.imageSrc} alt={member.name} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{member.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{member.role}</p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
