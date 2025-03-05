'use client';

import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScaleIcon from '@mui/icons-material/Scale';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PanoramaFishEyeRounded from '@mui/icons-material/PanoramaFishEyeRounded';
import { useRouter } from 'next/navigation';
import { ComboboxForm } from './ComboBox';
import { CalendarForm } from './Calendar';
import { toast } from './ui/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogFooter 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function FormCargo() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [cargoWeight, setCargoWeight] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [agroPrefinancing, setAgroPrefinancing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState<'book' | 'prefinance' | null>(null);

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

  const validateForm = () => {
    const errors = [];
    if (!fromLocation) errors.push("From location is required");
    if (!toLocation) errors.push("To location is required");
    if (!productDescription) errors.push("Product description is required");

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, type: 'book' | 'prefinance') => {
    e.preventDefault();
    setSubmissionType(type);

    if (!validateForm()) return;

    try {
      const response = await fetch('/api/POST/postCargo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromLocation,
          toLocation,
          date: date ? date.toISOString() : undefined,
          cargoWeight,
          productDescription,
          locationDescription,
          agroPrefinancing: type === 'prefinance'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit cargo form');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: "Cargo form submitted successfully",
        variant: "default"
      });
      
      // Open success dialog
      setIsDialogOpen(true);
      
      // Reset form
      resetForm();

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFromLocation('');
    setToLocation('');
    setDate(null);
    setCargoWeight('');
    setProductDescription('');
    setLocationDescription('');
    setAgroPrefinancing(false);
  };

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e, 'book')} className="space-y-4 p-4 max-w-4xl mx-auto">
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
                type="number"
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value)}
                placeholder="1500 kg"
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

        <div className="flex flex-col space-y-4">
          <Button 
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e as any, 'prefinance')}
            className="w-full font-semibold bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
            >
            Apply for Agro-Prefinancing
          </Button>
          <Button 
            type="submit"
            className="w-full font-semibold bg-blue-500 dark:bg-blue-700 text-white rounded p-3 hover:bg-blue-600 dark:hover:bg-blue-800"
            >
            Book
          </Button>
        </div>
      </form>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-lg text-blue-600'>
              {submissionType === 'prefinance' 
                ? 'Agro-Prefinancing Application Received' 
                : 'Cargo Booking Submitted'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              We have received your {submissionType === 'prefinance' 
                ? 'agro-prefinancing application' 
                : 'cargo booking'}. Our team will get back to you shortly. 
              We appreciate your patience and will process your request as quickly as possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}