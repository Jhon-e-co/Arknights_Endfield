"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlueprintCard } from '@/components/blueprints/blueprint-card';
import { MOCK_BLUEPRINTS } from '@/lib/mock-data';
import { FadeIn } from '@/components/ui/motion-wrapper';
import { TERMINOLOGY } from '@/lib/constants';
import { motion } from 'framer-motion';
import { AdUnit } from '@/components/ui/ad-unit';

export default function BlueprintsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-black uppercase">
            {TERMINOLOGY.SYSTEM_AIC.split(' ')[0]} <span className="bg-[#FCEE21] px-1">BLUEPRINTS</span>
          </h1>
          <Link href="/blueprints/create">
            <Button
              className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 rounded-none font-bold px-6 py-3"
            >
              Upload Blueprint
            </Button>
          </Link>
        </div>
      </FadeIn>

      {/* Banner Ad */}
      <FadeIn delay={0.15}>
        <AdUnit type="banner" className="my-8" />
      </FadeIn>

      {/* Filter Section */}
      <FadeIn delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Sort by
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Most Liked</option>
            </select>
          </div>

          {/* Material Type */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Material Type
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>All Materials</option>
              <option>Iron</option>
              <option>Copper</option>
              <option>Silicon</option>
              <option>Water</option>
            </select>
          </div>

          {/* Additional Filter Placeholder */}
          <div className="flex-1 hidden md:block">
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Stage
            </label>
            <select
              className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
            >
              <option>All Stages</option>
              <option>Early Game</option>
              <option>Mid Game</option>
              <option>End Game</option>
            </select>
          </div>
        </div>
      </FadeIn>

      {/* Blueprints Grid with Stagger Animation */}
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
        {MOCK_BLUEPRINTS.map((blueprint) => (
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

      {/* Empty Space for Better Layout */}
      <div className="h-16"></div>
    </div>
  );
}