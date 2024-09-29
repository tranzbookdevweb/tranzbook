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

function BusSheet({ onAddSuccess }: Props) {
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [busType, setBusType] = useState('');
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState('');
  const [busCompanies, setBusCompanies] = useState<BusCompany[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the list of bus companies
    const fetchBusCompanies = async () => {
      try {
        const response = await fetch('/api/GET/getbusCompany');
        if (!response.ok) {
          throw new Error('Failed to fetch bus companies');
        }
        const data = await response.json();
        setBusCompanies(data);
      } catch (error) {
        console.error('Error fetching bus companies:', error);
      }
    };

    // Fetch the list of branches
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/GET/getBranches');
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBusCompanies();
    fetchBranches();
  }, []);

  useEffect(() => {
    if (companyId) {
      // Filter branches based on the selected company
      const filtered = branches.filter(branch => branch.companyId === companyId);
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches([]);
    }
  }, [companyId, branches]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!plateNumber || !capacity || !busType || !companyId|| !imageUrl) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('plateNumber', plateNumber);
      formData.append('capacity', capacity.toString());
      formData.append('busType', busType);
      formData.append('companyId', companyId);
      formData.append('imageUrl', imageUrl);

      const response = await fetch('/api/POST/vehicleMake', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data received:', data);
      onAddSuccess();
      alert('Bus added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add bus.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="flex items-center">
        <Button className="text-[12px] bg-[#48A0FF] py-2 h-fit">
          <PlusCircle className="mr-1" size={12} /> Add Bus
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999]">
        <SheetHeader>
          <SheetTitle>Add Bus</SheetTitle>
          <SheetDescription>Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="plateNumber" className="text-left">
                Plate Number
              </Label>
              <Input
                id="plateNumber"
                placeholder="Plate Number"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="capacity" className="text-left">
                Capacity
              </Label>
              <Input
                id="capacity"
                placeholder="Capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="busType" className="text-left">
                Bus Type
              </Label>
              <Input
                id="busType"
                placeholder="Bus Type"
                value={busType}
                onChange={(e) => setBusType(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-left">
                Image
              </Label>
              <Input
                id="imageUrl"
                type="file"
                onChange={(e) => setImageUrl(e.target.files?.[0] ?? null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="company" className="text-left">
                Company
              </Label>
              <Select value={companyId ?? ''} onValueChange={(value) => setCompanyId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className='z-[99999]'>
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
              <Select value={branchId} onValueChange={setBranchId} disabled={!companyId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className='z-[99999]'>
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

export default BusSheet;
