"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { useState, createContext, useContext } from "react"

interface ServiceContextType {
  activeService: "bus" | "truck"
  setActiveService: (service: "bus" | "truck") => void
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export const useService = () => {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error("useService must be used within a ServiceProvider")
  }
  return context
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [activeService, setActiveService] = useState<"bus" | "truck">("bus")

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ServiceContext.Provider value={{ activeService, setActiveService }}>
        <Navbar user={null} activeService={activeService} onServiceChange={setActiveService} />
        {children}
        <Footer />
        <Toaster />
      </ServiceContext.Provider>
    </ThemeProvider>
  )
}
