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
  startCityName: string;
  endCityName: string;
};

type Driver = { id: string; firstName: string; lastName: string };

type Company = { id: string; name: string };

type TripForm = {
  id: string;
  date?: string | null;
  recurring: boolean;
  price: number;
  departureTime: string;
  busId: string;
  routeId: string;
  driverId?: string | null;
  bus: Bus;
  route: Route;
  driver?: Driver | null;
};

type Props = { onAddSuccess: () => void };

function TripSheet({ onAddSuccess }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [tripData, setTripData] = useState<TripForm[]>([]);
  const [departureTime, setDepartureTime] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [driverId, setDriverId] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch companies from the API
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

  // Fetch trip data based on the selected companyId
  useEffect(() => {
    if (!companyId) return;

    async function fetchTripData() {
      try {
        const response = await fetch(`/api/GET/getTripForm?companyId=${companyId}`);
        if (!response.ok) throw new Error("Failed to fetch trip data");
        const data: TripForm[] = await response.json();
        setTripData(data);
      } catch (err) {
        console.error(err);
        setError("Error loading trip data");
      }
    }

    fetchTripData();
  }, [companyId]);

  // Extract unique buses, routes, and drivers from tripData
  const buses = Array.from(new Map(tripData.map((trip) => [trip.bus.id, trip.bus])).values());
  const routes = Array.from(new Map(tripData.map((trip) => [trip.route.id, trip.route])).values());
  const drivers = Array.from(
    new Map(
      tripData
        .filter((trip) => trip.driver)
        .map((trip) => [trip.driver!.id, trip.driver!])
    ).values()
  );

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
                  <SelectContent>
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
                <Select value={busId} onValueChange={setBusId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.busModel} ({bus.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Route</Label>
                <Select value={routeId} onValueChange={setRouteId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.startCityName} - {route.endCityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!recurring && (
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label>Driver</Label>
                  <Select value={driverId ?? ""} onValueChange={setDriverId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.firstName} {driver.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
