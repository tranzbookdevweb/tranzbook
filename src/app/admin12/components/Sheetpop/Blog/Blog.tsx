import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { htmlToText } from 'html-to-text'
import { ScrollArea } from '@/components/ui/scroll-area';

type Admin = {
  id: string;
  firstName: string;
  lastName: string;

};

type Props = {
  onAddSuccess: () => void;
};

function BlogSheet({ onAddSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the list of admins
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/GET/getAdmin');
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const data = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!title || !content || !adminId) {
      setError('Title, content, and admin are required.');
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', htmlToText(content)); // Convert HTML to plain text
      formData.append('adminId', adminId);
      if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }
  
      const response = await fetch('/api/POST/Blog', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Data received:', data);
      onAddSuccess();
      alert('Blog post added successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="flex items-center">
        <Button className="text-[12px] bg-[#48A0FF] py-2 h-fit">
          <PlusCircle className="mr-1" size={12} /> Add Blog Post
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[999]">
      <ScrollArea className="h-full max-h-full w-full rounded-md border p-5">
      <SheetHeader>
          <SheetTitle>Add Blog Post</SheetTitle>
          <SheetDescription>Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="title" className="text-left">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="content" className="text-left">
                Content
              </Label>
              <ReactQuill
                value={content}
                onChange={setContent}
                className="col-span-3"
                placeholder="Write your blog content here..."
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-left">
                Image
              </Label>
              <Input
                id="imageUrl"
                type="file"
                onChange={(e) => setImageUrl(e.target.files?.[0] ?? null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Label htmlFor="adminId" className="text-left">
                Admin
              </Label>
              <Select value={adminId ?? ''} onValueChange={(value) => setAdminId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an admin" />
                </SelectTrigger>
                <SelectContent className="z-[99999]">
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.firstName} {admin.lastName}
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
        </form></ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default BlogSheet;
