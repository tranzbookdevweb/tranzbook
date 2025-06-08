import { Karla } from 'next/font/google'
import './globals.css'

import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';

const karla = Karla({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ['latin'],
  variable: "--font-karla"
})

export const metadata: Metadata = {
  title: "TranzBook",
  description: "bus login/signip",
  icons:{
    icon:'/pictures/logo.png',
  }
}
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={karla.className + ' h-screen '}>

          <>
          <Toaster/>
     {children}
          </>
      </body>
    </html>
  )
}
