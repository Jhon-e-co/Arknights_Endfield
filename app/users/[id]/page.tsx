import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ThumbsUp, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserById, getBlueprintsByAuthor } from '@/lib/mock-data';
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const user = getUserById(id);
  
  if (!user) return { title: "User Not Found" };

  return {
    title: user.name,
    description: user.bio,
  };
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const user = getUserById(id);

  if (!user) {
    notFound();
  }

  const userBlueprints = getBlueprintsByAuthor(id);
  const isOwner = (id === "user-1");

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-zinc-800">
        <Image
          src={user.banner}
          alt={`${user.name}'s banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-white border border-zinc-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-white bg-zinc-100 overflow-hidden">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-zinc-500 text-sm mb-3">ID: {user.id}</p>
              <p className="text-zinc-700 mb-4">{user.bio}</p>

              {/* Action Button */}
              {isOwner ? (
                <Button variant="outline" className="rounded-none">
                  Edit Profile
                </Button>
              ) : (
                <Button variant="outline" className="rounded-none">
                  + Follow
                </Button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-zinc-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-2xl font-bold">{user.blueprintsCreated}</p>
                <p className="text-sm text-zinc-500">Blueprints Created</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThumbsUp className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-2xl font-bold">{user.totalLikes}</p>
                <p className="text-sm text-zinc-500">Total Likes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-zinc-500">Followers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-zinc-500">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprints Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">Blueprints by {user.name}</h2>
        
        {userBlueprints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBlueprints.map((blueprint) => (
              <Link
                key={blueprint.id}
                href={`/blueprints/${blueprint.id}`}
                className="border border-zinc-200 bg-white rounded-none shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <Image
                    src={blueprint.image}
                    alt={blueprint.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 left-2 bg-[#FCEE21] text-black text-xs font-bold px-2 py-1">
                    V1.0
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{blueprint.title}</h3>
                  <p className="text-sm text-zinc-500 mb-3">{blueprint.createdAt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blueprint.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} className="rounded-none bg-zinc-100 text-zinc-900 border-zinc-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <ThumbsUp className="w-4 h-4" />
                    {blueprint.likes} likes
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-zinc-200 bg-white">
            <FileText className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">No blueprints yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
