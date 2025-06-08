'use client';

import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { PanoramaFishEyeRounded } from '@mui/icons-material';
import { SearchIcon } from 'lucide-react';
import { ComboboxForm } from './ComboBox';
import { useRouter } from 'next/navigation';
import { CalendarForm } from './Calendar';
import { ToastAction } from "@/components/ui/toast";
import { useToast } from './ui/use-toast';

export default function FormBus() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1); // Default to 1 instead of 0
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  const handleFromLocationSelect = (location: string) => {
    setFromLocation(location);
    if (location === toLocation) {
      setToLocation('');
    }
  };

  const handleToLocationSelect = (location: string) => {
    setToLocation(location);
    if (location === fromLocation) {
      setFromLocation('');
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate && returnDate && selectedDate.getTime() >= returnDate.getTime()) {
      setReturnDate(null);
    }
  };

  const handleReturnDateChange = (selectedReturnDate: Date | null) => {
    setReturnDate(selectedReturnDate);
  };

  const validateForm = () => {
    if (!fromLocation) {
      toast({
        title: "Missing departure location",
        description: "Please select a departure location",
        variant: "destructive",
      });
      return false;
    }
    
    if (!toLocation) {
      toast({
        title: "Missing destination",
        description: "Please select a destination",
        variant: "destructive",
      });
      return false;
    }
    
    if (!date) {
      toast({
        title: "Missing departure date",
        description: "Please select a departure date",
        variant: "destructive",
      });
      return false;
    }
    
    if (ticketQuantity <= 0) {
      toast({
        title: "Invalid ticket quantity",
        description: "Please select at least 1 ticket",
        variant: "destructive",
        action: (
          <ToastAction altText="Set to 1" onClick={() => setTicketQuantity(1)}>
            Set to 1
          </ToastAction>
        ),
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    const query = {
      fromLocation,
      toLocation,
      date: date ? date.toISOString() : '',
      returnDate: returnDate ? returnDate.toISOString() : '',
      ticketQuantity,
    };
    
    const queryString = new URLSearchParams({
      ...query,
      ticketQuantity: ticketQuantity.toString(),
    }).toString();

    // Show success toast before navigation
    toast({
      title: "Search initiated",
      description: `Searching for trips from ${fromLocation} to ${toLocation}`,
    });

    // Simulate loading time for better UX
    setTimeout(() => {
      router.push(`/search?${queryString}`);
      setIsLoading(false);
    }, 500);
  };

  const handleTicketQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= 10) { // Add reasonable limit
      setTicketQuantity(value);
    }
  };

  // Check if form is valid for button state
  const isFormValid = fromLocation && toLocation && date && ticketQuantity > 0;

  return (
    <div className="grid max-lg:grid-cols-1 border-[#fdb022] my-5 w-full max-lg:rounded-t-[1pc] max-lg:rounded-b-none rounded-[1pc] border-2 grid-cols-[1fr_auto] justify-items-center justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <form onSubmit={handleSubmit} className="grid grid-cols-5 w-full max-lg:grid-cols-2">
        <div className="flex items-center lg:rounded-l-[1pc] max-lg:rounded-tl-[1pc] bg-white border-r-2 max-lg:border-none border-[#48A0ff] p-3 hover:bg-gray-50 transition-colors duration-200">
          <PanoramaFishEyeRounded className="text-blue-500 text-xl mr-2 flex-shrink-0" />
          <div className="flex text-gray-600 flex-col w-full">
            <label className="text-[#48A0ff] font-semibold text-xs mb-1">FROM</label>
            <ComboboxForm
              onLocationSelect={handleFromLocationSelect}
              disabledOptions={[toLocation]}
              locationType="Select Origin"
            />
          </div>
        </div>

        <div className="flex max-lg:rounded-tr-[1pc] items-center bg-white border-r-2 max-lg:border-none border-[#48A0ff] p-3 hover:bg-gray-50 transition-colors duration-200">
          <LocationOnIcon className="text-blue-500 text-xl mr-2 flex-shrink-0" />
          <div className="flex text-gray-600 flex-col w-full">
            <label className="text-[#74afef] font-semibold text-xs mb-1">TO</label>
            <ComboboxForm
              onLocationSelect={handleToLocationSelect}
              disabledOptions={[fromLocation]}
              locationType="Select Destination"
            />
          </div>
        </div>

        <div className="flex items-center bg-white border-r-2 max-lg:border-none border-[#48A0ff] p-3 hover:bg-gray-50 transition-colors duration-200">
          <CalendarMonthIcon className="text-blue-500 text-xl mr-2 flex-shrink-0" />
          <div className="flex text-gray-600 flex-col w-full">
            <label className="text-[#48A0ff] font-semibold text-xs mb-1">DATE</label>
            <CalendarForm onDateChange={handleDateChange} />
          </div>
        </div>

        <div className="flex items-center bg-white border-r-2 max-lg:border-none border-[#48A0ff] p-3 hover:bg-gray-50 transition-colors duration-200">
          <CalendarTodayIcon className="text-blue-500 text-xl mr-2 flex-shrink-0" />
          <div className="flex text-gray-600 flex-col w-full">
            <label className="text-[#48A0ff] font-semibold text-xs ">RETURN DATE<span className="text-[10px] ml-2 text-gray-600 mb-1">(Optional)</span></label>
            
            <CalendarForm
              onDateChange={handleReturnDateChange}
              disabledDates={date ? [date] : []}
            />
          </div>
        </div>

        <div className="flex items-center max-lg:col-span-2 bg-white max-lg:border-none p-3 hover:bg-gray-50 transition-colors duration-200">
          <ConfirmationNumberIcon className="text-blue-500 text-xl mr-2 flex-shrink-0" />
          <div className="flex text-gray-600 flex-col w-full">
            <label className="text-[#48A0ff] font-semibold text-xs mb-1">PASSENGERS</label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                max="10"
                value={ticketQuantity}
                onChange={handleTicketQuantityChange}
                placeholder="1"
                className="border-none outline-none bg-transparent w-full text-gray-700 font-medium"
              />
              <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                {ticketQuantity === 1 ? 'passenger' : 'passengers'}
              </span>
            </div>
          </div>
        </div>
      </form>
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className={`flex items-center w-full h-full rounded-r-[1pc] max-lg:rounded-none justify-center text-white border-none p-4 cursor-pointer font-semibold text-lg transition-all duration-200 ${
          isFormValid && !isLoading
            ? 'bg-[#48A0ff] hover:bg-[#3d8ae6] shadow-md hover:shadow-lg'
            : 'bg-gray-600 cursor-not-allowed opacity-60'
        }`}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Searching...
          </>
        ) : (
          <>
            <SearchIcon className="mr-2" />
            Search Trips
          </>
        )}
      </button>
    </div>
  );
}