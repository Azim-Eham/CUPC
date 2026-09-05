import { MetadataRoute } from 'next';
import facultyData from "../../faculty/cu_physics_faculty.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cupc.vercel.app"; // Replace with your actual domain

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/faculty`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }
  ];

  // Dynamic Faculty routes
  const facultyRoutes = facultyData.faculty_members.map((_, index) => ({
    url: `${baseUrl}/faculty/fac-${index + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...facultyRoutes];
}
