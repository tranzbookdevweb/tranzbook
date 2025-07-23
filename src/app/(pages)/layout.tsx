import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/Footer"
import { NavigationProvider } from "@/context/NavigationContext"
import { ServerNavbar } from "@/components/NavbarServer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tranzbook",
  description: "Book bus tickets and cargo services online",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NavigationProvider>
            <ServerNavbar />
            <main>{children}</main>
            <Footer />
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
