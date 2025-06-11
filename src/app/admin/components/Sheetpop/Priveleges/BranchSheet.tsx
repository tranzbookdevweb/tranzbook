'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

type Company = {
  id: string;
  name: string;
};

async function fetchCompanies() {
  try {
    const response = await fetch('/api/GET/getbusCompany');
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
}

function BranchSheet({ onAddSuccess }: { onAddSuccess: () => void }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const companiesData = await fetchCompanies();
      setCompanies(companiesData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !address || !city || !companyId) {
      setError('Name, address, city, and company are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/POST/Branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          city,
          companyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data received:', data);
      
      // Reset form
      setName('');
      setAddress('');
      setCity('');
      setCompanyId('');
      
      onAddSuccess();
      alert('Branch added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add Branch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className='flex items-center'>
        <Button className='text-[12px] bg-[#48A0FF] py-2 h-fit'>
          <PlusCircle className='mr-1' size={12} /> Add
        </Button>
      </SheetTrigger>
      <SheetContent className='z-[999]'>
        <ScrollArea className="h-full max-h-full w-full rounded-md border p-5">
          <SheetHeader>
            <SheetTitle>Add Branch</SheetTitle>
            <SheetDescription>Click save when you&apos;re done.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="Name" className="text-left">Name</Label>
                <Input
                  id="Name"
                  placeholder="Branch Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="Address" className="text-left">Address</Label>
                <Input
                  id="Address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="City" className="text-left">City</Label>
                <Input
                  id="City"
                  placeholder="Enter city name"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="CompanyId" className="text-left">Company</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999]">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Save changes'}
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default BranchSheet;