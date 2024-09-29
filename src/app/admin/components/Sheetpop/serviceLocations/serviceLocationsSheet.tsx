import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type Location = {
  id: string;
  name: string;
};

type Branch = {
  id: string;
  name: string;
  companyId: string;
};

type BusCompany = {
  id: string;
  name: string;
};

type Props = {
  onAddSuccess: () => void;
};

async function fetchBranches() {
  try {
    const response = await fetch('/api/GET/getBranches');
    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}

async function fetchLocations() {
  try {
    const response = await fetch('/api/GET/getLocation');
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

async function fetchBusCompanies() {
  try {
    const response = await fetch('/api/GET/getbusCompany');
    if (!response.ok) {
      throw new Error('Failed to fetch bus companies');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bus companies:', error);
    return [];
  }
}

function ServiceLocation({ onAddSuccess }: Props) {
  const [startLocationId, setStartLocationId] = useState('');
  const [endLocationId, setEndLocationId] = useState('');
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [branchId, setBranchId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [busCompanies, setBusCompanies] = useState<BusCompany[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch branches, locations, and bus companies
    const fetchData = async () => {
      const [branchesData, locationsData, companiesData] = await Promise.all([
        fetchBranches(),
        fetchLocations(),
        fetchBusCompanies()
      ]);
      setBranches(branchesData);
      setLocations(locationsData);
      setBusCompanies(companiesData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      // Filter branches based on the selected company
      const filtered = branches.filter(branch => branch.companyId === selectedCompany);
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches([]);
    }
  }, [selectedCompany, branches]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!startLocationId || !endLocationId || !duration || !distance || !branchId) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/POST/busRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startLocationId, endLocationId, duration, distance, branchId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data received:', data);
      onAddSuccess();
      alert('Route added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add route.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="flex items-center">
        <Button className="text-[12px] bg-[#48A0FF] py-2 h-fit">
          <PlusCircle className="mr-1" size={12} /> Add Route
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999]">
        <SheetHeader>
          <SheetTitle>Add Route</SheetTitle>
          <SheetDescription>Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="startLocationId" className="text-left">
                Start Location
              </Label>
              <Select value={startLocationId} onValueChange={setStartLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a start location" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="endLocationId" className="text-left">
                End Location
              </Label>
              <Select value={endLocationId} onValueChange={setEndLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an end location" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="duration" className="text-left">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                placeholder="Duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="distance" className="text-left">
                Distance (kilometers)
              </Label>
              <Input
                id="distance"
                placeholder="Distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="company" className="text-left">
                Company
              </Label>
              <Select value={selectedCompany ?? ''} onValueChange={(value) => setSelectedCompany(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {busCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="branchId" className="text-left">
                Branch
              </Label>
              <Select value={branchId} onValueChange={setBranchId} disabled={!selectedCompany}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {filteredBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
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
      </SheetContent>
    </Sheet>
  );
}

export default ServiceLocation;
