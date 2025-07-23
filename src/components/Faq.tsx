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

  return (
    <div className='flex mb-12 bg-[#F9FAFB] w-screen flex-col text-gray-600 items-center justify-center'>
      <div className='p-[5vh] items-center flex flex-col'>
        <h3 className='text-[3.5vh] font-semibold p-[1vh] text-center'>Frequently Asked Questions</h3>
        <h4 className='font-semibold text-[2vh] p-[2vh] text-center'>Everything you need to know about the product and billing</h4>

        {/* FAQ for Bus */}
        {activeButton === 'bus' && (
          <>
            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>What is TranzBook?</h4>
                {openFaq === 1 && <p>TranzBook is an online platform that simplifies the process of booking bus tickets and trucks for transportation needs. Our platform allows users to search for and book tickets or trucks quickly and easily, without the need for phone calls or in-person transactions.</p>}
              </div>
              <button onClick={() => toggleText(1)}>
                {openFaq === 1 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>How can I book a bus ticket?</h4>
                {openFaq === 2 && <p>Booking a bus ticket is easy with TranzBook. Simply enter your departure and destination cities, select your travel date, and choose from the available bus options. Then, complete your booking and receive your e-ticket, which you can present while boarding the bus.</p>}
              </div>
              <button onClick={() => toggleText(2)}>
                {openFaq === 2 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>Are there any discounts or promotions available?</h4>
                {openFaq === 3 && <p>TranzBook offers occasional discounts and promotions. Keep an eye on our website or subscribe to our newsletter to stay updated on the latest deals and offers.</p>}
              </div>
              <button onClick={() => toggleText(3)}>
                {openFaq === 3 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>Is my personal information secure on TranzBook?</h4>
                {openFaq === 4 && <p>Absolutely. TranzBook takes the privacy and security of your personal information seriously. We employ industry-standard encryption and follow best practices to safeguard your data.</p>}
              </div>
              <button onClick={() => toggleText(4)}>
                {openFaq === 4 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>Can I cancel my ticket?</h4>
                {openFaq === 5 && <p>Ticket cancellation policies are set by the bus operator you select. Some operators allow cancellations with a fee, while others may not permit cancellations, meaning you would need to forfeit the ticket amount. If your cancellation is made at least 12 hours before the scheduled departure, it will generally be accepted with a 15% cancellation fee.</p>}
              </div>
              <button onClick={() => toggleText(5)}>
                {openFaq === 5 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>What payment methods are accepted on TranzBook?</h4>
                {openFaq === 6 && <p>TranzBook accepts various payment methods, including mobile money, debit cards, visa cards, master cards and PayPal. We prioritize security and ensure your payment information is protected.</p>}
              </div>
              <button onClick={() => toggleText(6)}>
                {openFaq === 6 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>Are there any additional fees or hidden charges?</h4>
                {openFaq === 7 && <p>No. At TranzBook, transparency is key. The prices you see during the booking process are the final prices, inclusive of any applicable fees or charges. We aim to keep our pricing clear and straightforward, so you can book with confidence, knowing there are no hidden fees.</p>}
              </div>
              <button onClick={() => toggleText(7)}>
                {openFaq === 7 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>Can I book a ticket for someone else?</h4>
                {openFaq === 8 && <p>Yes, you can book transportation services for someone else. During the booking process, you can specify the passenger&apos; details and contact information to ensure a smooth experience for the person traveling.</p>}
              </div>
              <button onClick={() => toggleText(8)}>
                {openFaq === 8 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>Can I request specific amenities or preferences for my ride or bus journey?</h4>
                {openFaq === 9 && <p>TranzBook strives to accommodate your preferences. During the booking process, you may have the option to request specific amenities or preferences, such as bus seat preferences on buses. However, availability may vary depending on the bus operator.</p>}
              </div>
              <button onClick={() => toggleText(9)}>
                {openFaq === 9 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>How do I sign up for a TranzBook account?</h4>
                {openFaq === 10 && <p>Signing up for a TranzBook account is simple. Visit our website and click on the &apos;Sign Up&apos; button. Fill in the required information, including your email address and password, and follow the prompts to create your account.</p>}
              </div>
              <button onClick={() => toggleText(10)}>
                {openFaq === 10 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>

            <div className='wrdcontainer'>
              <div className='wrd'>
                <h4>How do I contact TranzBook?</h4>
                {openFaq === 11 && <p>You can contact our customer support team by visiting the &apos;Contact Us&apos; page on our website 24/7. Contact us through the contact numbers, email or fill out the contact form with your inquiry or issue, and our support team will respond to you as soon as possible.</p>}
              </div>
              <button onClick={() => toggleText(11)}>
                {openFaq === 11 ? <RemoveCircleOutlineOutlinedIcon className='minus' /> : <AddCircleOutlineOutlinedIcon className='plus' />}
              </button>
            </div>
          </>
        )}

        {/* FAQ for Cargo */}
        {activeButton === 'truck' && (
          <>
            {/* Add similar FAQ structure for Cargo questions here */}
          </>
        )}
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
