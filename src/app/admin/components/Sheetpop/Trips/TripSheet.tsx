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
import { CalendarDate } from './Calendar';
import { ScrollArea } from '@/components/ui/scroll-area';

type Bus = {
  id: string;
  name: string;
  plateNumber: string;
  busModel: string;
};

type Route = {
  id: string;
  startCityId: string;
  endCityId: string;
  startCityName: string;
  endCityName: string;
};

type Location = {
  id: string;
  name: string;
};

type Driver = {
  id: string;
  firstName: string;
  lastName: string;
};

type Branch = {
  id: string;
  name: string;
};

type Props = {
  onAddSuccess: () => void;
};

async function fetchBuses() {
  try {
    const response = await fetch('/api/GET/getBusesAvailable');
    if (!response.ok) {
      throw new Error('Failed to fetch buses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching buses:', error);
    return [];
  }
}

async function fetchRoutes() {
  try {
    const response = await fetch('/api/GET/getRoute');
    if (!response.ok) {
      throw new Error('Failed to fetch routes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching routes:', error);
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

async function fetchDrivers() {
  try {
    const response = await fetch('/api/GET/getDriversAvailable');
    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
}

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

function TripSheet({ onAddSuccess }: Props) {
  const [date, setDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [price, setPrice] = useState(0);
  const [busId, setBusId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [busesData, routesData, locationsData, driversData, branchesData] = await Promise.all([
        fetchBuses(),
        fetchRoutes(),
        fetchLocations(),
        fetchDrivers(),
        fetchBranches()
      ]);
      setBuses(busesData);
      setLocations(locationsData);
      setDrivers(driversData);
      setBranches(branchesData);

      const mappedRoutes = routesData.map((route: Route) => ({
        ...route,
        startCityName: locationsData.find((loc: Location) => loc.id === route.startCityId)?.name || '',
        endCityName: locationsData.find((loc: Location) => loc.id === route.endCityId)?.name || '',
      }));
      setRoutes(mappedRoutes);
    };

    fetchData();
  }, []);

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(selectedDate.toISOString());
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!date || !departureTime || !price || !busId || !routeId || !driverId || !branchId) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/POST/Trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, departureTime, price, busId, routeId, driverId, branchId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data received:', data);
      onAddSuccess();
      alert('Trip added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add trip.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="flex items-center">
        <Button className="text-[12px] bg-[#48A0FF] py-2 h-fit">
          <PlusCircle className="mr-1" size={12} /> Add Trip
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999]">
               <ScrollArea className="h-full max-h-full w-full rounded-md border p-5">
 <SheetHeader>
          <SheetTitle>Add Trip</SheetTitle>
          <SheetDescription>Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="date" className="text-left">
                Date
              </Label>
              <CalendarDate onDateChange={handleDateChange} />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="departureTime" className="text-left">
                Departure Time
              </Label>
              <Input
                id="departureTime"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="price" className="text-left">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="busId" className="text-left">
                Bus
              </Label>
              <Select value={busId} onValueChange={setBusId} disabled={buses.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={buses.length === 0 ? 'No buses available' : 'Select a bus'} />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.busModel} ({bus.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="routeId" className="text-left">
                Route
              </Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.startCityName} to {route.endCityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="driverId" className="text-left">
                Driver
              </Label>
              <Select value={driverId} onValueChange={setDriverId} disabled={drivers.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={drivers.length === 0 ? 'No drivers available' : 'Select a driver'} />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="branchId" className="text-left">
                Branch
              </Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <div className="text-red-600 text-sm mt-2">
                <p>{error}</p>
              </div>
            )}
            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Adding...' : 'Add Trip'}
              </Button>
            </div>
          </div>
        </form></ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default TripSheet;
