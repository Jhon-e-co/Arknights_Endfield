"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TeamCard } from '@/components/teams/team-card';
import { MOCK_SQUADS } from '@/lib/mock-data';
import { FadeIn } from '@/components/ui/motion-wrapper';
import { motion } from 'framer-motion';

export default function TeamsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-black uppercase">
            TACTICAL <span className="bg-[#FCEE21] px-1">SQUADS</span>
          </h1>
          <Link href="/teams/create">
            <Button
              className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold px-6 py-3"
            >
              Create Squad
            </Button>
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Sort by
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Most Liked</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Element
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>All Elements</option>
              <option>Fire</option>
              <option>Ice</option>
              <option>Electric</option>
              <option>Physical</option>
              <option>Ether</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Tag
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>All Tags</option>
              <option>Freeze</option>
              <option>Burst</option>
              <option>CC</option>
              <option>Support</option>
            </select>
          </div>
        </div>
      </FadeIn>

      <motion.div
        className="grid grid-cols-1 gap-8"
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
        {MOCK_SQUADS.map((squad) => (
          <motion.div
            key={squad.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
          >
            <TeamCard squad={squad} />
          </motion.div>
        ))}
      </motion.div>

      <div className="h-16"></div>
    </div>
  );
}
