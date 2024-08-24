// components/AboutUs.tsx

import React from "react";

// AboutUs Component: This component displays information about the company, its goals, and team members.
const AboutUs: React.FC = () => {
  // Sections containing about us and goals information
  const sections = [
    {
      title: "About Us",
      imageSrc:
        "https://cdn-egjbg.nitrocdn.com/BhxGwttHKWrbABsTLrAHuTigMVSocCMN/assets/images/optimized/rev-0486da7/www.masterstransportation.com/wp-content/uploads/2021/02/group-transportation-for-team-building-1080x500.jpg",
      imageAlt: "A group of People",
      content:
        "TranzBook is a transportation and logistics technology platform offering bus ticket booking and cargo vehicle services through web and mobile applications. It allows travelers to search for bus routes, view schedules, and securely book tickets online, with options to select seats and receive real-time updates on bus status and arrival times. For cargo booking, users can locate nearby vehicles, book transportation services, track goods in real-time, receive delivery notifications, and manage shipments. TranzBook utilizes advanced logistics software and GPS tracking to optimize routes, reduce costs, improve delivery efficiency, and enhance the overall customer experience for both travelers and cargo shippers.",
    },
  ];

  // Sections containing goals information
  const goalSections = [
    {
      title: "Our Goals",
      imageSrc:
        "https://i.pinimg.com/736x/4d/22/a8/4d22a85689d237715d502013cd9cc5d7.jpg",
      imageAlt: "People with a goal",
      content:
        "1. Be the number one transportation and logistics partner in Africa\n\n2. Create a community of travelers, shippers, and carriers who share our vision of a more connected and sustainable future, and work together to build a transportation ecosystem that is inclusive, transparent, and accessible to all.\n\n3. Become the go-to technology provider for transportation solutions in the country, by offering the most comprehensive, user-friendly, and efficient platform for online bus ticketing and cargo/truck booking services, while ensuring the highest standards of safety, security, and sustainability.",
    },
  ];

  // Team members information
  const teamMembers = [
    {
      name: "Andres Berlin",
      role: "Chief Executive Officer",
      description:
        "The CEO's role in raising a company's corporate IQ is to establish an atmosphere that promotes knowledge sharing and collaboration.",
      imageSrc:
        "https://cdn.tuk.dev/assets/photo-1564061170517-d3907caa96ea.jfif",
      socialLinks: [
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg1.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg2.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg3.svg",
      ],
    },

    {
      name: "Andres Berlin",
      role: "Chief Executive Officer",
      description:
        "The CEO's role in raising a company's corporate IQ is to establish an atmosphere that promotes knowledge sharing and collaboration.",
      imageSrc:
        "https://cdn.tuk.dev/assets/photo-1564061170517-d3907caa96ea.jfif",
      socialLinks: [
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg1.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg2.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg3.svg",
      ],
    },

    {
      name: "Andres Berlin",
      role: "Chief Executive Officer",
      description:
        "The CEO's role in raising a company's corporate IQ is to establish an atmosphere that promotes knowledge sharing and collaboration.",
      imageSrc:
        "https://cdn.tuk.dev/assets/photo-1564061170517-d3907caa96ea.jfif",
      socialLinks: [
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg1.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg2.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg3.svg",
      ],
    },

    {
      name: "Andres Berlin",
      role: "Chief Executive Officer",
      description:
        "The CEO's role in raising a company's corporate IQ is to establish an atmosphere that promotes knowledge sharing and collaboration.",
      imageSrc:
        "https://cdn.tuk.dev/assets/photo-1564061170517-d3907caa96ea.jfif",
      socialLinks: [
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg1.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg2.svg",
        "https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg3.svg",
      ],
    },
    // Additional team members can be added here...
  ];

  return (
    <div className="flex flex-col w-full items-center overflow-x-hidden">
      {/* Main section for 'About Us' and 'Our Goals' */}
      <div className="px-10 py-10 bg-white dark:bg-gray-900 w-full">
        {sections.map((section, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16 w-full"
          >
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {section.title}
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-6">
                {section.content}
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                className="rounded-lg shadow-lg w-full h-auto"
                src={section.imageSrc}
                alt={section.imageAlt}
              />
            </div>
          </div>
        ))}

        {goalSections.map((section, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row-reverse items-center justify-between gap-10 mb-16 w-full"
          >
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                {section.title}
              </h1>
              <div className="text-base text-gray-600 dark:text-gray-300 leading-6">
                <ol className="space-y-3 list-decimal list-inside">
                  {section.content.split("\n\n").map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                className="rounded-lg shadow-lg w-full h-auto"
                src={section.imageSrc}
                alt={section.imageAlt}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="container mx-auto py-16">
        <div className="text-center mb-12">
          <p className="text-gray-500 dark:text-gray-200 text-lg font-normal">
            BUILDING TEAM
          </p>
          <h1 className="text-3xl lg:text-4xl text-gray-800 dark:text-white font-extrabold">
            The Talented People Behind the Scenes of the Organization
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div key={index} className="relative bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
              <div className="flex justify-center mb-6">
                <div className="h-32 w-32">
                  <img
                    src={member.imageSrc}
                    alt={`Display Picture of ${member.name}`}
                    className="rounded-full object-cover h-full w-full shadow-lg"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center dark:text-white mb-2">
                {member.name}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                {member.role}
              </p>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                {member.description}
              </p>
              <div className="flex justify-center space-x-4">
                {member.socialLinks.map((link, i) => (
                  <a key={i} href={link} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <img src={link} alt={`Social link ${i + 1}`} className="h-5 w-5"/>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
