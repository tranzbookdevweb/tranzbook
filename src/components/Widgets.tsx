"use client"

import type React from "react"
import DirectionsBusFilledOutlinedIcon from "@mui/icons-material/DirectionsBusFilledOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import CompareArrowsIcon from "@mui/icons-material/CompareArrows"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface Widget {
  icon: React.FC // Type for MUI icon component
  title: string
  subtitle: string
}

interface Props {
  activeButton: "bus" | "truck" // Accept activeButton as a prop
}

// Updated widgets data for "bus" matching the new UI exactly
const busWidgets: Widget[] = [
  {
    icon: DirectionsBusFilledOutlinedIcon,
    title: "Traveling Across Ghana?",
    subtitle: "Book safe and comfortable buses to any region in Ghana with ease. Just TranzBook it.",
  },
  {
    icon: CompareArrowsIcon,
    title: "Cross-Border Trips from Ghana?",
    subtitle: "Get quick access to rides to Nigeria, Togo, Benin, Côte d'Ivoire, Burkina Faso and more.",
  },
  {
    icon: SupportAgentIcon,
    title: "24/7 Dedicated Support",
    subtitle: "Need help anytime? Our friendly support team is always here to assist you day or night.",
  },
]

// Widgets data for "truck"
const truckWidgets: Widget[] = [
  {
    icon: LocalShippingOutlinedIcon,
    title: "Sending Cargo Across Ghana?",
    subtitle: "Find secure, reliable, and fast cargo services to any region in Ghana. TranzBook it and relax.",
  },
  {
    icon: CompareArrowsIcon,
    title: "Shipping Beyond Ghana?",
    subtitle:
      "Easily send cargo to destinations like Nigeria, Togo, Benin, Burkina Faso, Côte d'Ivoire, Mali, and more.",
  },
  {
    icon: SupportAgentIcon,
    title: "24/7 Support for Your Logistics Needs",
    subtitle: "Our dedicated team is always ready to assist you with your cargo queries.",
  },
]

function Widgets({ activeButton }: Props) {
  const { theme } = useTheme()
  // Select the appropriate widgets based on the active button
  const widgets = activeButton === "bus" ? busWidgets : truckWidgets

  return (
    <motion.div initial={{ x: -550 }} animate={{ x: 0 }} transition={{ duration: 2.5 }} className="w-full px-4 py-10">
      <div className="max-w-7xl -mt-16 mx-auto">
        <div
          className={`grid gap-6 w-full ${
            activeButton === "bus"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {widgets.map((widget) => (
            <div
              key={widget.title}
              className={`flex shadow-[#48a0ff5c] shadow-lg flex-col h-[280px] ${
                theme === "dark" ? "bg-slate-700" : "bg-white"
              } rounded-xl p-6 w-full transition-transform hover:scale-105 duration-300`}
            >
              <div
                className={`text-white bg-[#48A0fF] w-fit rounded-2xl p-4 mb-4 ${theme === "dark" ? "text-black" : ""}`}
              >
                <widget.icon />
              </div>
              <div className="flex-1 flex flex-col">
                <h4
                  className={`mb-3 ${
                    theme === "dark" ? "text-white" : "text-black"
                  } font-semibold text-lg leading-tight`}
                >
                  {widget.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed flex-1 ${theme === "dark" ? "text-gray-300" : "text-[#475467]"}`}
                >
                  {widget.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Widgets
