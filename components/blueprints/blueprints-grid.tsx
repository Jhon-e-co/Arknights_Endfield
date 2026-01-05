"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BlueprintCard } from '@/components/blueprints/blueprint-card';
import { Blueprint } from '@/lib/mock-data';

interface BlueprintsGridProps {
  blueprints: Blueprint[];
}

export function BlueprintsGrid({ blueprints }: BlueprintsGridProps) {
  return (
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
      {blueprints.map((blueprint) => (
        <motion.div
          key={blueprint.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
          }}
        >
          <BlueprintCard 
            blueprint={blueprint} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
