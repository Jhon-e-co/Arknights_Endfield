"use client";

import React from 'react';
import { User, Book, Star, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabList, Tab, TabContent } from '@/components/ui/tabs';
import { BlueprintCard } from '@/components/blueprints/blueprint-card';
import { MOCK_BLUEPRINTS } from '@/lib/mock-data';
import { FadeIn } from '@/components/ui/motion-wrapper';
import { TERMINOLOGY } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  // Split mock data for demo
  const myBlueprints = MOCK_BLUEPRINTS.slice(0, 2);
  const favoriteBlueprints = MOCK_BLUEPRINTS.slice(-2);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase">
            <span className="bg-[#FCEE21] px-1">{TERMINOLOGY.PLAYER_ROLE.toUpperCase()}</span> DASHBOARD
          </h1>
        </div>
      </FadeIn>

      {/* Overview Card */}
      <FadeIn delay={0.1}>
        <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-zinc-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-zinc-500" />
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-xl font-bold mb-1">EndAdmin#001</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{TERMINOLOGY.PLAYER_ROLE}</span>
                </div>
                <span className="text-zinc-500">ID: END-001</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="ml-auto">
              <Link href="/blueprints/create">
                <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Upload Blueprint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.2}>
        <Tabs defaultValue="my-blueprints">
          <TabList>
            <Tab value="my-blueprints" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              My Blueprints
            </Tab>
            <Tab value="favorites" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Favorites
            </Tab>
          </TabList>

          {/* My Blueprints */}
          <TabContent value="my-blueprints">
            {myBlueprints.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {myBlueprints.map((blueprint) => (
                  <motion.div
                    key={blueprint.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                  >
                    <BlueprintCard blueprint={blueprint} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-zinc-300">
                  <Book className="w-full h-full" />
                </div>
                <h3 className="text-lg font-bold mb-2">No blueprints found.</h3>
                <p className="text-zinc-500 mb-6">Start building your blueprint library!</p>
                <Link href="/blueprints/create">
                  <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold flex items-center gap-2">
                    Create Blueprint
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </TabContent>

          {/* Favorites */}
          <TabContent value="favorites">
            {favoriteBlueprints.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {favoriteBlueprints.map((blueprint) => (
                  <motion.div
                    key={blueprint.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                  >
                    <BlueprintCard blueprint={blueprint} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-zinc-300">
                  <Star className="w-full h-full" />
                </div>
                <h3 className="text-lg font-bold mb-2">No favorites found.</h3>
                <p className="text-zinc-500 mb-6">Browse blueprints and add to favorites!</p>
                <Link href="/blueprints">
                  <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold flex items-center gap-2">
                    Browse Blueprints
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </TabContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}