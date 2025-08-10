'use client'
import Link from "next/link";
import { Facebook, Mail, Phone, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const productPages = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Solutions", href: "/solutions" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Pricing", href: "/pricing" },
  ];

  const resourcePages = [
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/career" },
    { name: "FAQs", href: "/faqs" },
    { name: "Help centre", href: "/help" },
    { name: "Support", href: "/support" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Logo and Description Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Image src='/logoalt.png' width={120} height={40} alt="TranzBook" className="h-6 sm:h-8 w-auto" />
              </div>
            </div>
            {/* <p className="text-gray-600 text-sm mb-4 sm:mb-6 max-w-sm leading-relaxed">
              Design amazing digital experiences that create more happy in the world
            </p> */}
            
            {/* Social Media Icons */}
            <div className="flex space-x-3">
              <a href="https://facebook.com/tranzbook" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="https://x.com/tranzbook" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Youtube size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.956 1.404-5.956s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3">
              {productPages.map((page) => (
                <li key={page.name}>
                  <Link 
                    href={page.href} 
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm">Resources</h3>
            <ul className="space-y-3">
              {resourcePages.map((page) => (
                <li key={page.name}>
                  <Link 
                    href={page.href} 
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay up to date Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4 text-sm">Stay up to date</h3>
            
            {/* Email Subscription */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 sm:mb-0 min-w-44" 
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md text-sm font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-gray-900 font-semibold text-sm">Contact Us</h4>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="mr-2 flex-shrink-0" size={16} />
                <a href="tel:+233273754317" className="hover:text-gray-900 transition-colors break-all">
                  +233 27 375 4317
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="mr-2 flex-shrink-0" size={16} />
                <a href="mailto:info@tranzbook.co" className="hover:text-gray-900 transition-colors break-all">
                  info@tranzbook.co
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              © 2025 TranzBook Ltd. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-900 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-gray-900 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}