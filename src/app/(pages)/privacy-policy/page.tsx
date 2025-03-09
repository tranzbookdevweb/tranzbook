// app/(pages)/privacy-policy/page.tsx
"use client";

import React, { useState } from 'react';

type SectionId = 'section1' | 'section2' | 'section3' | 'section4' | 'section5' | 'section6' | 'section7' | 'section8' | 'section9' | 'section10' | 'section11' | 'section12' | null;

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<SectionId>(null);

  const toggleSection = (sectionId: SectionId) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-blue-100">Last updated: March 2025</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Introduction Banner */}
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <h2 className="text-2xl font-semibold text-blue-800">TranzBook Privacy Policy</h2>
            <p className="mt-3 text-gray-600">
              At TranzBook, we&apos;re committed to protecting your privacy and ensuring that your personal 
              data is handled securely and transparently. This Privacy Policy outlines how we collect, 
              use, store, and protect your information when you use our platform.
            </p>
          </div>

          {/* Policy Content */}
          <div className="divide-y divide-gray-200">
            {/* Section 1 */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section1')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">1. Introduction</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section1' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section1' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    Welcome to TranzBook. We are committed to protecting your privacy and ensuring that your personal data is handled securely and transparently. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you use our platform.
                  </p>
                  <p className="mt-3 text-gray-600">
                    By accessing or using TranzBook&apos;s website and services, you agree to the terms outlined in this Privacy Policy.
                  </p>
                </div>
              )}
            </div>

            {/* Section 2 */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section2')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">2. Scope of this Policy</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section2' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section2' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    This Privacy Policy applies to:
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>Users of the TranzBook Bus Booking Platform</li>
                    <li>Users of the TranzBook Cargo Truck Booking Services</li>
                    <li>Visitors to our website and mobile platform</li>
                    <li>Any other individuals who interact with TranzBook services</li>
                  </ul>
                  <p className="mt-3 text-gray-600">
                    We may update this policy from time to time, so please review it periodically.
                  </p>
                </div>
              )}
            </div>

            {/* Section 3 */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section3')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">3. Information We Collect</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section3' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section3' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    When you use our platform, we may collect the following types of personal information:
                  </p>
                  
                  <h4 className="mt-4 font-medium text-gray-800">3.1 Personal Details</h4>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>Full name</li>
                    <li>Contact information (phone number, email address)</li>
                    <li>Identification details (Ghana Card, passport, or other accepted ID)</li>
                  </ul>
                  
                  <h4 className="mt-4 font-medium text-gray-800">3.2 Booking and Transaction Details</h4>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>Travel and cargo booking history</li>
                    <li>Payment and billing information</li>
                    <li>Pickup and destination locations for transport services</li>
                  </ul>
                  
                  <h4 className="mt-4 font-medium text-gray-800">3.3 Device & Usage Information</h4>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>IP address and browser type</li>
                    <li>Cookies and tracking technologies to improve user experience</li>
                  </ul>
                  
                  <h4 className="mt-4 font-medium text-gray-800">3.4 Third-Party Data Sources</h4>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>Information provided by bus operators, truck service providers, or payment processors in connection with your transactions</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Section 4 */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section4')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">4. How We Use Your Information</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section4' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section4' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    TranzBook processes your data for the following purposes:
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">✓</span>
                      <span><strong>To Facilitate Bookings</strong> – Processing and confirming your bus or cargo transport bookings.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">✓</span>
                      <span><strong>To Process Payments</strong> – Ensuring secure and verified transactions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">✓</span>
                      <span><strong>To Improve User Experience</strong> – Analyzing service usage to enhance platform performance.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">✓</span>
                      <span><strong>To Provide Customer Support</strong> – Addressing inquiries and resolving disputes.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">✓</span>
                      <span><strong>To Ensure Security & Fraud Prevention</strong> – Detecting unauthorized transactions or fraudulent activities.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-green-100 text-green-500 mr-2">✓</span>
                      <span><strong>To Comply with Legal Obligations</strong> – Adhering to Ghanaian transport and data protection laws.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Section 5 */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section5')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">5. Sharing of Personal Information</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section5' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section5' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    TranzBook does not sell or rent your personal data. However, we may share your information with:
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                    <li>Bus and Truck Operators – To facilitate transport services.</li>
                    <li>Payment Processors – To process transactions securely.</li>
                    <li>Regulatory Authorities – When required by law.</li>
                  </ul>
                  <p className="mt-3 text-gray-600">
                    All third-party partners must comply with data protection laws and maintain confidentiality.
                  </p>
                </div>
              )}
            </div>

            {/* Section 8 - User Rights */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section8')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">8. User Rights & Control Over Personal Data</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section8' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section8' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    Under Ghana&apos;s Data Protection Act, you have the right to:
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-500 mr-2">✓</span>
                      <span><strong>Access</strong> the personal data we hold about you.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-500 mr-2">✓</span>
                      <span><strong>Request Correction</strong> of inaccurate data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-500 mr-2">✓</span>
                      <span><strong>Request Deletion</strong> of data no longer needed.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 text-blue-500 mr-2">✓</span>
                      <span><strong>Opt-Out</strong> of Marketing Communications at any time.</span>
                    </li>
                  </ul>
                  <p className="mt-3 text-gray-600">
                    To exercise any of these rights, contact us at support@tranzbook.com.
                  </p>
                </div>
              )}
            </div>

            {/* Section 12 - Contact Info */}
            <div className="policy-section">
              <button 
                onClick={() => toggleSection('section12')} 
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-medium text-[#48a0ff]">12. Contact Us</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transform ${activeSection === 'section12' ? 'rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {activeSection === 'section12' && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">
                    For questions regarding this Privacy Policy or data protection concerns, contact:
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-blue-600 mb-2">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-gray-600">support@tranzbook.com</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-blue-600 mb-2">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="font-medium">Phone</span>
                      </div>
                      <p className="text-gray-600">+233554548978</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-blue-600 mb-2">
                        <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Website</span>
                      </div>
                      <p className="text-gray-600">www.tranzbook.com</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-[#48a0ff] mb-4">Quick Navigation</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => {
                setActiveSection('section1');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 hover:bg-blue-50 rounded px-3 py-2 text-left transition-colors"
            >
              1. Introduction
            </button>
            <button 
              onClick={() => {
                setActiveSection('section3');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 hover:bg-blue-50 rounded px-3 py-2 text-left transition-colors"
            >
              3. Information We Collect
            </button>
            <button 
              onClick={() => {
                setActiveSection('section4');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 hover:bg-blue-50 rounded px-3 py-2 text-left transition-colors"
            >
              4. How We Use Your Information
            </button>
            <button 
              onClick={() => {
                setActiveSection('section5');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 hover:bg-blue-50 rounded px-3 py-2 text-left transition-colors"
            >
              5. Sharing of Personal Information
            </button>
            <button 
              onClick={() => {
                setActiveSection('section8');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 hover:bg-blue-50 rounded px-3 py-2 text-left transition-colors"
            >
              8. User Rights & Control
            </button>
            <button 
              onClick={() => {
                setActiveSection('section12');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-600 hover:bg-blue-50 rounded px-3 py-2 text-left transition-colors"
            >
              12. Contact Us
            </button>
          </div>
        </div>
      </main>

    
    </div>
  );
}