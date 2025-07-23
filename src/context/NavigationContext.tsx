"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export enum ButtonType {
  Bus = "bus",
  Cargo = "truck",
}

interface NavigationContextType {
  activeButton: ButtonType
  setActiveButton: (button: ButtonType) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeButton, setActiveButton] = useState<ButtonType>(ButtonType.Bus)

  return <NavigationContext.Provider value={{ activeButton, setActiveButton }}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
