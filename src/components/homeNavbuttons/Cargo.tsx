'use client';

import React from 'react';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import Image from 'next/image';
import FormCargo from '../FormCargo'; 

const Cargo: React.FC = () => {
  const [text] = useTypewriter({
    words: ['Check Cargo Truck Availability, Compare Prices, Book Your Truck to Move Your Goods'],
    loop: false,
    delaySpeed: 3000,
  });

  return (
    <div className='flex flex-col items-center overflow-x-hidden w-full justify-center'>
      <div className='flex flex-col items-center text-center'>
        <h4 className='text-[#FDB022] text-[4vh] max-sm:text-[3vh] max-md:text-[2.4vh] font-bold'>
          Book A Truck, Move Your Goods Easily
        </h4>
        <h5 className='text-[#475467] text-[2vh] max-lg:text-[1.9vh] w-full font-semibold'>
          <span>{text}<Cursor /></span>
        </h5>
      </div>
      
      {/* Cargo Truck Illustration */}
      <div className='w-full'>
        <Image
          width={1200}  // Set appropriate width
          height={500}  // Set appropriate height
          src='/pictures/TBcargo.svg'
          alt='Cargo Truck Illustration'
          className='w-full h-auto'  // Ensure full-width with auto height
        />
      </div>
        {/* Cargo Booking Form */}
      <div>
        <FormCargo /> 
      </div>
    </div>
  );
}

export default Cargo;
