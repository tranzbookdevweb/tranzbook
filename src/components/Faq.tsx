'use client'
import React, { useState } from 'react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'; // Import minus icon
import Image from 'next/image';
import { Button } from './ui/button';

interface FaqProps {
  activeButton: 'bus' | 'truck'; // Accept activeButton as a prop
}

const Faq: React.FC<FaqProps> = ({ activeButton }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleText = (index: number) => {
    setOpenFaq(prev => (prev === index ? null : index)); // Toggle open/close for each FAQ
  };

  const busFaqs = [
    {
      question: "What is TranzBook?",
      answer: "TranzBook is an online platform that simplifies the process of booking bus tickets and trucks for transportation needs. Our platform allows users to search for and book tickets or trucks quickly and easily, without the need for phone calls or in-person transactions."
    },
    {
      question: "How can I book a bus ticket?",
      answer: "Booking a bus ticket is easy with TranzBook. Simply enter your departure and destination cities, select your travel date, and choose from the available bus options. Then, complete your booking and receive your e-ticket, which you can present while boarding the bus."
    },
    {
      question: "Are there any discounts or promotions available?",
      answer: "TranzBook offers occasional discounts and promotions. Keep an eye on our website or subscribe to our newsletter to stay updated on the latest deals and offers."
    },
    {
      question: "Is my personal information secure on TranzBook?",
      answer: "Absolutely. TranzBook takes the privacy and security of your personal information seriously. We employ industry-standard encryption and follow best practices to safeguard your data."
    },
    {
      question: "Can I cancel my ticket?",
      answer: "Ticket cancellation policies are set by the bus operator you select. Some operators allow cancellations with a fee, while others may not permit cancellations, meaning you would need to forfeit the ticket amount. If your cancellation is made at least 12 hours before the scheduled departure, it will generally be accepted with a 15% cancellation fee."
    },
    {
      question: "What payment methods are accepted on TranzBook?",
      answer: "TranzBook accepts various payment methods, including mobile money, debit cards, visa cards, master cards and PayPal. We prioritize security and ensure your payment information is protected."
    },
    {
      question: "Are there any additional fees or hidden charges?",
      answer: "No. At TranzBook, transparency is key. The prices you see during the booking process are the final prices, inclusive of any applicable fees or charges. We aim to keep our pricing clear and straightforward, so you can book with confidence, knowing there are no hidden fees."
    },
    {
      question: "Can I book a ticket for someone else?",
      answer: "Yes, you can book transportation services for someone else. During the booking process, you can specify the passenger' details and contact information to ensure a smooth experience for the person traveling."
    },
    {
      question: "Can I request specific amenities or preferences for my ride or bus journey?",
      answer: "TranzBook strives to accommodate your preferences. During the booking process, you may have the option to request specific amenities or preferences, such as bus seat preferences on buses. However, availability may vary depending on the bus operator."
    },
    {
      question: "How do I sign up for a TranzBook account?",
      answer: "Signing up for a TranzBook account is simple. Visit our website and click on the 'Sign Up' button. Fill in the required information, including your email address and password, and follow the prompts to create your account."
    },
    {
      question: "How do I contact TranzBook?",
      answer: "You can contact our customer support team by visiting the 'Contact Us' page on our website 24/7. Contact us through the contact numbers, email or fill out the contact form with your inquiry or issue, and our support team will respond to you as soon as possible."
    }
  ];

  const truckFaqs = [
    {
      question: "What is TranzBook's truck booking service?",
      answer: "TranzBook's truck booking service connects you with verified truck operators across Ghana for all your freight and cargo transportation needs. Our platform simplifies the process of finding, comparing, and booking trucks for local and long-distance deliveries."
    },
    {
      question: "How can I book a truck for my cargo?",
      answer: "Booking a truck is straightforward with TranzBook. Enter your pickup and delivery locations, specify your cargo details (weight, dimensions, type), select your preferred date, and choose from available trucks. Complete your booking and receive confirmation with driver contact details."
    },
    {
      question: "What types of trucks are available on the platform?",
      answer: "We offer various truck types including pickup trucks, box trucks, flatbeds, refrigerated trucks, and heavy-duty vehicles. Each listing includes capacity details, dimensions, and special features to help you choose the right truck for your cargo."
    },
    {
      question: "How are truck operators verified on TranzBook?",
      answer: "All truck operators undergo a comprehensive verification process including license validation, insurance confirmation, vehicle inspection records, and background checks. We also maintain driver ratings and reviews to ensure quality service."
    },
    {
      question: "Can I track my cargo during transportation?",
      answer: "Yes! TranzBook provides real-time GPS tracking for most trucks on our platform. You'll receive live updates on your cargo's location and estimated delivery time. You can also communicate directly with your assigned driver through our secure messaging system."
    },
    {
      question: "What payment methods are accepted for truck bookings?",
      answer: "We accept mobile money, bank transfers, debit cards, credit cards, and corporate payment options. For large or recurring freight needs, we also offer invoice-based payment terms for verified business customers."
    },
    {
      question: "Can I cancel or modify my truck booking?",
      answer: "Cancellation and modification policies vary by operator. Generally, cancellations made 24+ hours before pickup incur a 10% fee, while same-day cancellations may result in a 25% charge. Emergency modifications are handled case-by-case with your assigned operator."
    },
    {
      question: "What happens if my cargo is damaged during transport?",
      answer: "All verified truck operators carry cargo insurance. In case of damage, immediately document the issue with photos and contact our support team. We'll facilitate the claims process with the operator's insurance provider to ensure fair compensation."
    },
    {
      question: "Do you offer scheduled or recurring freight services?",
      answer: "Absolutely! TranzBook supports both one-time bookings and recurring freight schedules. You can set up weekly, monthly, or custom delivery schedules with your preferred operators, often at discounted rates for regular customers."
    },
    {
      question: "What cargo types are restricted or prohibited?",
      answer: "We prohibit hazardous materials, illegal substances, live animals (except with special permits), and perishables without proper refrigeration. Each truck operator may have additional restrictions. Always declare your cargo type accurately during booking."
    },
    {
      question: "How do I become a truck operator on TranzBook?",
      answer: "To join as a truck operator, complete our online application with your business registration, driver's license, vehicle documentation, and insurance details. After verification (typically 3-5 business days), you can start receiving booking requests and managing your fleet through our operator dashboard."
    }
  ];

  const currentFaqs = activeButton === 'bus' ? busFaqs : truckFaqs;

  return (
    <div className='flex mb-12 bg-[#F9FAFB] w-screen flex-col text-gray-600 items-center justify-center'>
      <div className='p-[5vh] items-center flex flex-col'>
        <h3 className='text-[3.5vh] font-semibold p-[1vh] text-center'>Frequently Asked Questions</h3>
        <h4 className='font-semibold text-[2vh] p-[2vh] text-center'>
          {activeButton === 'bus' 
            ? 'Everything you need to know about the product and billing'
            : 'Everything you need to know about truck booking and freight services'
          }
        </h4>

        {/* Dynamic FAQ List */}
        {currentFaqs.map((faq, index) => (
          <div key={index + 1} className='wrdcontainer'>
            <div className='wrd'>
              <h4>{faq.question}</h4>
              {openFaq === index + 1 && <p>{faq.answer}</p>}
            </div>
            <button onClick={() => toggleText(index + 1)}>
              {openFaq === index + 1 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
            </button>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-[#123C7B] w-full max-w-5xl mx-auto rounded-2xl p-8 text-center text-white">
        <div className="flex justify-center mb-4">
          <div className="flex -space-x-2">
            <img
              src="/faqright.png"
              alt="Team member"
              className="w-10 h-10 rounded-full border border-gray-600"
            />
            <img
              src="/faqmiddle.png"
              alt="Team member"
              className="w-10 h-10 rounded-full"
            />
            <img
              src="/faqleft.png"
              alt="Team member"
              className="w-10 h-10 rounded-full border border-gray-600"
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
        <p className="text-blue-100 mb-6">
          Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
        </p>
        <Button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
          Get in touch
        </Button>
      </div>
    </div>
  );
};

export default Faq;