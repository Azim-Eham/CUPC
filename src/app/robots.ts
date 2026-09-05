import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cupc.vercel.app"; // Replace with your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/profile/edit', '/mentorship-dashboard'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
