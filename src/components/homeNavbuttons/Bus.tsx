'use client'
import React from 'react';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import Image from 'next/image';
import FormBus from '../FormBus';

const BusComponent: React.FC = () => {
  const [text, count] = useTypewriter({
    words: ['Check Bus Schedules, Compare Prices and Book Ticket Online'],
    loop: false,
    delaySpeed: 10000,
  });

  return (
    <div className='flex flex-col bg-[#def5fb] items-center overflow-x-hidden w-[100%] justify-center font-tangosans'>
      <div className='flex flex-col items-center text-center'>
        <h1 className='w-[844px] h-[148px] font-extrabold text-[64px] leading-[70px] flex items-end text-center text-[#123C7B] flex-none order-0 flex-grow-0 max-w-[90vw] max-sm:text-[32px] max-sm:leading-[36px] max-md:text-[48px] max-md:leading-[52px] font-tangosans'>
          Save Money, Save Time, Travel with Ease
        </h1>
        <h5 className='text-[#475467] text-[20px] my-3 max-lg:text-[1.9vh] w-full font-medium font-tangosans'>
          <span>{text}<Cursor /></span>
        </h5>
      </div>
      <div>
        <FormBus/>
      </div>
      <div>
        <Image
          width={800}
          height={400}
          className='w-full h-auto'
          src='/pictures/busIlustration 1.svg'
          alt='Bus illustration'
        />
      </div>
    </div>
  );
}

export default BusComponent;