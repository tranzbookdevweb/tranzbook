'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
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
  disabledOptions?: string[]; // Array of options to disable
  locationType: 'FROM' | 'TO'; // New prop to indicate the type of location
}

export function ComboboxForm({ onLocationSelect, disabledOptions = [], locationType }: ComboboxFormProps) {
  const [open, setOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<Location[]>([]); // Ensure initial value is an empty array
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Fetch locations from API
  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/GET/getLocation');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          console.error('Unexpected API response structure:', data);
          setLocations([]); // Fallback to an empty array if data is not as expected
        }      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (location: string) => {
    const foundLocation = locations.find((loc) => loc.name === location) || null;
    setSelectedLocation(foundLocation);
    setOpen(false);
    onLocationSelect(location); // Call the callback function with the name of the selected location
  };

  // Set custom placeholders based on the location type
  const placeholder =
    locationType === 'FROM'
      ? selectedLocation?.name || 'Markola Accra'
      : selectedLocation?.name || 'Kejetia Market';

  return (
    <div className="flex items-center w-full space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full cursor-pointer">
            {selectedLocation ? (
              <>{selectedLocation.name}</>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-[99] bg-white text-[#fdb022] font-semibold" side="top" align="start">
          <Command>
            <CommandInput placeholder="Choose Location" />
            <CommandList>
              {loading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : (
                <>
                  {locations.length === 0 ? (
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
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
