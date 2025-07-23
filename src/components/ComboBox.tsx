"use client"

import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Location {
  id: string
  name: string
}

interface ComboboxFormProps {
  onLocationSelect: (location: string) => void
  disabledOptions?: string[]
  locationType: "Select Origin" | "Select Destination"
  value?: string // Add value prop to make it controlled
}

export function ComboboxForm({ onLocationSelect, disabledOptions = [], locationType, value = "" }: ComboboxFormProps) {
  const [open, setOpen] = React.useState(false)
  const [locations, setLocations] = React.useState<Location[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/GET/getLocation", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.statusText}`)
        }

        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response: Data is not an array")
        }

        setLocations(data)
      } catch (error) {
        console.error("Error fetching locations:", error)
        setError("Failed to load locations. Please try again.")
        setLocations([])
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const handleLocationSelect = (locationName: string) => {
    setOpen(false)
    onLocationSelect(locationName)
  }

  const getPrefix = () => {
    return locationType === "Select Origin" ? "From:" : "To:"
  }

  const getDisplayText = () => {
    const prefix = getPrefix()
    if (value) {
      return `${prefix} ${value}`
    }
    return `${prefix} ${locationType === "Select Origin" ? "Origin" : "Destination"}`
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full text-left text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer p-2 rounded-md hover:bg-gray-50"
          >
            {value ? (
              <span className="text-gray-800 font-medium">{getDisplayText()}</span>
            ) : (
              <span className="text-gray-500">{getDisplayText()}</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 z-[99] bg-white w-64" side="bottom" align="start">
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
  )
}
