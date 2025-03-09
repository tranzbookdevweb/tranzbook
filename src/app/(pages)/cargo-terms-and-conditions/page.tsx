'use client'
import React, { useState } from 'react';

const CargoTermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number): void => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "1. Introduction",
      content: [
        "1.1. Welcome to TranzBook Cargo, a platform that connects goods owners/cargo owners/shippers with available truck operators for efficient and reliable transportation.",
        "1.2. By using our platform, you agree to comply with these Terms and Conditions. If you do not accept them, please discontinue using our services.",
        "1.3. TranzBook operates within Ghana, and users must ensure compliance with all relevant transport laws."
      ]
    },
    {
      title: "2. Service Overview",
      content: [
        "2.1. TranzBook provides an online system for booking cargo transport services by matching goods owners/cargo owners/shippers with truck operators based on their specific transportation needs.",
        "2.2. Customers must provide:",
        "- Pickup location and destination details for accurate dispatch.",
        "- Goods weight and description to help determine the most suitable truck.",
        "- Special handling instructions if applicable (e.g., perishable, fragile, hazardous materials).",
        "- Customers can select their preferred truck type, including flatbeds, box trucks, tankers, and refrigerated trucks.",
        "2.3. Pricing Process:",
        "- TranzBook does not generate automatic prices on the platform.",
        "- Prices are communicated to customers after they submit a cargo booking request through our order form.",
        "- Final pricing depends on distance, truck type, cargo weight, and additional handling requirements."
      ]
    },
    {
      title: "3. Booking and Payment",
      content: [
        "3.1. Payment Terms:",
        "- Customers must confirm and accept the quoted price before dispatch.",
        "- Payments can be made via Mobile Money (MTN Momo), Bank Transfer, or Debit/Credit Card.",
        "- Additional fees may apply for waiting time, rerouting, or extra handling requirements.",
        "3.2. Agro Logistics Pre - Financing (ALP) System:",
        "- Designed for farmers and aggregators who require flexible payment terms.",
        "- Allows booking of trucks with partial upfront payment or no upfront payment.",
        "- Full payment must be made upon delivery before offloading.",
        "- Delays in payment may result in additional storage or waiting charges."
      ]
    },
    {
      title: "4. Cancellations and Refunds",
      content: [
        "4.1. Customer-Initiated Cancellations:",
        "- Cancellations before truck dispatch are eligible for a partial refund, subject to a 5% administrative fee deduction.",
        "- No refunds will be issued once the truck has been dispatched.",
        "4.2. Operator-Initiated Cancellations:",
        "- If a truck operator cancels a confirmed booking, TranzBook will either reschedule the delivery or process a full refund."
      ]
    },
    {
      title: "5. Cargo Handling and Liability",
      content: [
        "5.1. Customer Responsibilities:",
        "- Ensure cargo is properly packaged and labeled before pickup.",
        "- Provide all required documentation (invoices, permits, customs clearance, etc.).",
        "- Ensure someone is present at both pickup and delivery locations.",
        "5.2. Truck Operator Responsibilities:",
        "- Ensure safe and timely cargo transportation.",
        "- Secure cargo properly to prevent damage in transit.",
        "- Adhere to Ghana's road transport and safety regulations.",
        "5.3. Liability Disclaimer:",
        "- TranzBook is not responsible for cargo damage, delays, or losses caused by the truck operator.",
        "- Truck operators may provide insurance options, and customers are encouraged to verify coverage before booking.",
        "- Any disputes regarding cargo condition or loss must be settled directly with the truck operator."
      ]
    },
    {
      title: "6. Prohibited Cargo",
      content: [
        "6.1. Customers must not use TranzBook for transporting:",
        "- Hazardous materials (explosives, radioactive substances, toxic chemicals).",
        "- Illegal goods (contraband, counterfeit items, unlicensed pharmaceuticals).",
        "- Live animals without appropriate authorization.",
        "- Perishable goods without proper refrigerated transportation.",
        "6.2. TranzBook reserves the right to cancel any booking that violates transport laws."
      ]
    },
    {
      title: "7. Insurance and Risk Management",
      content: [
        "7.1. TranzBook strongly recommends that customers insure valuable goods before transport.",
        "7.2. The company is not liable for theft, fire, accidents, or unforeseen damages beyond its control."
      ]
    },
    {
      title: "8. Delivery and Delays",
      content: [
        "8.1. Estimated delivery timelines are subject to traffic, weather conditions, and road regulations.",
        "8.2. TranzBook is not responsible for delays caused by factors beyond its control, such as customs checks, roadblocks, or truck breakdowns.",
        "8.3. Customers must report delivery disputes within 24 hours after receiving the cargo."
      ]
    },
    {
      title: "9. Customer and Operator Conduct",
      content: [
        "9.1. Customers and truck operators must:",
        "- Provide accurate booking information.",
        "- Maintain professionalism and safety standards.",
        "- Respect pickup, transit, and delivery protocols.",
        "9.2. TranzBook reserves the right to ban users who engage in fraudulent activities, misrepresentation, or breach of terms."
      ]
    },
    {
      title: "10. Privacy and Data Protection",
      content: [
        "10.1. TranzBook collects and processes user data in compliance with Ghana's Data Protection Act.",
        "10.2. Customer information will not be shared with third parties except as required by law or for processing cargo bookings."
      ]
    },
    {
      title: "11. Limitation of Liability",
      content: [
        "11.1. TranzBook is a facilitator and is not responsible for:",
        "- Cargo losses or damages during transit.",
        "- Legal violations by truck operators.",
        "- Third-party claims arising from cargo transport.",
        "11.2. Our total liability shall not exceed the booking fee paid."
      ]
    },
    {
      title: "12. Dispute Resolution",
      content: [
        "12.1. Complaints must be submitted via TranzBook's support team within 48 hours of cargo delivery.",
        "12.2. Disputes that cannot be resolved amicably will be settled under Ghanaian arbitration laws."
      ]
    },
    {
      title: "13. Amendments to Terms",
      content: [
        "13.1. TranzBook reserves the right to update these Terms and Conditions at any time. Continued use of our services constitutes acceptance of the updated terms."
      ]
    },
    {
      title: "14. Contact Information",
      content: [
        "For support or inquiries, reach us at:",
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
        <h1 className="text-3xl font-bold">Cargo Terms and conditions</h1>
        <p className="mt-2 text-blue-100">Last updated: March 2025</p>
      </div>
    </header> 
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Introduction Banner */}
        <div className="bg-blue-50 p-6 border-b border-blue-100">
          <h2 className="text-2xl font-semibold text-blue-800">Cargo Terms & Conditions</h2>
          <p className="text-gray-700">
        These Terms and Conditions govern your use of TranzBook&apos;s online Cargo booking platform. 
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

export default CargoTermsAndConditions;