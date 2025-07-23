import Link from "next/link"

interface PartnerLogo {
  id: number
  href: string
  src: string
  alt: string
  name: string
}

const partnerLogos: PartnerLogo[] = [
  { id: 1, href: "#", src: "/partners/stc.png", alt: "STC Transport Logo", name: "STC" },
  { id: 2, href: "#", src: "/partners/royalvvip.png", alt: "Royal VVIP Transport Logo", name: "Royal VVIP" },
  { id: 3, href: "#", src: "/partners/geoexpress.png", alt: "Geo Express Transport Logo", name: "Geo Express" },
  {
    id: 4,
    href: "#",
    src: "/partners/africaeagle.png",
    alt: "Africa Eagle Transport Logo",
    name: "Africa Eagle Transport",
  },
  { id: 5, href: "#", src: "/partners/oa.png", alt: "O.A Transport Logo", name: "O.A" },
  { id: 6, href: "#", src: "/partners/jeounvip.png", alt: "Jeoun VIP Transport Logo", name: "Jeoun VIP" },
  { id: 7, href: "#", src: "/partners/chisco.png", alt: "Chisco Transport Logo", name: "Chisco" },
  { id: 8, href: "#", src: "/partners/neoplan.png", alt: "Neoplan VIP Transport Logo", name: "Neoplan VIP" },
  { id: 9, href: "#", src: "/partners/abc.png", alt: "ABC Transport Logo", name: "ABC Transport" },
]

export default function PartnersSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">You&apos;ll be in good company</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by leading transport companies across the region
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {partnerLogos.map((logo) => (
            <Link
              key={logo.id}
              href={logo.href}
              className="group relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 transition-all duration-300 ease-in-out md:hover:shadow-xl md:hover:border-gray-200 md:hover:scale-105 md:hover:-translate-y-1 active:scale-95 active:shadow-sm"
            >
              {/* Logo Container */}
              <div className="flex items-center justify-center h-12 sm:h-16 md:h-20">
                <img
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain transition-all duration-300 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Partner Name - Always visible on mobile, overlay on desktop */}
              <div className="mt-2 sm:mt-3 lg:mt-0 lg:absolute lg:inset-x-0 lg:bottom-0 lg:bg-gradient-to-t lg:from-black/80 lg:via-black/40 lg:to-transparent lg:rounded-b-2xl lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300 lg:pointer-events-none">
                <p className="text-gray-700 lg:text-white text-xs sm:text-sm font-medium text-center py-1 lg:py-3 px-2">
                  {logo.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">Want to become a partner?</p>
          <Link
            href="/contact-us"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Join Our Network
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4 4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
