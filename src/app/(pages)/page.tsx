"use client"
import Bus from '@/components/homeNavbuttons/Bus';
import Cargo from '@/components/homeNavbuttons/Cargo';
import React, { useState, useEffect } from 'react';
import Widgets from '../../components/Widgets';
import Why from '../../components/Why';
import { useTheme } from "next-themes"
import Faq from '../../components/Faq';
import Partner from '@/components/Partner';
import { PopularPlace } from '@/components/PopularPlaces';
import { Helmet } from 'react-helmet';
import TranzbookBusLoader from './Busloader';

type Props = {}

enum ButtonType {
    'Bus' = 'Bus',
    'Cargo' = 'Cargo',
}

export default function UpperHome({}: Props) {
  const { theme } = useTheme();
  const [activeButton, setActiveButton] = useState<ButtonType>(ButtonType.Bus);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Tracks loader completion
  const [showLoader, setShowLoader] = useState(false); // Tracks if loader should be shown

  // Check sessionStorage for initial load and handle hydration
  useEffect(() => {
    // Check if loader has been shown in this session
    const hasLoaderBeenShown = sessionStorage.getItem('loaderShown');
    if (hasLoaderBeenShown) {
      setShowLoader(false);
      setIsLoading(false); // Skip loader if already shown
    } else {
      setShowLoader(true); // Show loader for first load
    }
    setMounted(true); // Mark as mounted for hydration
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('loaderShown', 'true'); // Mark loader as shown
    setIsLoading(false); // Loader is done
  };

  const handleButtonClick = (button: ButtonType) => {
    setActiveButton(button);
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tranzbook",
    "url": "https://www.tranzbook.co/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.tranzbook.co/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const busServiceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Tranzbook Bus Booking",
    "description": "Book bus tickets online for multiple routes with convenient scheduling options.",
    "provider": {
      "@type": "Organization",
      "name": "Tranzbook",
      "url": "https://www.tranzbook.co"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Multiple Locations"
    }
  };

  const cargoServiceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Tranzbook Cargo Services",
    "description": "Schedule cargo deliveries with real-time tracking and secure handling.",
    "provider": {
      "@type": "Organization",
      "name": "Tranzbook",
      "url": "https://www.tranzbook.co"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Multiple Locations"
    }
  };

  // Show loader only if it's the first load, not mounted, or still loading
  if (!mounted || (showLoader && isLoading)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <TranzbookBusLoader onComplete={handleLoaderComplete} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{activeButton === ButtonType.Bus ? 'Tranzbook - Online Bus Booking' : 'Tranzbook - Cargo Delivery Services'}</title>
        <meta name="description" content={activeButton === ButtonType.Bus ? 
          "Book bus tickets online for multiple routes. Safe, comfortable, and affordable travel options with Tranzbook." : 
          "Schedule cargo deliveries with real-time tracking. Secure and reliable cargo services with Tranzbook."} 
        />
        <meta name="keywords" content={activeButton === ButtonType.Bus ? 
          "bus booking, online tickets, bus travel, transportation services" : 
          "cargo delivery, package shipping, freight services, logistics"} 
        />
        <link rel="canonical" href="https://www.tranzbook.co/" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={activeButton === ButtonType.Bus ? 'Tranzbook - Online Bus Booking' : 'Tranzbook - Cargo Delivery Services'} />
        <meta property="og:description" content={activeButton === ButtonType.Bus ? 
          "Book bus tickets online for multiple routes. Safe, comfortable, and affordable travel options with Tranzbook." : 
          "Schedule cargo deliveries with real-time tracking. Secure and reliable cargo services with Tranzbook."} 
        />
        <meta property="og:url" content="https://www.tranzbook.co/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.tranzbook.co/og-image.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activeButton === ButtonType.Bus ? 'Tranzbook - Online Bus Booking' : 'Tranzbook - Cargo Delivery Services'} />
        <meta name="twitter:description" content={activeButton === ButtonType.Bus ? 
          "Book bus tickets online for multiple routes. Safe, comfortable, and affordable travel options with Tranzbook." : 
          "Schedule cargo deliveries with real-time tracking. Secure and reliable cargo services with Tranzbook."} 
        />
        <meta name="twitter:image" content="https://www.tranzbook.co/twitter-image.jpg" />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeButton === ButtonType.Bus ? busServiceData : cargoServiceData) }}
      />

      <main className='flex flex-col w-full h-full items-center overflow-x-hidden'>
        <h1 className="sr-only">{activeButton === ButtonType.Bus ? 'Tranzbook - Online Bus Booking Services' : 'Tranzbook - Cargo Delivery Services'}</h1>
        
        <div className={`bg-[#DEF5FB] ${theme === 'dark' ? 'bg-gray-900' : ''} w-full rounded-b-[2pc] pb-20`} >
          <section aria-labelledby="booking-options">
            <h2 id="booking-options" className="sr-only">Booking Options</h2>
            <div className='flex p-2 flex-col items-center'>
              <div className='flex'>
                <button
                  className='hlinks'
                  onClick={() => handleButtonClick(ButtonType.Bus)}
                  style={{
                    backgroundColor: activeButton === ButtonType.Bus ? '#48A0FF' : '#F2F4F7',
                    color: activeButton === ButtonType.Bus ? '#F2F4F7' : '#48A0FF',
                  }}
                  aria-pressed={activeButton === ButtonType.Bus}
                >
                  Bus
                </button>
                <button
                  className='hlinks'
                  onClick={() => handleButtonClick(ButtonType.Cargo)}
                  style={{
                    backgroundColor: activeButton === ButtonType.Cargo ? '#48A0FF' : '#F2F4F7',
                    color: activeButton === ButtonType.Cargo ? '#F2F4F7' : '#48A0FF',
                  }}
                  aria-pressed={activeButton === ButtonType.Cargo}
                >
                  Cargo
                </button>
              </div>
            </div>
            <div className='Bus' role="region" aria-live="polite">
              {activeButton === ButtonType.Bus && <Bus />}
              {activeButton === ButtonType.Cargo && <Cargo />}
            </div>
          </section>
        </div>

        <section aria-labelledby="services-section">
          <h2 id="services-section" className="sr-only">Our Services</h2>
          <Widgets activeButton={activeButton} />
        </section>
        
        <section aria-labelledby="why-section">
          <h2 id="why-section" className="sr-only">Why Choose Tranzbook</h2>
          <Why activeButton={activeButton} />
        </section>
        
        <section aria-labelledby="popular-places">
          <h2 id="popular-places" className="sr-only">Popular Destinations</h2>
          <PopularPlace />
        </section>
        
        <section aria-labelledby="partners">
          <h2 id="partners" className="sr-only">Our Partners</h2>
          <Partner />
        </section>
      
        <section id='Faq' aria-labelledby="faq-section">
          <h2 id="faq-section" className="sr-only">Frequently Asked Questions</h2>
          <Faq activeButton={activeButton} />
        </section>
      </main>
    </>
  );
}