'use client'
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, X } from "lucide-react";
import { Instagram } from "@mui/icons-material";

export default function Footer() {
  // Links in array format with their href values
  const otherPages = [
    { name: "Home", href: "/home" },
    { name: "About Us", href: "/About" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/Blogs" },

    ];

  const quickLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "FAQ", href: "#faq" },
    { name: "Bus Terms and Conditions", href: "/bus-terms-and-conditions" },
    { name: "Cargo Terms and Conditions", href: "/cargo-terms-and-conditions" }
  ];

  const socialLinks = [
    { icon: <Facebook />, href: "https://facebook.com/tranzbook", label: "Facebook" },
    { icon: <X />, href: "https://x.com/tranzbook", label: "X" },
    { icon: <Instagram />, href: "https://instagram.com/tranzbook", label: "Instagram" },
    { icon: <Linkedin />, href: "https://linkedin.com/company/tranzbook", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-white text-gray-500 py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo & Contact Info */}
        <div>
          <div className="p-6 space-y-4 rounded-lg">
            <img src='/pictures/logoNav.png' alt='Tranzbook Logo'/>

          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1B31FF]">Other Pages</h3>
            <ul className="mt-2 space-y-2">
              {otherPages.map((page) => (
                <li key={page.name}>
                  <Link href={page.href}>
                    <span className="hover:text-[#1B31FF] cursor-pointer">{page.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1B31FF]">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="hover:text-[#1B31FF] cursor-pointer">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-[#1B31FF]">Newsletter</h3>
          <p className="text-gray-400 mt-2">Get the latest news & updates</p>
          <div className="flex items-center mt-4">
            <Input placeholder="Your Email Address" className="bg-white text-black rounded-l-lg px-4 py-2 flex-1" />
            <Button className="bg-[#1B31FF] text-white px-4 rounded-r-lg">Subscribe</Button>
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-6">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href} 
                className="p-2 bg-[#1B31FF] rounded-full text-white"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 text-gray-400">
        © {new Date().getFullYear()} Tranzbook Ltd. All rights reserved.
      </div>
    </footer>
  );
}