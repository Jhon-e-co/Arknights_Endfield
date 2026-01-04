import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://endfieldlab.info';
  const supabase = await createClient();

  const { data: blueprints } = await supabase
    .from('blueprints')
    .select('id, created_at')
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: squads } = await supabase
    .from('squads')
    .select('id, created_at')
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(100);

  const blueprintUrls = (blueprints || []).map((bp) => ({
    url: `${baseUrl}/blueprints/${bp.id}`,
    lastModified: new Date(bp.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const squadUrls = (squads || []).map((squad) => ({
    url: `${baseUrl}/teams/${squad.id}`,
    lastModified: new Date(squad.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blueprints`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/teams`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...blueprintUrls,
    ...squadUrls,
  ];
}
