'use client'
import React, { useState } from 'react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined'; // Import minus icon
import Image from 'next/image';

const Faq: React.FC = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null); // State variable for tracking active button
  const [iconState, setIconState] = useState<boolean>(true); // State variable for tracking icon state

  const toggleText = (buttonId: number) => {
    setActiveButton(buttonId === activeButton ? null : buttonId);
    setIconState(!iconState); // Toggle icon state
  };

  return (
    <div className='flex bg-[#0068D4] w-screen flex-col text-white items-center justify-center'>
      <div className='p-[5vh] items-center flex flex-col'>
        <h3 className='text-[3.5vh] font-semibold p-[1vh] text-center'>Frequently Asked Questions</h3>
        <h4 className='font-semibold text-[2vh] p-[2vh] text-center'>Everything you need to know about the product and billing</h4>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>What is TranzBook?</h4>
            {activeButton === 1 && <p>TranzBook is an online platform that simplifies the process of booking bus tickets and trucks for transportation needs. Our platform allows users to search for and book tickets or trucks quickly and easily, without the need for phone calls or in-person transactions.</p>}
          </div>
          {activeButton === 1 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(1)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(1)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>How can I book a bus ticket?</h4>
            {activeButton === 2 && <p>Booking a bus ticket is easy with TranzBook. Simply enter your departure and destination cities, select your travel date, and choose from the available bus options. Then, complete your booking and receive your e-ticket, which you can present while boarding the bus.</p>}
          </div>
          {activeButton === 2 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(2)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(2)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>Are there any discounts or promotions available?</h4>
            {activeButton === 3 && <p>TranzBook offers occasional discounts and promotions. Keep an eye on our website or subscribe to our newsletter to stay updated on the latest deals and offers.</p>}
          </div>
          {activeButton === 3 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(3)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(3)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>Is my personal information secure on TranzBook?</h4>
            {activeButton === 4 && <p>Absolutely. TranzBook takes the privacy and security of your personal information seriously. We employ industry-standard encryption and follow best practices to safeguard your data.</p>}
          </div>
          {activeButton === 4 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(4)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(4)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>Can I cancel my ticket?</h4>
            {activeButton === 5 && <p>Ticket cancellation policies are set by the bus operator you select. Some operators allow cancellations with a fee, while others may not permit cancellations, meaning you would need to forfeit the ticket amount. If your cancellation is made at least 12 hours before the scheduled departure, it will generally be accepted with a 15% cancellation fee.</p>}
          </div>
          {activeButton === 5 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(5)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(5)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>What payment methods are accepted on TranzBook?</h4>
            {activeButton === 6 && <p>TranzBook accepts various payment methods, including mobile money, debit cards, visa cards, master cards and PayPal. We prioritize security and ensure your payment information is protected.</p>}
          </div>
          {activeButton === 6 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(6)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(6)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>Are there any additional fees or hidden charges?</h4>
            {activeButton === 7 && <p>No. At TranzBook, transparency is key. The prices you see during the booking process are the final prices, inclusive of any applicable fees or charges. We aim to keep our pricing clear and straightforward, so you can book with confidence, knowing there are no hidden fees.</p>}
          </div>
          {activeButton === 7 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(7)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(7)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>Can I book a ticket for someone else?</h4>
            {activeButton === 8 && <p>Yes, you can book transportation services for someone else. During the booking process, you can specify the passenger's details and contact information to ensure a smooth experience for the person traveling.</p>}
          </div>
          {activeButton === 8 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(8)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(8)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>Can I request specific amenities or preferences for my ride or bus journey?</h4>
            {activeButton === 9 && <p>TranzBook strives to accommodate your preferences. During the booking process, you may have the option to request specific amenities or preferences, such as bus seat preferences on buses. However, availability may vary depending on the bus operator.</p>}
          </div>
          {activeButton === 9 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(9)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(9)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>How do I sign up for a TranzBook account?</h4>
            {activeButton === 10 && <p>Signing up for a TranzBook account is simple. Visit our website and click on the "Sign Up" button. Fill in the required information, including your email address and password, and follow the prompts to create your account.</p>}
          </div>
          {activeButton === 10 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(10)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(10)} className='plus' />
          )}
        </div>

        <div className='wrdcontainer'>
          <div className='wrd'>
            <h4>How do I contact TranzBook?</h4>
            {activeButton === 11 && <p>You can contact our customer support team by visiting the "Contact Us" page on our website 24/7. Contact us through the contact numbers, email or fill out the contact form with your inquiry or issue, and our support team will respond to you as soon as possible.</p>}
          </div>
          {activeButton === 11 ? (
            <RemoveCircleOutlineOutlinedIcon onClick={() => toggleText(11)} className='minus' />
          ) : (
            <AddCircleOutlineOutlinedIcon onClick={() => toggleText(11)} className='plus' />
          )}
        </div>
      </div>
    </div>
  );
};

export default Faq;
