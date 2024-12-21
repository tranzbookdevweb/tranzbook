// Type definitions for the models
type Bus = {
  id: string;  // Matches the id type from Prisma model (String, UUID)
  plateNumber: string;
  capacity: number;
  busModel: string;
  status: string; // Default value is "available"
  image?: string; // Optional image URL
  companyId: string; // Foreign key reference to BusCompany
  trips: Trip[]; // Array of trips associated with this bus
  airConditioning: boolean;  // Boolean for air conditioning
  chargingOutlets: boolean;  // Boolean for charging outlets
  wifi: boolean;  // Boolean for Wi-Fi
  restRoom: boolean;  // Boolean for restroom availability
  seatBelts: boolean;  // Boolean for seat belts availability
  onboardFood: boolean;  // Boolean for onboard food
};

type BusCompany = {
  id: string;
  name: string;
};

type Branch = {
  id: string;
  name: string;
  companyId: string;  // Foreign key reference to BusCompany
};

type Trip = {
  id: string;
  // Add any necessary fields for the Trip model
};

// Props for BusSheet component
type Props = {
  onAddSuccess: () => void;
};

// BusSheet component implementation
import React, { useState, useEffect } from 'react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
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
import { ScrollArea } from '@/components/ui/scroll-area';

function BusSheet({ onAddSuccess }: Props) {
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [busModel, setBusModel] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState('');
  const [busCompanies, setBusCompanies] = useState<BusCompany[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Boolean extras state
  const [airCondition, setAirCondition] = useState(false);
  const [chargingOutlets, setChargingOutlets] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [restRoom, setRestRoom] = useState(false);
  const [seatBelts, setSeatBelts] = useState(false);
  const [onboardFood, setOnboardFood] = useState(false);

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

    if ( !capacity || !companyId || !image) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('plateNumber', plateNumber);
      formData.append('capacity', capacity.toString());
      formData.append('busModel', busModel);
      formData.append('companyId', companyId);
      formData.append('image', image);

      // Append all the boolean extras
      formData.append('airConditioning', airCondition.toString());
      formData.append('chargingOutlets', chargingOutlets.toString());
      formData.append('wifi', wifi.toString());
      formData.append('restRoom', restRoom.toString());
      formData.append('seatBelts', seatBelts.toString());
      formData.append('onboardFood', onboardFood.toString());

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
        <ScrollArea className="h-full max-h-full w-full rounded-md border p-5">
          <SheetHeader>
            <SheetTitle>Add Bus</SheetTitle>
            <SheetDescription>Click save when you are done.</SheetDescription>
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
                <Label htmlFor="busModel" className="text-left">
                  Bus Model
                </Label>
                <Input
                  id="busModel"
                  placeholder="Bus Type"
                  value={busModel}
                  onChange={(e) => setBusModel(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="image" className="text-left">
                  Image
                </Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
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
                <Select
                  value={branchId}
                  onValueChange={(value) => setBranchId(value)}
                  disabled={!companyId}
                >
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

              <div className="space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={airCondition}
                    onChange={() => setAirCondition(!airCondition)}
                  />
                  <span className="ml-2">Air Conditioning</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={chargingOutlets}
                    onChange={() => setChargingOutlets(!chargingOutlets)}
                  />
                  <span className="ml-2">Charging Outlets</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wifi}
                    onChange={() => setWifi(!wifi)}
                  />
                  <span className="ml-2">Wi-Fi</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={restRoom}
                    onChange={() => setRestRoom(!restRoom)}
                  />
                  <span className="ml-2">Restroom</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={seatBelts}
                    onChange={() => setSeatBelts(!seatBelts)}
                  />
                  <span className="ml-2">Seat Belts</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={onboardFood}
                    onChange={() => setOnboardFood(!onboardFood)}
                  />
                  <span className="ml-2">Onboard Food</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="submit"
                  className="py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Save Bus'}
                </Button>
                <SheetClose>
                  Cancel
                </SheetClose>
              </div>
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default BusSheet;
