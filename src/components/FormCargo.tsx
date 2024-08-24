'use client';

import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScaleIcon from '@mui/icons-material/Scale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PanoramaFishEyeRounded from '@mui/icons-material/PanoramaFishEyeRounded';
import { useRouter } from 'next/navigation';
import { ComboboxForm } from './ComboBox';
import { CalendarForm } from './Calendar';

export default function FormCargo() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [cargoWeight, setCargoWeight] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [locationDescription, setLocationDescription] = useState('');

  const router = useRouter();

  const handleFromLocationSelect = (location: string) => {
    setFromLocation(location);
  };

  const handleToLocationSelect = (location: string) => {
    setToLocation(location);
  };

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = {
      fromLocation,
      toLocation,
      date: date ? date.toISOString() : '',
      cargoWeight,
      productDescription,
      locationDescription,
    };

    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Location */}
        <div className="flex flex-col">
          <label className="text-blue-600 dark:text-blue-400 font-semibold mb-1">From</label>
          <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
            <PanoramaFishEyeRounded className="text-black dark:text-white text-xl mr-2" />
            <div className="w-full">
              <ComboboxForm
                onLocationSelect={handleFromLocationSelect}
                disabledOptions={[toLocation]}
                locationType="FROM"
              />
            </div>
          </div>
        </div>

        {/* To Location */}
        <div className="flex flex-col">
          <label className="text-blue-600 dark:text-blue-400 font-semibold mb-1">To</label>
          <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
            <LocationOnIcon className="text-black dark:text-white text-xl mr-2" />
            <div className="w-full">
              <ComboboxForm
                onLocationSelect={handleToLocationSelect}
                disabledOptions={[fromLocation]}
                locationType="TO"
              />
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Date</label>
          <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
            <CalendarMonthIcon className="text-black dark:text-white text-xl mr-2" />
            <CalendarForm onDateChange={handleDateChange} />
          </div>
        </div>

        {/* Cargo Weight */}
        <div className="flex flex-col">
          <label className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Weight of goods (Option)</label>
          <div className="flex items-center border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800">
            <ScaleIcon className="text-black dark:text-white text-xl mr-2" />
            <input
              type="text"
              value={cargoWeight}
              onChange={(e) => setCargoWeight(e.target.value)}
              placeholder="1500 metric tons"
              className="w-full border-none outline-none bg-transparent text-black dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="flex flex-col">
        <label className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Product Description</label>
        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="w-full h-24 border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder="Enter product details here"
        />
      </div>

      {/* Location Description */}
      <div className="flex flex-col">
        <label className="text-blue-600 dark:text-blue-400 font-semibold mb-1">Location Description</label>
        <textarea
          value={locationDescription}
          onChange={(e) => setLocationDescription(e.target.value)}
          className="w-full h-24 border-2 border-orange-400 dark:border-orange-600 rounded p-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          placeholder="Enter location details here"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 dark:bg-blue-700 text-white rounded p-3 hover:bg-blue-600 dark:hover:bg-blue-800"
      >
        Book
      </button>
    </form>
  );
}
