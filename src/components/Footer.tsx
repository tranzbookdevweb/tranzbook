'use client'
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, X } from "lucide-react";
import { Instagram } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-500 py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo & Contact Info */}
        <div>
          <div className=" p-6 space-y-4 rounded-lg">
                   <img src='/pictures/logoNav.png' alt=''/>
            <p className="mt-1">📧 hello@Tranzbook.com</p>
            <p className="mt-1">📞 +233 55 454 8978</p>
            <p className="mt-1">📞 +233 502 606 270</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#1B31FF]">Other Pages</h3>
            <ul className="mt-2 space-y-2">
              {["Home", "About Us", "Careers", "Shop", "Contact"].map((page) => (
                <li key={page}>
                  <Link href={`/${page.toLowerCase().replace(/\s+/g, "-")}`}>
                    <span className="hover:text-[#1B31FF] cursor-pointer">{page}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1B31FF]">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              {["Privacy Policy", "Blog", "News", "FAQ"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}>
                    <span className="hover:text-[#1B31FF] cursor-pointer">{link}</span>
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
            <a href="#" className="p-2 bg-[#1B31FF] rounded-full text-white">
              <Facebook />
            </a>
            <a href="#" className="p-2 bg-[#1B31FF] rounded-full text-white">
              <X />
            </a>
            <a href="#" className="p-2 bg-[#1B31FF] rounded-full text-white">
              <Instagram />
            </a>
            <a href="#" className="p-2 bg-[#1B31FF] rounded-full text-white">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 text-gray-400">
        © 2025 Tranzbook Ltd. All rights reserved.
      </div>
    </footer>
  );
}
