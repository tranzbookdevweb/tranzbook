'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function BusCompanySheet({ onAddSuccess }: { onAddSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setlogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setlogo(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !logo) {
      setError('Name, email, and logo are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('logo', logo);

      const response = await fetch('/api/POST/busCompany', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data received:', data);
      onAddSuccess();
      alert('Bus Company added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add Bus Company.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className='flex items-center'>
        <Button className='text-[12px] bg-[#48A0FF] py-2 h-fit'>
          <PlusCircle className='mr-1' size={12} /> Add
        </Button>
      </SheetTrigger>
      <SheetContent className='z-[999]'>
      <ScrollArea className="h-full max-h-full w-full rounded-md border p-5">

        <SheetHeader>
          <SheetTitle>Add Bus Company</SheetTitle>
          <SheetDescription>Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="Name" className="text-left">
                Name
              </Label>
              <Input
                id="Name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="Email" className="text-left">
                Email
              </Label>
              <Input
                id="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="logo" className="text-left">
                Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="col-span-3"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Save changes'}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default BusCompanySheet;
