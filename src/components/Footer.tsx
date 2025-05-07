'use client'
import Link from "next/link";
import { Facebook, Mail, Phone, Twitter, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  // Maintaining original links and hrefs
  const otherPages = [
    { name: "Home", href: "/home" },
    { name: "About Us", href: "/about-us" },
    { name: "Careers", href: "/career" },
    { name: "Blog", href: "/blog" },
  ];

  const quickLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Bus T&C's", href: "/bus-terms-and-conditions" },
    { name: "Cargo T&C's", href: "/cargo-terms-and-conditions" },
  ];

  return (
    <footer className="bg-blue-500 text-white p-10 px-5 w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-2">          {/* Logo Section */}
          <div>
            <div className="flex items-center mb-4">
                <div className=" flex items-center justify-center">
                  <Image src='/footerlogo.png' width={100} height={80} alt="" />
                </div>
            </div>
          </div>

          {/* Other Pages */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Other pages</h3>
            <ul className="space-y-1 text-sm">
              {otherPages.map((page) => (
                <li key={page.name}>
                  <Link href={page.href}>{page.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
      <h3 className="text-sm font-semibold mb-3">Contact Us</h3>
      <ul className="space-y-1 text-sm">
        <li className="flex items-center">
          <Phone className="mr-2" size={18} />
          <a href="tel:0273754317" className="hover:text-blue-600 transition-colors">
            0273754317
          </a>
        </li>
        <li className="flex items-center">
          <Mail className="mr-2" size={18} />
          <a href="mailto:tranzbook1@gmail.com" className="hover:text-blue-600 transition-colors">
            tranzbook1@gmail.com
          </a>
        </li>
      </ul>
    </div>

          {/* Subscribe */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">Subscribe</h3>
              <div className="flex w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2  mr-3  rounded text-blue-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <button className="bg-blue-600 rounded text-white px-3 py-2 rounded-r whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
            
            {/* Social Media */}
            <div >
              <h3 className="text-sm font-semibold mb-2">Social</h3>
              <div className="flex space-x-2">
                <a href="https://facebook.com/tranzbook" className="bg-white p-1 rounded">
                  <Facebook size={16} className="text-blue-500" />
                </a>
                <a href="https://x.com/tranzbook" className="bg-white p-1 rounded">
                  <Twitter size={16} className="text-blue-500" />
                </a>
                <a href="#" className="bg-white p-1 rounded">
                  <Youtube size={16} className="text-blue-500" />
                </a>
                <a href="#" className="bg-white p-1 rounded">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500">
                    <path fill="currentColor" d="M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M17.2,12.2L17.2,12.2L17.2,12.2
                    c0,2.3-1.9,4.2-4.2,4.2h0H9.8v-8.4h3.2C15.3,8,17.2,9.9,17.2,12.2z"/>
                    <path fill="currentColor" d="M13,9.8h-1.6v4.8H13c1.3,0,2.4-1.1,2.4-2.4S14.3,9.8,13,9.8z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
          {/* Divider */}
          <div className="border-t border-blue-400 my-8 opacity-30"></div>
        {/* Copyright */}
        <div className="text-center mt-8 text-sm">
          © 2025 Tranzbook Technologies | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}