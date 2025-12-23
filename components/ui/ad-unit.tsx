"use client";

import React from 'react';
import { motion } from 'framer-motion';

type AdUnitType = 'banner' | 'sidebar';

interface AdUnitProps {
  type?: AdUnitType;
  className?: string;
}

export function AdUnit({ type = 'banner', className = '' }: AdUnitProps) {
  const isBanner = type === 'banner';

  return (
    <motion.div
      className={`
        relative overflow-hidden border-2 border-[#FCEE21] bg-zinc-900
        ${isBanner ? 'h-[90px] w-full' : 'h-[250px] w-full'}
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(252, 238, 33, 0.1) 10px,
              rgba(252, 238, 33, 0.1) 20px
            )
          `
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center">
          {isBanner ? (
            <>
              <motion.div
                className="text-zinc-400 font-mono text-[10px] md:text-xs tracking-wider"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                /// ENDFIELD_INDUSTRIES_BROADCAST ///
              </motion.div>
              <motion.div
                className="mt-2 text-zinc-500 font-mono text-[9px]"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                [ SIGNAL: STABLE ]
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                className="text-zinc-400 font-mono text-xs md:text-sm font-bold tracking-widest"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                [ SECTOR_ANALYSIS_MODULE ]
              </motion.div>
              <motion.div
                className="mt-3 text-zinc-500 font-mono text-[10px]"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                STATUS: SCANNING...
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FCEE21] to-transparent"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[#FCEE21] to-transparent"
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <div className="absolute bottom-1 right-2 text-zinc-600 font-mono text-[9px]">
        V1.0
      </div>
    </motion.div>
  );
}
