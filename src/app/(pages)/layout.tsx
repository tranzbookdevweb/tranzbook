import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tranzbook",
  description: "Book your transportation with ease",
  icons: {
    icon: "/pictures/logo.png", // Path to your logo file in the public directory
    apple: "/pictures/logo.png", // For Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel="icon" href="/pictures/logo.png" />
        <link rel="apple-touch-icon" href="/pictures/logo.png" />
      </head>
      <body
        className={cn(
          "h-full m-0 w-full font-sans antialiased",
          inter.className
        )}>
          <Navbar />
          <Toaster />
          {children}
          <Footer />
      </body>
    </html>
  );
}