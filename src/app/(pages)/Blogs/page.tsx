'use client';
import Carousel from '@/components/Carousel';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
}

const SkeletonLoader: React.FC = () => (
  <div className="relative bg-gray-800 rounded-[2pc] h-72 w-96 max-lg:w-full max-lg:h-60 overflow-hidden animate-pulse">
    <div className="bg-gray-700 h-full w-full"></div>
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-55">
      <div className="text-white">
        <h3 className="text-xl font-bold mb-2 bg-gray-600 h-4 w-3/4"></h3>
        <p className="text-sm bg-gray-600 h-4 w-1/2"></p>
      </div>
    </div>
  </div>
);

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/GET/getBlogs');
        const data: BlogPost[] = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/GET/getAdmin');
        const data: Admin[] = await response.json();
        setAdmins(data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchBlogs();
    fetchAdmins();
  }, []);

  const getAdminName = (adminId: string) => {
    const admin = admins.find((admin) => admin.id === adminId);
    return admin ? `${admin.firstName} ${admin.lastName}` : 'Unknown Admin';
  };

  const handlePostClick = (id: string) => {
    router.push(`/Blogs/${id}`); // Navigate to the blog detail page
  };

  return (
    <div className="flex flex-col w-full">
      <Carousel />
      <div className="w-full mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-4">From the Blog</h1>
        <p className="text-center mb-8">Explore the impact of technology on bus transportation.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <SkeletonLoader key={index} />)
          ) : (
            blogPosts.map((post) => (
              <motion.div
                key={post.id}
                className="relative bg-gray-800 rounded-[2pc] hover:cursor-pointer h-72 w-96 max-lg:w-full max-lg:h-60 overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                onClick={() => handlePostClick(post.id)} // Add click handler
              >
                {post.image && (
                  <motion.img
                    src={`https://kqvxondwjmttypsecwds.supabase.co/storage/v1/object/public/${post.image}`}
                  
                    alt={post.title}
                    className="w-full h-full object-cover max-h-64 object-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-55">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()} • {getAdminName(post.adminId)}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
