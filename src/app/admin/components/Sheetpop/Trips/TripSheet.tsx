import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarDate } from "./Calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Type Definitions
type Bus = {
  id: string;
  name?: string;
  plateNumber?: string;
  busModel: string;
  capacity: number;
};

type Route = {
  id: string;
  startCityId: string;
  endCityId: string;
  startCity: string;
  endCity: string;
};

type Driver = { id: string; firstName: string; lastName: string };

type Company = { id: string; name: string };

type TripResponse = {
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
};

type TripForm = {
  date?: string | null;
  recurring: boolean;
  price: number;
  departureTime: string;
  busId: string;
  routeId: string;
  driverId?: string | null;
};

type Props = { onAddSuccess: () => void };

function TripSheet({ onAddSuccess }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [tripData, setTripData] = useState<TripResponse>({
    buses: [],
    routes: [],
    drivers: [],
  });

  const [departureTime, setDepartureTime] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [driverId, setDriverId] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/GET/getbusCompany");
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data: Company[] = await response.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
        setError("Error loading companies");
      }
    }
    fetchCompanies();
  }, []);

  // Fetch trip data
  useEffect(() => {
    if (!companyId) return;

    async function fetchTripData() {
      try {
        const response = await fetch(`/api/GET/getTripForm?companyId=${companyId}`);
        if (!response.ok) throw new Error("Failed to fetch trip data");
        const data: TripResponse = await response.json();
        setTripData(data);
      } catch (err) {
        console.error(err);
        setError("Error loading trip data");
      }
    }
    fetchTripData();
  }, [companyId]);

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate ? selectedDate.toISOString() : null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!departureTime || !price || !busId || !routeId) {
      setError("All fields are required.");
      return;
    }

    if (!recurring && (!date || !driverId)) {
      setError("Date and Driver are required for non-recurring trips.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/POST/Trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          departureTime,
          price,
          busId,
          routeId,
          driverId,
          recurring,
        }),
      });

      if (!response.ok) throw new Error("Failed to add trip");
      onAddSuccess();
      alert("Trip added successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to add trip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { buses, routes, drivers } = tripData;
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
            <SheetDescription>Fill out the details below and save.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Company Selector */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Company</Label>
                <Select value={companyId ?? ""} onValueChange={setCompanyId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Recurring Trip</Label>
                <Input
                  type="checkbox"
                  checked={recurring}
                  onChange={() => setRecurring(!recurring)}
                />
              </div>
              {!recurring && (
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label>Date</Label>
                  <CalendarDate onDateChange={handleDateChange} />
                </div>
              )}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Departure Time</Label>
                <Input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
  <Label>Bus</Label>
  {buses.length === 0 ? (
    <p>No available buses</p>
  ) : (
    <Select value={busId} onValueChange={setBusId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a bus" />
      </SelectTrigger>
      <SelectContent className="z-[999]">
        {buses.map((bus) => (
          <SelectItem key={bus.id} value={bus.id}>
            {bus.busModel} ({bus.capacity})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
</div>

<div className="grid grid-cols-1 items-center gap-4">
  <Label>Route</Label>
  {routes.length === 0 ? (
    <p>No available routes</p>
  ) : (
    <Select value={routeId} onValueChange={setRouteId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a route" />
      </SelectTrigger>
      <SelectContent  className="z-[999]">
        {routes.map((route) => (
          <SelectItem key={route.id} value={route.id}>
            {route.startCity} - {route.endCity}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
</div>

{!recurring && (
  <div className="grid grid-cols-1 items-center gap-4">
    <Label>Driver</Label>
    {drivers.length === 0 ? (
      <p>No available drivers</p>
    ) : (
      <Select value={driverId ?? ""} onValueChange={setDriverId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a driver" />
        </SelectTrigger>
        <SelectContent className="z-[999]">
          {drivers.map((driver) => (
            <SelectItem key={driver.id} value={driver.id}>
              {driver.firstName} {driver.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </div>
)}

            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default TripSheet;
