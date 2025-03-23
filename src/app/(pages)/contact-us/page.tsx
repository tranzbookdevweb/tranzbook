'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Poppins } from 'next/font/google';

// Initialize the font
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});
interface FormData {
  firstName: string;
  subject: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    subject: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };
  
  return (
    <div className={`min-h-screen bg-[#F5FCFF] ${poppins.className}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-orange-500">Contact Us</h1>
          <p className="text-gray-500 text-sm mt-1">Any question or remarks? Just write us a message!</p>
        </div>
        
        {/* Contact Form Container */}
        <div className="flex p-3 bg-white flex-col-reverse md:flex-row">
          {/* Left Side - Contact Information */}
          <div className="bg-[#2979FF] text-white rounded-l-[2pc] rounded-tr-[2pc] p-8 md:w-2/5 relative overflow-hidden">
            <h2 className="text-2xl font-semibold mb-1">Contact Information</h2>
            <p className="text-blue-100 mb-12">Say something to start a live chat!</p>
            
            <div className="mb-16">
  <div className="flex items-center mb-6">
    <div className="w-6 h-6 mr-4 flex items-center justify-center">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    </div>
    <a href="tel:+233273754317" className="hover:underline">0273754317</a>
  </div>
  
  <div className="flex items-center mb-6">
    <div className="w-6 h-6 mr-4 flex items-center justify-center">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    </div>
    <a href="mailto:tranzbook1@gmail.com" className="hover:underline">tranzbook1@gmail.com</a>
  </div>
  
  <div className="flex items-start">
    <div className="w-6 h-6 mr-4 flex items-center justify-center mt-1">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    </div>
    <span>Amanfrom behind Baguio heights international school 2nd campus</span>
  </div>
</div>
            
            {/* Social Media Icons */}
            <div className="pt-20 bottom-8 left-8 flex space-x-4">
              <a href="#" className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
            
            {/* Blue circular accents */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-400 rounded-full opacity-30"></div>
            <div className="absolute bottom-10 right-5 w-[138px] h-[138px] bg-blue-800 rounded-full opacity-20"></div>
          </div>
          
          {/* Right Side - Form */}
          <div className="p-8 md:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-500 mb-2 block">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
className="border-0 border-b border-b-gray-300 rounded-none focus:border-b-blue-500 focus:ring-0 px-0 outline-none"                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-gray-500 mb-2 block">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
className="border-0 border-b border-b-gray-300 rounded-none focus:border-b-blue-500 focus:ring-0 px-0 outline-none"                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="subject" className="text-gray-500 mb-2 block">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
className="border-0 border-b border-b-gray-300 rounded-none focus:border-b-blue-500 focus:ring-0 px-0 outline-none"                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-500 mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
className="border-0 border-b border-b-gray-300 rounded-none focus:border-b-blue-500 focus:ring-0 px-0 outline-none"                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="message" className="text-gray-500 mb-2 block">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-24 border-0 border-b border-b-gray-300 rounded-none focus:border-b-blue-500 px-0 outline-none resize-none"                  placeholder="Write your message..."
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-[5px] px-6 py-2"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* World Map */}
        <div className="mb-8 relative">
          <img 
            src="/map.png" 
            alt="World map with connection points" 
            className="w-full h-94 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;