// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/private/',
        '/api/',
        '/backend/',
        '/user/',
        '/dashboard/',
        '/test/', 
        '/dev/',
        '/staging/'
      ],
    },
    sitemap: 'https://www.tranzbook.co/sitemap.xml',
  };
}