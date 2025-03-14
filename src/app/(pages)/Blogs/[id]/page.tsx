'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

const BlogDetail: React.FC = () => {
  const { id } = useParams(); // Extract the blog post ID from the URL
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [adminName, setAdminName] = useState<string>('Unknown Admin');
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/GET/getBlog/${id}`);
          const data: BlogPost = await response.json();
          setBlogPost(data);
          await fetchAdminName(data.adminId);
          await fetchRelatedPosts();
          setLoading(false);
        } catch (error) {
          console.error('Error fetching blog post:', error);
        }
      }
    };

    const fetchAdminName = async (adminId: string) => {
      try {
        const response = await fetch(`/api/GET/getAdmin`);
        const admins: Admin[] = await response.json();
        const admin = admins.find((a) => a.id === adminId);
        if (admin) {
          setAdminName(`${admin.firstName} ${admin.lastName}`);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch('/api/GET/getBlogs'); // Assuming this returns all blogs
        const allPosts: BlogPost[] = await response.json();
        const filteredPosts = allPosts.filter((post) => post.id !== id).slice(0, 3); // Get other posts, excluding the current one
        setRelatedPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return   <div className="animate-pulse">
    <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
    <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
    <div className="bg-gray-200 h-48 rounded mb-4"></div>
    <div className="bg-gray-200 h-6 w-full rounded mb-4"></div>
    <div className="bg-gray-200 h-6 w-3/4 rounded mb-4"></div>
  </div> 
  }

  if (!blogPost) {
    return <div>Blog post not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-4xl font-bold mb-2">{blogPost.title}</h1>
        <p className="text-sm text-gray-600 mb-4">By {adminName} on {new Date(blogPost.createdAt).toLocaleDateString()}</p>
        {blogPost.image && (
          <img src={`https://kqvxondwjmttypsecwds.supabase.co/storage/v1/object/public/${blogPost.image}`} alt={blogPost.title} className="w-full h-auto rounded-md mb-4" />
        )}
        <div className="text-gray-800" >{blogPost.content } </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
            {post.image && (
              <img src={`https://kqvxondwjmttypsecwds.supabase.co/storage/v1/object/public/${post.image}`} alt={post.title} className="w-full h-40 object-cover rounded-md mb-2" />
            )}
            <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
            <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
            <a href={`/blogs/${post.id}`} className="text-blue-500 hover:underline mt-2 block">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetail;
