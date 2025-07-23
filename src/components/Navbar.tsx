"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/lib/auth"
import { CampaignOutlined, Work } from "@mui/icons-material"
import DirectionsBusFilledOutlinedIcon from "@mui/icons-material/DirectionsBusFilledOutlined"
import { ChevronDown, HelpCircleIcon, Truck, ArrowRight, Menu, Users, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { useNavigation, ButtonType } from "@/context/NavigationContext"

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
}

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { activeButton, setActiveButton } = useNavigation()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isHomePage = pathname === "/"

  // Convert context ButtonType to service type for compatibility
  const activeService = activeButton === ButtonType.Bus ? "bus" : "truck"

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
      setIsSheetOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleServiceChange = (service: "bus" | "truck") => {
    const buttonType = service === "bus" ? ButtonType.Bus : ButtonType.Cargo
    setActiveButton(buttonType)

    // If not on homepage, navigate to homepage
    if (!isHomePage) {
      router.push("/")
    }
  }

  const getDisplayName = (): string => {
    if (user?.displayName) return user.displayName
    if (user?.email) return user.email.split("@")[0]
    if (user?.phoneNumber) return user.phoneNumber
    return "User"
  }

  const closeMobileMenu = () => {
    setIsSheetOpen(false)
  }

  const navigationItems = [
    {
      href: "/about-us",
      label: "About Us",
      icon: Users,
      description: "Learn more about our story",
    },
    {
      href: "/contact-us",
      label: "Contact Us",
      icon: Phone,
      description: "Get in touch with our team",
    },
  ]

  const resourceItems = [
    {
      href: "/blog",
      label: "Blog",
      icon: CampaignOutlined,
      description: "Latest insights & updates",
      bgColor: "from-orange-100 to-orange-200",
      iconBgColor: "bg-orange-100 group-hover:bg-orange-200",
      textColor: "text-orange-600 group-hover:text-orange-700",
    },
    {
      href: "/career",
      label: "Careers",
      icon: Work,
      description: "Join our growing team",
      bgColor: "from-blue-100 to-blue-200",
      iconBgColor: "bg-blue-100 group-hover:bg-blue-200",
      textColor: "text-blue-600 group-hover:text-blue-700",
    },
    {
      href: "/faq",
      label: "FAQ",
      icon: HelpCircleIcon,
      description: "Get quick answers",
      bgColor: "from-green-100 to-green-200",
      iconBgColor: "bg-green-100 group-hover:bg-green-200",
      textColor: "text-green-600 group-hover:text-green-700",
    },
  ]

  return (
    <div className="w-full sticky top-0 z-[99999] left-0 right-0 h-[80px] bg-[#def5fb] border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="group">
              <div className="relative overflow-hidden rounded-xl p-2 transition-all duration-300 group-hover:bg-white/50 group-hover:shadow-lg group-hover:scale-105">
                <img
                  src="/logoalt.png"
                  width={100}
                  height={40}
                  alt="Logo"
                  className="h-8 w-auto sm:h-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
          </div>

          {/* Service Toggle - Always Visible & Responsive */}
          <div className="flex-shrink-0">
            <div className="flex items-center h-[36px] sm:h-[40px] border border-orange-400 rounded-full p-0.5 bg-white/30 backdrop-blur-sm shadow-sm">
              {/* Bus Button */}
              <button
                onClick={() => handleServiceChange("bus")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 lg:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm ${
                  activeService === "bus"
                    ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-white/50"
                }`}
              >
                <DirectionsBusFilledOutlinedIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="hidden xs:inline sm:inline">Bus</span>
              </button>

              {/* Divider */}
              <div className="w-px h-4 sm:h-5 bg-gray-400 mx-0.5 sm:mx-1"></div>

              {/* Truck Button */}
              <button
                onClick={() => handleServiceChange("truck")}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 lg:px-5 py-1 sm:py-1.5 rounded-full transition-all duration-200 font-semibold text-xs sm:text-sm ${
                  activeService === "truck"
                    ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-white/50"
                }`}
              >
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-400" />
                <span className="hidden xs:inline sm:inline">Trucks</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation & User Section */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link
                href="/about-us"
                className="text-[#475467] font-semibold hover:text-gray-800 transition-colors duration-200 relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-1 text-[#475467] font-semibold hover:text-gray-800 transition-colors duration-200 focus:outline-none group">
                    <span>Resources</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="bg-white border border-gray-200 shadow-xl rounded-xl p-2 min-w-[280px] mt-2"
                >
                  {resourceItems.map((item) => (
                    <DropdownMenuItem key={item.href} className="p-0 focus:bg-transparent">
                      <Link
                        href={item.href}
                        className="group w-full px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center font-medium text-gray-700 hover:text-gray-900"
                      >
                        <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-gray-100 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                          <item.icon className="text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/contact-us"
                className="text-[#475467] font-semibold hover:text-gray-800 transition-colors duration-200 relative group"
              >
                Contact Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4 pl-6 border-l border-gray-300">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs text-[#475467] font-light">Welcome back,</p>
                    <p className="text-sm font-semibold text-gray-800 -mt-0.5">{getDisplayName()}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0 group">
                        <div className="relative">
                          <img
                            className="w-10 h-10 rounded-full border-2 border-gray-200 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:scale-105"
                            src={
                              user.photoURL ||
                              `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName()) || "/placeholder.svg"}`
                            }
                            alt="User Profile"
                            width={40}
                            height={40}
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="min-w-[260px] bg-white border border-gray-200 shadow-xl rounded-xl p-2"
                    >
                      <DropdownMenuLabel className="px-3 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            className="w-10 h-10 rounded-full border border-gray-200"
                            src={
                              user.photoURL ||
                              `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName()) || "/placeholder.svg"}`
                            }
                            alt="User Profile"
                            width={40}
                            height={40}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[160px]">
                              {user.email || user.phoneNumber || "No contact info"}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 my-2" />
                      <DropdownMenuItem asChild className="p-0">
                        <Link
                          href="/my-journeys"
                          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          My Journeys
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="p-0">
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-700 justify-start"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 border border-blue-600 hover:border-blue-700 shadow-sm"
                  >
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile User Profile & Menu */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile User Profile (when logged in) */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 group">
                    <div className="relative">
                      <img
                        className="w-8 h-8 rounded-full border-2 border-blue-200 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-lg group-hover:scale-105"
                        src={
                          user.photoURL ||
                          `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName()) || "/placeholder.svg"}`
                        }
                        alt="User Profile"
                        width={32}
                        height={32}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[240px] z-[9999] bg-white border border-gray-200 shadow-xl rounded-lg p-2"
                >
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        className="w-8 h-8 rounded-full border border-gray-200"
                        src={
                          user.photoURL ||
                          `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName()) || "/placeholder.svg"}`
                        }
                        alt="User Profile"
                        width={32}
                        height={32}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">
                          {user.email || user.phoneNumber || "No contact info"}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 my-2" />
                  <DropdownMenuItem asChild className="p-0">
                    <Link
                      href="/my-journeys"
                      className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      My Journeys
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-700 justify-start"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-blue-600 hover:bg-white/30 hover:text-blue-700 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-2xl z-[999999] overflow-y-scroll p-0 border-0 bg-white backdrop-blur-xl"
              >
                {/* Header Section */}
                <div className="relative bg-[#0066ff] p-6 pb-8">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img src="/logoalt.png" className="h-8 w-auto" width={50} height={20} alt="Logo" />
                      </div>
                    </div>
                    {user && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <img
                            className="w-12 h-12 rounded-full border-2 border-white/30"
                            src={
                              user.photoURL ||
                              `https://avatar.vercel.sh/${encodeURIComponent(getDisplayName()) || "/placeholder.svg"}`
                            }
                            alt="User Profile"
                            width={48}
                            height={48}
                          />
                          <div>
                            <p className="text-white font-semibold">{getDisplayName()}</p>
                            <p className="text-blue-100 text-sm truncate">
                              {user.email || user.phoneNumber || "Welcome back!"}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400/20 rounded-full blur-lg"></div>
                </div>

                {/* Content Section */}
                <div className="px-6 py-6 space-y-8">
                  {/* Navigation Section */}
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 transition-all duration-300 hover:bg-white/80 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                      ))}

                      {/* Resources Accordion */}
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="resources" className="border-0">
                          <AccordionTrigger className="group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 hover:bg-white/80 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] hover:no-underline">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-left text-gray-900 group-hover:text-orange-600 transition-colors">
                                  Resources
                                </p>
                                <p className="text-sm text-gray-500">Explore our resources</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="mt-2 space-y-2">
                            {resourceItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`group flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100/50 transition-all duration-300 hover:bg-gradient-to-r hover:${item.bgColor} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div
                                    className={`w-8 h-8 ${item.iconBgColor} rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300`}
                                  >
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p
                                      className={`font-semibold text-gray-900 group-hover:${item.textColor} transition-colors`}
                                    >
                                      {item.label}
                                    </p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                  </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                              </Link>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>

                  {/* User Account or Auth Section */}
                  {user ? (
                    <div>
                      <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full mr-3"></div>
                        My Account
                      </h3>
                      <div className="space-y-3">
                        <Link
                          href="/my-journeys"
                          onClick={closeMobileMenu}
                          className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-green-800">My Journeys</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                        <Button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 text-red-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                          variant="ghost"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">Logout</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                        Get Started
                      </h3>
                      <div className="space-y-4">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full h-14 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] bg-transparent"
                          onClick={closeMobileMenu}
                        >
                          <Link href="/login">Login to Your Account</Link>
                        </Button>
                        <Button
                          asChild
                          variant="default"
                          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] border-0"
                          onClick={closeMobileMenu}
                        >
                          <Link href="/signup">Create New Account</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}
