"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CampaignOutlined, WorkOutlineOutlined, } from "@mui/icons-material"
import { HelpCircleIcon, ChevronDown } from "lucide-react"
import Link from "next/link"

export function ResourcesToggle() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative text-blue-600 font-medium text-sm tracking-wide transition-all duration-300 hover:text-blue-700 group flex items-center space-x-1 focus:outline-none">
          <span className="relative z-10">Resources</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="center" 
        className="z-[999] bg-white/95 backdrop-blur-md border border-blue-100 shadow-xl rounded-xl p-2 min-w-[200px] mt-2"
      >
        <DropdownMenuItem className="p-0 focus:bg-transparent">
          <Link 
            href='/blog' 
            className="group w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-200 hover:shadow-md flex items-center font-medium text-gray-700 hover:text-orange-700"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
              <CampaignOutlined className="text-sm" />
            </div>
            <div>
              <p className="font-semibold text-sm">Blog</p>
              <p className="text-xs text-gray-500 group-hover:text-orange-600">Latest insights & updates</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 focus:bg-transparent">
          <Link 
            href='/career' 
            className="group w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:shadow-md flex items-center font-medium text-gray-700 hover:text-blue-700"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
              <WorkOutlineOutlined className="text-sm" />
            </div>
            <div>
              <p className="font-semibold text-sm">Careers</p>
              <p className="text-xs text-gray-500 group-hover:text-blue-600">Join our growing team</p>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 focus:bg-transparent">
          <Link 
            href='/faq' 
            className="group w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-green-200 hover:shadow-md flex items-center font-medium text-gray-700 hover:text-green-700"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
              <HelpCircleIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">FAQ</p>
              <p className="text-xs text-gray-500 group-hover:text-green-600">Get quick answers</p>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}