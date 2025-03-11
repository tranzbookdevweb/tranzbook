'use client';

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BusFront, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CompanyData = {
  id: string;
  name: string;
  email?: string;
  logo?: string;
};

interface BookingFilterAccordionProps {
  onCompanyFilterChange: (companies: string[]) => void;
  onTimeFilterChange: (time: string) => void;
  companyData: CompanyData[];
}

export function BookingFilterAccordion({
  onCompanyFilterChange,
  onTimeFilterChange,
  companyData,
}: BookingFilterAccordionProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartureTime, setSelectedDepartureTime] = useState<string>('');

  const handleCompanyChange = (company: string) => {
    setSelectedCompanies((prevCompanies) => {
      const updatedCompanies = prevCompanies.includes(company)
        ? prevCompanies.filter((comp) => comp !== company)
        : [...prevCompanies, company];

      onCompanyFilterChange(updatedCompanies);
      return updatedCompanies;
    });
  };

  const handleDepartureTimeChange = (time: string) => {
    const newTime = selectedDepartureTime === time ? "" : time;
    setSelectedDepartureTime(newTime);
    onTimeFilterChange(newTime);
  };

  const timeOptions = [
    { value: 'morning', label: 'Morning', icon: <Sunrise className="h-4 w-4" /> },
    { value: 'afternoon', label: 'Afternoon', icon: <Sun className="h-4 w-4" /> },
    { value: 'evening', label: 'Evening', icon: <Sunset className="h-4 w-4" /> },
    { value: 'night', label: 'Night', icon: <Moon className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Filter Your Trip</h2>
      
      <Accordion type="multiple" className="w-full">
        {/* Company Filter */}
        <AccordionItem value="company" className="border rounded-md mb-2 overflow-hidden">
          <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-2 text-gray-700">
              <BusFront className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Bus Operators</span>
              {selectedCompanies.length > 0 && (
                <Badge className="ml-2 bg-blue-500">{selectedCompanies.length}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="grid gap-2">
              {companyData.map((company) => (
                <div
                  key={company.id}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    selectedCompanies.includes(company.id)
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`company-${company.id}`}
                    value={company.id}
                    checked={selectedCompanies.includes(company.id)}
                    onChange={() => handleCompanyChange(company.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`company-${company.id}`}
                    className={`ml-3 cursor-pointer flex-1 font-medium ${
                      selectedCompanies.includes(company.id) ? 'text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {company.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Departure Time Filter */}
        <AccordionItem value="departure-time" className="border rounded-md overflow-hidden">
          <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-2 text-gray-700">
              <Sunrise className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Departure Time</span>
              {selectedDepartureTime && (
                <Badge className="ml-2 bg-amber-500 capitalize">{selectedDepartureTime}</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="grid grid-cols-2 gap-2">
              {timeOptions.map((time) => (
                <div
                  key={time.value}
                  onClick={() => handleDepartureTimeChange(time.value)}
                  className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${
                    selectedDepartureTime === time.value
                      ? 'bg-amber-50 border border-amber-200 shadow-sm'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className={`mr-3 p-2 rounded-full ${
                    selectedDepartureTime === time.value 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {time.icon}
                  </div>
                  <span className={`font-medium ${
                    selectedDepartureTime === time.value ? 'text-amber-700' : 'text-gray-700'
                  }`}>
                    {time.label}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {(selectedCompanies.length > 0 || selectedDepartureTime) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSelectedCompanies([]);
              setSelectedDepartureTime('');
              onCompanyFilterChange([]);
              onTimeFilterChange('');
            }}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}