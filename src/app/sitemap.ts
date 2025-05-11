// src/app/sitemap.ts
import { MetadataRoute } from 'next';

// This is a placeholder function - implement it to fetch blog posts from your CMS/database
async function fetchBlogPosts() {
  // Example structure - replace with actual implementation
  return [
    { slug: 'best-bus-routes-2025', updatedAt: '2025-05-01' },
    { slug: 'cargo-shipping-tips', updatedAt: '2025-04-15' },
    { slug: 'travel-safety-guide', updatedAt: '2025-03-20' },
    // Add more blog posts as needed
  ];
}

// This is a placeholder function - implement it to fetch popular routes
async function fetchPopularRoutes() {
  // Example structure - replace with actual implementation
  return [
    { slug: 'lagos-abuja', name: 'Lagos to Abuja' },
    { slug: 'accra-kumasi', name: 'Accra to Kumasi' },
    { slug: 'nairobi-mombasa', name: 'Nairobi to Mombasa' },
    { slug: 'dar-es-salaam-arusha', name: 'Dar es Salaam to Arusha' },
    // Add more routes as needed
  ];
}

// Define locations you serve
async function fetchServiceLocations() {
  return [
    { slug: 'lagos', name: 'Lagos' },
    { slug: 'abuja', name: 'Abuja' },
    { slug: 'accra', name: 'Accra' },
    { slug: 'kumasi', name: 'Kumasi' },
    { slug: 'nairobi', name: 'Nairobi' },
    // Add more locations as needed
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get dynamic blog posts
  const blogPosts = await fetchBlogPosts();
  const blogUrls = blogPosts.map(post => ({
    url: `https://www.tranzbook.co/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  // Get popular routes
  const popularRoutes = await fetchPopularRoutes();
  const routeUrls = popularRoutes.map(route => ({
    url: `https://www.tranzbook.co/routes/${route.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  // Get locations
  const locations = await fetchServiceLocations();
  const locationUrls = locations.map(location => ({
    url: `https://www.tranzbook.co/locations/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  // Base URLs
  const baseUrls: MetadataRoute.Sitemap = [
    { 
      url: "https://www.tranzbook.co/", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 1.0 
    },
    { 
      url: "https://www.tranzbook.co/about-us", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.8 
    },
    { 
      url: "https://www.tranzbook.co/career", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.7 
    },
    { 
      url: "https://www.tranzbook.co/blog", 
      lastModified: new Date(), 
      changeFrequency: "weekly", 
      priority: 0.9 
    },
    { 
      url: "https://www.tranzbook.co/privacy-policy", 
      lastModified: new Date(), 
      changeFrequency: "yearly", 
      priority: 0.6 
    },
    { 
      url: "https://www.tranzbook.co/bus-terms-and-conditions", 
      lastModified: new Date(), 
      changeFrequency: "yearly", 
      priority: 0.6 
    },
    { 
      url: "https://www.tranzbook.co/cargo-terms-and-conditions", 
      lastModified: new Date(), 
      changeFrequency: "yearly", 
      priority: 0.6 
    },
    { 
      url: "https://www.tranzbook.co/bus-booking", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.9 
    },
    { 
      url: "https://www.tranzbook.co/cargo-booking", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.9 
    },
    { 
      url: "https://www.tranzbook.co/contact-us", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.7 
    },
    { 
      url: "https://www.tranzbook.co/faq", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.7 
    },
    { 
      url: "https://www.tranzbook.co/partners", 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.6 
    },
  ];

  return [...baseUrls, ...blogUrls, ...routeUrls, ...locationUrls];
}