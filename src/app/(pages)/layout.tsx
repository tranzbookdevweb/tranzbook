import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          "h-full m-0 w-full font-sans antialiased",
          inter.className
        )}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem>
          <Navbar />
          <Toaster />
           {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
