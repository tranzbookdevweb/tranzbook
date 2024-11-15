import React from 'react';

type Props = {};

const partnerLogos = [
  { id: 1, href: '#', src: '/partners/stc.png', alt: 'STC' },
  { id: 2, href: '#', src: '/partners/royalvvip.png', alt: 'Royal VVIP' },
  { id: 3, href: '#', src: '/partners/geoexpress.png', alt: 'Geo Express' },
  { id: 4, href: '#', src: '/partners/africaeagle.png', alt: 'Africa Eagle Transport' },
  { id: 5, href: '#', src: '/partners/oa.png', alt: 'O.A' },
  { id: 6, href: '#', src: '/partners/jeounvip.png', alt: 'Jeoun VIP' },
  { id: 7, href: '#', src: '/partners/chisco.png', alt: 'Chisco' },
  { id: 8, href: '#', src: '/partners/neoplan.png', alt: 'Neoplan VIP' },
  { id: 9, href: '#', src: '/partners/abc.png', alt: 'ABC Transport' },
];

function Partner({}: Props) {
  return (
    <section className="bg-white dark:bg-gray-900 py-12 lg:py-20 px-4 mx-auto max-w-screen-xl">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-12 md:text-5xl">
        You’ll be in good company
      </h2>
      <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-3 lg:grid-cols-6">
        {partnerLogos.map((logo) => (
          <a
            key={logo.id}
            href={logo.href}
            className="flex justify-center items-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:opacity-90"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-12 md:h-16 object-contain transition-transform duration-300 ease-in-out"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

export default Partner;
