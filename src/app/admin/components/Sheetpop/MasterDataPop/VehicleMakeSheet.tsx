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

type BusCompany = {
  id: string;
  name: string;
};

type Branch = {
  id: string;
  name: string;
  companyId: string;  // Foreign key reference to BusCompany
};

type Props = {
  onAddSuccess: () => void;
};

function BusSheet({ onAddSuccess }: Props) {
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [busDescription, setBusDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
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
  const [onArrival, setOnArrival] = useState(false); // New state for onArrival

  useEffect(() => {
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
      const filtered = branches.filter(branch => branch.companyId === companyId);
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches([]);
    }
  }, [companyId, branches]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!capacity || !companyId || !image || (onArrival && plateNumber)) {
      setError('All fields are required, and plate number should not be entered if the bus is on arrival.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('plateNumber', onArrival ? '' : plateNumber); // Skip plate number if onArrival is true
      formData.append('capacity', capacity.toString());
      formData.append('busDescription', busDescription);
      formData.append('companyId', companyId);
      formData.append('image', image);

      formData.append('airConditioning', airCondition.toString());
      formData.append('chargingOutlets', chargingOutlets.toString());
      formData.append('wifi', wifi.toString());
      formData.append('restRoom', restRoom.toString());
      formData.append('seatBelts', seatBelts.toString());
      formData.append('onboardFood', onboardFood.toString());
      formData.append('onArrival', onArrival.toString());

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
            {!onArrival && (
                <>
                  <div className="grid grid-cols-1 items-center gap-4">
                    <Label htmlFor="plateNumber" className="text-left">
                      Plate Number
                    </Label>
                    <Input id="plateNumber" type="text" />
                  </div>
                  
                </>
              )}
              <div className="grid grid-cols-1 items-center gap-4">
                    <Label htmlFor="busDescription" className="text-left">
                      Bus Model
                    </Label>
                    <Input
                     name="busDescription"
                      id="busDescription"
                       type="text"
                       value={busDescription}
                       onChange={(e) => setBusDescription(e.target.value)} />
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


              <div className="space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={onArrival}
                    onChange={() => setOnArrival((prev) => !prev)}
                    className="mr-2"
                  />
                  <Label htmlFor="onArrival" className="text-left">
                    On Arrival (Set as available)
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 items-center gap-4">
                <Label className="text-left">Bus Features</Label>
                <div className="space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={airCondition}
                      onChange={() => setAirCondition((prev) => !prev)}
                      className="mr-2"
                    />
                    <Label>Air Conditioning</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={chargingOutlets}
                      onChange={() => setChargingOutlets((prev) => !prev)}
                      className="mr-2"
                    />
                    <Label>Charging Outlets</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wifi}
                      onChange={() => setWifi((prev) => !prev)}
                      className="mr-2"
                    />
                    <Label>Wi-Fi</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={restRoom}
                      onChange={() => setRestRoom((prev) => !prev)}
                      className="mr-2"
                    />
                    <Label>Rest Room</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={seatBelts}
                      onChange={() => setSeatBelts((prev) => !prev)}
                      className="mr-2"
                    />
                    <Label>Seat Belts</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={onboardFood}
                      onChange={() => setOnboardFood((prev) => !prev)}
                      className="mr-2"
                    />
                    <Label>Onboard Food</Label>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="space-x-4 mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Save Bus'}
                </Button>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
              </div>
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default BusSheet;
