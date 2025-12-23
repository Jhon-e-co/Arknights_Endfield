import { MetadataRoute } from 'next';
import { MOCK_BLUEPRINTS } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://endfield-tools.vercel.app';
  
  const blueprints = MOCK_BLUEPRINTS.map((bp) => ({
    url: `${baseUrl}/blueprints/${bp.id}`,
    lastModified: new Date(bp.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blueprints`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...blueprints,
  ];
}
