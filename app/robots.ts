import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/private/'],
    },
    sitemap: 'https://endfieldlab.info/sitemap.xml',
  };
}
