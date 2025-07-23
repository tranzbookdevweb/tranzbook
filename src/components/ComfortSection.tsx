import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ComfortPrioritySection() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400 py-16 ">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#123C7B] mb-6">
              Your Comfort, Our Priority.
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Imagine planning your trip without ever leaving your home. With TranZBook, you can find and book the best
              buses right from your couch, saving yourself the hassle of crowded bus stations. Wherever you&apos;re headed,
              just pull out your phone or laptop, and let TranZBook bring the journey to you.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold rounded-[8px] transition-all duration-300 bg-transparent"
            >
              <Link href="/about-us">Learn more</Link>
            </Button>

            <Button
              asChild
              variant="default"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[8px] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
