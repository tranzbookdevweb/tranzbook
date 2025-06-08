import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { ServerNavbar } from "@/components/NavbarServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tranzbook",
    template: "%s | Tranzbook", // For dynamic page titles
  },
  description: "Book transportation services easily with Tranzbook. Find buses, trains, and more with real-time availability and secure payments.",
  icons: {
    icon: "/pictures/logo.png",
    apple: "/pictures/logo.png",
  },
  robots: {
    index: true, // Allow indexing
    follow: true, // Allow following links
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.tranzbook.com", // Replace with your domain
  },
  openGraph: {
    title: "Tranzbook",
    description: "Book transportation services easily with Tranzbook.",
    url: "https://www.tranzbook.com",
    siteName: "Tranzbook",
    images: [
      {
        url: "/pictures/logo.png",
        width: 800,
        height: 600,
        alt: "Tranzbook Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tranzbook",
    description: "Book transportation services easily with Tranzbook.",
    images: ["/pictures/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "h-full m-0 w-full font-sans antialiased",
          inter.className
        )}
      >
        <ServerNavbar />
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}