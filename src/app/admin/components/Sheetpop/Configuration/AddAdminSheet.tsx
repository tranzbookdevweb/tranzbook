'use client';
import React, { useEffect, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

type Branch = {
  id: string;
  name: string;
};

type Role = {
  id: string;
  name: string;
};

async function fetchBranches() {
  try {
    const response = await fetch('/api/GET/getBranches');
    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}

async function fetchRoles() {
  try {
    const response = await fetch('/api/GET/getRoles');
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

function AdminSheet({ onAddSuccess }: { onAddSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [branchId, setBranchId] = useState('');
  const [roleId, setRoleId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [branchesData, rolesData] = await Promise.all([fetchBranches(), fetchRoles()]);
      setBranches(branchesData);
      setRoles(rolesData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password || !firstName || !lastName || !branchId || !roleId) {
      setError('First name, last name, email, password, branch, and role are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/POST/Admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName, branchId, roleId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data received:', data);
      onAddSuccess();
      alert('Admin added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add admin.');
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
          <SheetTitle>Add Admin</SheetTitle>
          <SheetDescription>Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="FirstName" className="text-left">
                First Name
              </Label>
              <Input
                id="FirstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="lastName" className="text-left">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              <Label htmlFor="Password" className="text-left">
                Password
              </Label>
              <Input
                id="Password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="branchId" className="text-left">
                Branch
              </Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="roleId" className="text-left">
                Role
              </Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default AdminSheet;
