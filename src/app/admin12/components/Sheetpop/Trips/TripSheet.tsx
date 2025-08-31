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
import { Checkbox } from "@/components/ui/checkbox";

// Type Definitions
type Bus = {
  id: string;
  name?: string;
  plateNumber?: string;
  busDescription: string;
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

type Currency = "GHS" | "USD" | "EUR" | "NGN";

type CommissionType = "FIXED" | "PERCENTAGE";

type TripForm = {
  date?: string | null;
  recurring: boolean;
  daysOfWeek: number[];
  price: number;
  currency: Currency;
  commission: number;
  commissionType: CommissionType;
  departureTime: string;
  busId: string;
  routeId: string;
  driverId?: string | null;
};

type Props = { onAddSuccess: () => void };

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

function TripSheet({ onAddSuccess }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [tripData, setTripData] = useState<TripResponse>({
    buses: [],
    routes: [],
    drivers: [],
  });

  // Form state
  const [departureTime, setDepartureTime] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>("GHS");
  const [commission, setCommission] = useState<number>(0);
  const [commissionType, setCommissionType] = useState<CommissionType>("FIXED");
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [driverId, setDriverId] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
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

  const handleDayOfWeekToggle = (day: number) => {
    setDaysOfWeek(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!departureTime || price === undefined || !busId || !routeId) {
      setError("All fields are required.");
      return;
    }

    if (!recurring && (!date || !driverId)) {
      setError("Date and Driver are required for non-recurring trips.");
      return;
    }

    if (recurring && daysOfWeek.length === 0) {
      setError("Please select at least one day of the week for recurring trips.");
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
          recurring,
          daysOfWeek: recurring ? daysOfWeek : [],
          departureTime,
          price,
          currency,
          commission,
          commissionType,
          busId,
          routeId,
          driverId,
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
              {/* Recurring Trip Toggle */}
              <div className="grid grid-cols-1 items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="recurring" 
                    checked={recurring} 
                    onCheckedChange={() => setRecurring(!recurring)} 
                  />
                  <Label htmlFor="recurring">Recurring Trip</Label>
                </div>
              </div>
              {/* Days of Week for Recurring Trips */}
              {recurring && (
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label>Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day.value}`} 
                          checked={daysOfWeek.includes(day.value)} 
                          onCheckedChange={() => handleDayOfWeekToggle(day.value)} 
                        />
                        <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Date for One-Time Trip */}
              {!recurring && (
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label>Date</Label>
                  <CalendarDate onDateChange={handleDateChange} />
                </div>
              )}
              {/* Departure Time */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Departure Time</Label>
                <Input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </div>
              {/* Price */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              {/* Currency */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    <SelectItem value="GHS">GHS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Commission */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Commission</Label>
                <Input
                  type="number"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                />
              </div>
              {/* Commission Type */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Commission Type</Label>
                <Select 
                  value={commissionType} 
                  onValueChange={(value: CommissionType) => setCommissionType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select commission type" />
                  </SelectTrigger>
                  <SelectContent className="z-[999]">
                    <SelectItem value="FIXED">Fixed</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Bus */}
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
                          {bus.busDescription} ({bus.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {/* Route */}
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Route</Label>
                {routes.length === 0 ? (
                  <p>No available routes</p>
                ) : (
                  <Select value={routeId} onValueChange={setRouteId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a route" />
                    </SelectTrigger>
                    <SelectContent className="z-[999]">
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.startCity} - {route.endCity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {/* Driver (for non-recurring trips) */}
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