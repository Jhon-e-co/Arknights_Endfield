import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const locales = ['en', 'zh-CN', 'ja', 'ko', 'zh-TW', 'ru', 'th', 'vi'];
const basePaths = ['', '/headhunt', '/map', '/blueprints', '/teams', '/guides'];

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

  const staticUrls: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of basePaths) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: path === '' ? 1 : 0.9,
      });
    }
  }

  return [
    ...staticUrls,
    ...blueprintUrls,
    ...squadUrls,
  ];
}
