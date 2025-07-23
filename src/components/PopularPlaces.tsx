"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

// Define the type for location items
interface LocationItem {
  id?: string
  image: string
  from: string
  to: string
}

export function PopularPlace() {
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchPopularRoutes() {
      try {
        const response = await fetch("/api/GET/getPopRoutes")

        if (!response.ok) {
          throw new Error("Failed to fetch routes")
        }

        const data = await response.json()
        setLocations(data.routes)
        setIsLoading(false)
      } catch (error: unknown) {
        console.error("Error fetching routes:", error)
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    fetchPopularRoutes()
  }, [])

  // Calculate the next day's date
  const nextDayDate = new Date()
  nextDayDate.setDate(nextDayDate.getDate() + 1)
  const formattedNextDayDate = nextDayDate.toISOString()

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Destinations</h2>
            <p className="text-gray-600 text-lg">These destinations are popular among travelers like you.</p>
          </div>

          {/* Loading Skeleton */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-2xl h-64 mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || locations.length === 0) {
    return (
      <div className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations available</h3>
            <p className="text-gray-600">Check back later for popular routes and destinations.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top Destinations</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            These destinations are popular among travelers like you.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="destinations-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {(showAll ? locations : locations.slice(0, 9)).map((location, index) => (
            <Link
              key={location.id || index}
              href={{
                pathname: "/search",
                query: {
                  fromLocation: location.from,
                  toLocation: location.to,
                  date: formattedNextDayDate,
                  returnDate: "",
                  ticketQuantity: 1,
                },
              }}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
                {/* Background Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={location.image || "/placeholder.svg?height=256&width=400&query=destination"}
                    alt={`Route from ${location.from} to ${location.to}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="text-white">
                      <p className="text-sm font-medium text-white/80 mb-1">Buses From</p>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {location.from} to {location.to}
                      </h3>

                      {/* Action Indicator */}
                      <div className="flex items-center text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="text-sm font-medium mr-2">View Routes</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Border Effect */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-blue-500/20 transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More/Less Button */}
        {locations.length > 9 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {showAll ? "Show Less" : "View All Destinations"}
              <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
