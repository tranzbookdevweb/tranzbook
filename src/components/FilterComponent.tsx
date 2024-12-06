'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DepartureBoard } from "@mui/icons-material";
import { BusFront, Moon, Stars, Sun, Sunrise, Sunset } from "lucide-react";
import { useEffect, useState } from "react";

type CompanyData = {
  id: string;
  name: string;
  email: string;
  logo?: string;
};

interface BookingFilterAccordionProps {
  onCompanyFilterChange: (companies: string[]) => void;
  onTimeFilterChange: (time: string) => void;
}

export function BookingFilterAccordion({
  onCompanyFilterChange,
  onTimeFilterChange,
}: BookingFilterAccordionProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedDepartureTime, setSelectedDepartureTime] = useState<string>('');
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);

  const handleCompanyChange = (company: string) => {
    setSelectedCompanies((prevCompanies) => {
      const updatedCompanies = prevCompanies.includes(company)
        ? prevCompanies.filter((comp) => comp !== company)
        : [...prevCompanies, company];

      onCompanyFilterChange(updatedCompanies); // Trigger prop function
      return updatedCompanies;
    });
  };

  const handleDepartureTimeChange = (time: string) => {
    if (selectedDepartureTime === time) {
      setSelectedDepartureTime("");  // Deselect if already selected
    } else {
      setSelectedDepartureTime(time);
    }
    onTimeFilterChange(time); // Trigger prop function
  };

  const fetchData = async () => {
    try {
      const companyResponse = await fetch('/api/GET/getbusCompany');
      if (!companyResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const companyData = await companyResponse.json();
      setCompanyData(Array.isArray(companyData) ? companyData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Accordion type="multiple" className="w-full items-center">
      <h1 className="font-semibold text-gray-300 text-[18px]">Filter Trip</h1>
      
      {/* Company Filter */}
      <AccordionItem value="company">
        <AccordionTrigger className="flex justify-between p-2">
          <div className="flex items-center">
            <BusFront />
            Bus Operator
          </div>
        </AccordionTrigger>
        <AccordionContent className="w-full">
          <div className="grid grid-cols-1 p-2 gap-3">
            {companyData.map((company) => (
              <label
                className={`items-center flex ${selectedCompanies.includes(company.id) ? 'bg-blue-200' : ''}`}
                key={company.id}
              >
                <input
                  type="checkbox"
                  value={company.id}
                  checked={selectedCompanies.includes(company.id)}
                  onChange={() => handleCompanyChange(company.id)}
                  className="mr-2"
                />
                <h2 className={`font-semibold ml-2 ${selectedCompanies.includes(company.id) ? 'text-blue-600' : 'text-[#48A0FF]'}`}>
                  {company.name}
                </h2>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Departure Time Filter */}
      <AccordionItem value="departure-time">
        <AccordionTrigger className="flex justify-between p-2">
          <div className="flex items-center">
            <DepartureBoard />
            Departure Time
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 p-2 gap-3 items-center">
            {['morning', 'afternoon', 'evening', 'night'].map((time) => (
              <label
                key={time}
                className={`font-semibold flex items-center ${
                  selectedDepartureTime === time ? 'text-blue-600' : ''
                }`}
              >
                <input
                  type="radio"
                  name="departureTime"
                  value={time}
                  checked={selectedDepartureTime === time}
                  onChange={() => handleDepartureTimeChange(time)}
                  className="mr-2"
                />
                {time === 'morning' && <Sunrise size={16} className="ml-2" />}
                {time === 'afternoon' && <Sun size={16} className="ml-2" />}
                {time === 'evening' && <Moon size={16} className="ml-2" />}
                {time === 'night' && <Stars size={16} className="ml-2" />}
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
