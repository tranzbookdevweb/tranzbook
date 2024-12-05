'use client'
import Carousel from '@/components/Carousel';
import React from 'react';
import { motion } from 'framer-motion';


interface PopularPost {
  title: string;
  image: string;
}

const PopularPosts: PopularPost[] = [
  {
    title: 'East Region',
    image: '/Regions/EasternRegion.png',
  },
  {
    title: 'Cape Coast',
    image: '/Regions/CapeCoast.png',
  },
  {
    title: 'Kumasi',
    image: '/Regions/Kumasi.png',
  },
  {
    title: 'Northern Region',
    image: '/Regions/NorthernRegion.png',
  },
  {
    title: 'Volta Region',
    image: '/Regions/VoltaRegion.png',
  },
  {
    title: 'Greater Accra Region',
    image: '/Regions/AccraRegion.png',
  },
];

const PopularLocation: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PopularPosts.map((post, index) => (
            <motion.div
              key={index}
              className="relative bg-gray-800 rounded-[2pc] hover:cursor-pointer h-60 w-full overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-25">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularLocation;