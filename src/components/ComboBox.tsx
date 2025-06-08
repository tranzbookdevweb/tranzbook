'use client';
import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Location {
  id: string;
  name: string;
}

interface ComboboxFormProps {
  onLocationSelect: (location: string) => void;
  disabledOptions?: string[];
  locationType: 'Select Origin' | 'Select Destination';
}

export function ComboboxForm({
  onLocationSelect,
  disabledOptions = [],
  locationType,
}: ComboboxFormProps) {
  const [open, setOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch locations from API only once on mount
  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/GET/getLocation', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response: Data is not an array');
        }

        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations. Please try again.');
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []); // Empty dependency array ensures this runs only once

  const handleLocationSelect = (locationName: string) => {
    const foundLocation = locations.find((loc) => loc.name === locationName) || null;
    setSelectedLocation(foundLocation);
    setOpen(false);
    onLocationSelect(locationName);
  };

  const placeholder =
    locationType === 'Select Origin'
      ? selectedLocation?.name || 'Select Origin'
      : selectedLocation?.name || 'Select Destination';

  return (
    <div className="flex items-center w-full space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full cursor-pointer">
            {selectedLocation ? (
              <span>{selectedLocation.name}</span>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 z-[99] bg-white text-[#fdb022] font-semibold"
          side="top"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Choose Location" />
            <CommandList>
              {loading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : error ? (
                <CommandEmpty>{error}</CommandEmpty>
              ) : locations.length === 0 ? (
                <CommandEmpty>No locations found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {locations
                    .filter((location) => !disabledOptions.includes(location.name))
                    .map((location) => (
                      <CommandItem
                        key={location.id}
                        value={location.name}
                        onSelect={() => handleLocationSelect(location.name)}
                      >
                        {location.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}