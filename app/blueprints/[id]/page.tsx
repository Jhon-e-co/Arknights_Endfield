import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Metadata } from "next";
import { CopyButton } from '@/components/blueprints/copy-button';
import { AdUnit } from '@/components/ui/ad-unit';
import { BlueprintActions } from '@/components/blueprints/blueprint-actions';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: blueprint } = await supabase
    .from('blueprints')
    .select('title, description')
    .eq('id', id)
    .single();
  
  if (!blueprint) return { title: "Blueprint Not Found" };

  return {
    title: blueprint.title,
    description: blueprint.description,
  };
}

export default async function BlueprintDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: blueprint, error } = await supabase
    .from('blueprints')
    .select(`
      *,
      profiles (username, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error || !blueprint) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let isLiked = false;
  let isCollected = false;

  if (user) {
    const [likeRes, collectRes] = await Promise.all([
      supabase.from("blueprint_likes").select("id").eq("user_id", user.id).eq("blueprint_id", id).single(),
      supabase.from("saved_blueprints").select("id").eq("user_id", user.id).eq("blueprint_id", id).single()
    ]);
    isLiked = !!likeRes.data;
    isCollected = !!collectRes.data;
  }

  const author = blueprint.profiles?.username || 'Unknown';
  const authorAvatar = blueprint.profiles?.avatar_url;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-zinc-500 hover:text-black">
          Home
        </Link>
        <span className="text-zinc-300">/</span>
        <Link href="/blueprints" className="text-zinc-500 hover:text-black">
          Blueprints
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="font-bold">{blueprint.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video border border-zinc-200 bg-zinc-100">
            <Image
              src={blueprint.image_url}
              alt={blueprint.title}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute top-2 left-2 bg-[#FCEE21] text-black text-xs font-bold px-2 py-1">
              V1.0
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3">{blueprint.title}</h1>
            <div className="flex flex-wrap gap-2">
              {(blueprint.tags || []).map((tag, index) => (
                <Badge key={index} className="rounded-none bg-zinc-100 text-zinc-900 border-zinc-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="prose prose-zinc max-w-none">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-zinc-700 leading-relaxed">
              {blueprint.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="border border-zinc-200 bg-white p-6 rounded-none">
              <h3 className="text-lg font-bold mb-4">Blueprint Info</h3>

              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium">Author</p>
                  <Link href={`/users/${blueprint.author_id}`} className="font-bold hover:underline">
                    {author}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="font-bold">{new Date(blueprint.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="py-4 border-t border-zinc-100 mt-4">
                <p className="text-sm font-medium text-zinc-500 mb-3">Actions</p>
                <BlueprintActions
                  blueprintId={blueprint.id}
                  initialLikes={blueprint.likes || 0}
                  initialIsLiked={isLiked}
                  initialIsCollected={isCollected}
                />
              </div>
            </div>

            <div className="border border-zinc-200 bg-white rounded-none">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50">
                <h3 className="text-lg font-bold">Blueprint Code</h3>
              </div>
              
              <pre className="bg-black text-white p-4 overflow-x-auto max-h-[300px] font-mono text-sm">
                <code>{blueprint.code}</code>
              </pre>

              <div className="p-4 flex justify-end">
                <CopyButton code={blueprint.code} />
              </div>
            </div>

            <AdUnit type="sidebar" className="hidden lg:block" />

            <div className="flex gap-3">
              <Link href="/blueprints" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-2 border-zinc-200 bg-white hover:bg-zinc-50 rounded-none font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to List
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
