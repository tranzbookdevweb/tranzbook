"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type BusType = {
  id: string;
  name: string;
  plateNumber: string;
  busType: string;
  imageUrl: string;
  companyId: string;
};

type TripData = {
  id: string;
  date: string;
  price: number;
  busId: string;
  routeId: string;
  startLocationId: string;
  endLocationId: string;
  duration: number;
  distance: number;
  companyId: string;
};

type CompanyData = {
  id: string;
  name: string;
  email: string;
  logoUrl?: string;
};

type Route = {
  id: string;
  startLocationId: string;
  endLocationId: string;
};

type LocationType = {
  id: string;
  name: string;
};

type ExtendedTripData = TripData & {
  startLocationName: string;
  endLocationName: string;
  busType: string;
  formattedDate: string;
  logoUrl?: string;
  imageUrl?: string;
};

interface SearchContextType {
  searchResults: ExtendedTripData[];
  setSearchResults: React.Dispatch<React.SetStateAction<ExtendedTripData[]>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode; }) => {
  const [searchResults, setSearchResults] = useState<ExtendedTripData[]>([]);

  return (
    <SearchContext.Provider value={{ searchResults , setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
