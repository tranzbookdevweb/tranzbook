'use client'
import Image from 'next/image';
import React, { useState } from 'react';

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number): void => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Introduction",
      content: [
        "1.1. Welcome to TranzBook, an online bus booking platform that enables travelers to book interregional and intercountry bus tickets conveniently.",
        "1.2. These Terms and Conditions govern the use of our website and services. By accessing or using TranzBook, you agree to be bound by these terms. If you do not agree, please discontinue use of our platform.",
        "1.3. TranzBook operates in and from Ghana, and users are responsible for ensuring compliance with local laws when accessing our services from other locations."
      ]
    },
    {
      title: "2. Using the TranzBook Platform",
      content: [
        "2.1. The TranzBook platform allows users to:",
        "- Search for available bus routes.",
        "- Book and pay for bus tickets.",
        "- Receive digital tickets for travel.",
        "2.2. TranzBook is a ticketing platform and does not operate or own the buses. The responsibility for transport services lies with the respective bus operators."
      ]
    },
    {
      title: "3. Booking a Travel Ticket",
      content: [
        "3.1. To successfully book a ticket, you must provide:",
        "- Departure location and destination.",
        "- Date of travel.",
        "- Full name and contact details.",
        "- Valid identification (passport, Ghana Card, or other accepted ID).",
        "3.2. You warrant that the information provided is accurate and up to date."
      ]
    },
    {
      title: "4. Payment of Fares",
      content: [
        "4.1. Payment for bookings must be made in full through TranzBook's available payment methods, including Mobile Money (MTN Momo/Telecel Cash/AirtelTigo Cash), Bank Transfer, and Debit/Credit Cards.",
        "4.2. Prices displayed on the platform are subject to change without prior notice, as determined by the respective bus operators.",
        "4.3. TranzBook is not responsible for payment failures due to banking errors, network failures, or user negligence."
      ]
    },
    {
      title: "5. Ticket Confirmation and Usage",
      content: [
        "5.1. After successful payment, you will receive a digital ticket via SMS and/or email. This ticket contains:",
        "- Passenger details",
        "- Travel date and time",
        "- Bus operator details",
        "- Seat number (if applicable)",
        "5.2. Some bus operators require ticket validation at the terminal before boarding. It is the traveler's responsibility to confirm the validation policy with the bus operator.",
        "5.3. You must present a valid ticket and identification at the time of boarding."
      ]
    },
    {
      title: "6. Refunds, Cancellations, and Changes",
      content: [
        "6.1. Refund Policy:",
        "- Tickets are non-refundable except in cases where the bus operator cancels the trip.",
        "- If a refund is approved due to a service failure, processing will take up to 14 business days.",
        "6.2. Cancellations & Changes:",
        "- Requests to change or cancel a booking must be made directly with the bus operator.",
        "- TranzBook is not responsible for alterations made after purchasing a ticket."
      ]
    },
    {
      title: "7. Restrictions on Use of the Platform",
      content: [
        "7.1. You may not use TranzBook if:",
        "- You are under legal age to form a binding contract.",
        "- You attempt to engage in fraudulent bookings.",
        "- You are banned from using services by a bus operator."
      ]
    },
    {
      title: "8. Privacy and Data Protection",
      content: [
        "8.1. We collect and process personal information in accordance with Ghana's Data Protection Act.",
        "8.2. By using TranzBook, you consent to the collection and processing of your data for ticketing, communication, and service improvement purposes.",
        "8.3. Your data will not be shared with third parties except as required by law or for processing your bookings."
      ]
    },
    {
      title: "9. Intellectual Property Rights",
      content: [
        "9.1. TranzBook owns all intellectual property rights on its platform, including website content, trademarks, and logos.",
        "9.2. Unauthorized use of TranzBook's intellectual property is prohibited."
      ]
    },
    {
      title: "10. Limitation of Liability",
      content: [
        "10.1. TranzBook is not liable for:",
        "- Bus service delays, cancellations, or accidents.",
        "- Loss of personal belongings during travel.",
        "- Errors in ticketing caused by incorrect user input.",
        "10.2. Our total liability, if proven, shall not exceed the ticket cost."
      ]
    },
    {
      title: "11. Service Availability & Accuracy",
      content: [
        "11.1. While we strive to keep our platform accessible and up to date, we do not guarantee uninterrupted service.",
        "11.2. TranzBook is not responsible for external factors such as internet failures, network downtimes, or inaccurate transport information from bus operators."
      ]
    },
    {
      title: "12. Third-Party Websites & Links",
      content: [
        "12.1. TranzBook may contain links to third-party sites (e.g., bus operator websites). We do not endorse or assume responsibility for their content."
      ]
    },
    {
      title: "13. Force Majeure",
      content: [
        "13.1. TranzBook is not responsible for service disruptions caused by events beyond our control, including but not limited to:",
        "- Natural disasters",
        "- Strikes or protests",
        "- Government regulations"
      ]
    },
    {
      title: "14. Dispute Resolution",
      content: [
        "14.1. In case of disputes, we encourage you to first contact our support team.",
        "14.2. If a resolution is not reached, disputes will be settled in accordance with Ghanaian arbitration laws."
      ]
    },
    {
      title: "15. Amendments to Terms",
      content: [
        "15.1. TranzBook may update these Terms and Conditions from time to time. Continued use of the platform after updates constitutes acceptance of the revised terms."
      ]
    },
    {
      title: "16. Contact Information",
      content: [
        "For inquiries, complaints, or support:",
        "📧 Email: support@tranzbook.com",
        "📞 Phone: +233 554548978",
        "🌍 Website: www.tranzbook.com"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Bus Terms and conditions</h1>
          <p className="mt-2 text-blue-100">Last updated: March 2025</p>
        </div>
      </header> 
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Introduction Banner */}
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <h2 className="text-2xl font-semibold text-blue-800">Bus Terms & Conditions</h2>
            <p className="text-gray-700">
          These Terms and Conditions govern your use of TranzBook&apos;s online bus booking platform. 
          Please read them carefully before using our services.
        </p>
          </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-4 py-3 text-left font-medium flex justify-between items-center focus:outline-none"
              style={{ 
                backgroundColor: expandedSection === index ? '#48A0FF' : 'white',
                color: expandedSection === index ? 'white' : '#48A0FF'
              }}
              onClick={() => toggleSection(index)}
            >
              <span>{section.title}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-transform ${expandedSection === index ? 'transform rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {expandedSection === index && (
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="py-1 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg text-center" style={{ backgroundColor: 'rgba(253, 176, 34, 0.1)' }}>
        <p className="text-gray-800 font-medium" style={{ color: '#FDB022' }}>
          By using TranzBook services, you agree to these Terms and Conditions.
        </p>
      </div>
      
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Last updated: March 2025</p>
      </div>
      </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;