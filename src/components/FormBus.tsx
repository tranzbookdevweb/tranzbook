"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRightLeft, Calendar, MapPin, Search, User, ChevronDown, ChevronUp, Circle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { ComboboxForm } from "./ComboBox"
import { CalendarForm } from "./Calendar"

export default function FormBus() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleFromLocationSelect = (location: string) => {
    setFromLocation(location)
    if (location === toLocation) {
      setToLocation("")
    }
  }

  const handleToLocationSelect = (location: string) => {
    setToLocation(location)
    if (location === fromLocation) {
      setFromLocation("")
    }
  }

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate)
    if (selectedDate && returnDate && selectedDate.getTime() >= returnDate.getTime()) {
      setReturnDate(null)
    }
  }

  const handleReturnDateChange = (selectedReturnDate: Date | null) => {
    setReturnDate(selectedReturnDate)
  }

  const handleSwapLocations = () => {
    const temp = fromLocation
    setFromLocation(toLocation)
    setToLocation(temp)
  }

  const validateForm = () => {
    if (!fromLocation) {
      toast({
        title: "Missing departure location",
        description: "Please select a departure location",
        variant: "destructive",
      })
      return false
    }

    if (!toLocation) {
      toast({
        title: "Missing destination",
        description: "Please select a destination",
        variant: "destructive",
      })
      return false
    }

    if (!date) {
      toast({
        title: "Missing departure date",
        description: "Please select a departure date",
        variant: "destructive",
      })
      return false
    }

    if (ticketQuantity <= 0) {
      toast({
        title: "Invalid ticket quantity",
        description: "Please select at least 1 ticket",
        variant: "destructive",
        action: (
          <ToastAction altText="Set to 1" onClick={() => setTicketQuantity(1)}>
            Set to 1
          </ToastAction>
        ),
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const query = {
      fromLocation,
      toLocation,
      date: date ? date.toISOString() : "",
      returnDate: returnDate ? returnDate.toISOString() : "",
      ticketQuantity,
    }

    const queryString = new URLSearchParams({
      ...query,
      ticketQuantity: ticketQuantity.toString(),
    }).toString()

    toast({
      title: "Search initiated",
      description: `Searching for trips from ${fromLocation} to ${toLocation}`,
    })

    setTimeout(() => {
      router.push(`/search?${queryString}`)
      setIsLoading(false)
    }, 500)
  }

  const handleTicketQuantityChange = (increment: boolean) => {
    if (increment && ticketQuantity < 30) {
      setTicketQuantity(ticketQuantity + 1)
    } else if (!increment && ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1)
    }
  }

  const isFormValid = fromLocation && toLocation && date && ticketQuantity > 0

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg">
        {/* Desktop Layout - Hidden on tablet and mobile */}
        <div className="hidden lg:flex">
          {/* Form Fields Container */}
          <div className="flex items-center gap-2 p-4 flex-1">
            {/* From Location */}
            <div className="flex items-center gap-3 w-52">
              <Circle className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleFromLocationSelect}
                  disabledOptions={[toLocation]}
                  locationType="Select Origin"
                  value={fromLocation}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors flex-shrink-0 mx-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* To Location */}
            <div className="flex items-center gap-3 w-52">
              <MapPin className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleToLocationSelect}
                  disabledOptions={[fromLocation]}
                  locationType="Select Destination"
                  value={toLocation}
                />
              </div>
            </div>

            {/* Departure Date */}
            <div className="flex items-center gap-3 w-52">
              <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm onDateChange={handleDateChange} calendarType="departure" />
              </div>
            </div>

            {/* Return Date */}
            <div className="flex items-center gap-3 w-52">
              <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm
                  onDateChange={handleReturnDateChange}
                  disabledDates={date ? [date] : []}
                  calendarType="return"
                />
              </div>
            </div>

            {/* Passenger Count */}
            <div className="flex items-center gap-3 w-20">
              <User className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-gray-700 font-medium min-w-[1.5rem] text-center">{ticketQuantity}</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(true)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={ticketQuantity >= 30}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(false)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={ticketQuantity <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button Container */}
          <div className="flex items-stretch">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex items-center gap-2 px-8 rounded-2xl text-white font-semibold transition-all duration-200 h-full ${
                isFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tablet Layout - Hidden on desktop and mobile */}
        <div className="hidden md:block lg:hidden p-4 space-y-4">
          {/* First Row: From Location and To Location */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Circle className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleFromLocationSelect}
                  disabledOptions={[toLocation]}
                  locationType="Select Origin"
                  value={fromLocation}
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <MapPin className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <ComboboxForm
                  onLocationSelect={handleToLocationSelect}
                  disabledOptions={[fromLocation]}
                  locationType="Select Destination"
                  value={toLocation}
                />
              </div>
            </div>
          </div>

          {/* Second Row: Dates, Passengers, and Search */}
          <div className="flex items-center gap-4">
            {/* Departure Date */}
            <div className="flex items-center gap-3 flex-1">
              <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm onDateChange={handleDateChange} calendarType="departure" />
              </div>
            </div>

            {/* Return Date */}
            <div className="flex items-center gap-3 flex-1">
              <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm
                  onDateChange={handleReturnDateChange}
                  disabledDates={date ? [date] : []}
                  calendarType="return"
                />
              </div>
            </div>

            {/* Passenger Count */}
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-gray-700 font-medium min-w-[1.5rem] text-center">{ticketQuantity}</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(true)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={ticketQuantity >= 30}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(false)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={ticketQuantity <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Layout - Hidden on tablet and desktop */}
        <div className="block md:hidden p-4 space-y-4">
          {/* First Row: From Location */}
          <div className="flex items-center gap-3">
            <Circle className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <ComboboxForm
                onLocationSelect={handleFromLocationSelect}
                disabledOptions={[toLocation]}
                locationType="Select Origin"
                value={fromLocation}
              />
            </div>
            {/* Swap Button on mobile - positioned to the right */}
            <button
              type="button"
              onClick={handleSwapLocations}
              className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Second Row: To Location */}
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <ComboboxForm
                onLocationSelect={handleToLocationSelect}
                disabledOptions={[fromLocation]}
                locationType="Select Destination"
                value={toLocation}
              />
            </div>
          </div>

          {/* Third Row: Departure Date and Return Date */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm onDateChange={handleDateChange} calendarType="departure" />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1">
              <Calendar className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <CalendarForm
                  onDateChange={handleReturnDateChange}
                  disabledDates={date ? [date] : []}
                  calendarType="return"
                />
              </div>
            </div>
          </div>

          {/* Fourth Row: Passengers and Search */}
          <div className="flex items-center gap-4">
            {/* Passenger Count */}
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-orange-400 flex-shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-gray-700 font-medium min-w-[1.5rem] text-center">{ticketQuantity}</span>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(true)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={ticketQuantity >= 30}
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(false)}
                    className="w-6 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={ticketQuantity <= 1}
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Button - takes remaining space */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-200 flex-1 ${
                isFormValid && !isLoading
                  ? "bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}