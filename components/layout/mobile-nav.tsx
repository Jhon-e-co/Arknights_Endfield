"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/src/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const navLinks = [
    { href: "/map", label: "Map" },
    { href: "/headhunt", label: "Headhunt" },
    { href: "/guides", label: "Guides" },
    { href: "/blueprints", label: "Blueprints" },
    { href: "/teams", label: "Squads" }
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000]"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white border-r-2 border-zinc-200 z-[3001] shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b-2 border-zinc-200 bg-zinc-50">
                <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
                  <span>ENDFIELD</span>
                  <span className="bg-[#FCEE21] px-1 text-black">LAB</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors rounded-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block px-4 py-3 text-sm font-medium text-zinc-600 hover:text-black hover:bg-[#FCEE21] hover:text-black transition-colors rounded-none border-2 border-transparent hover:border-zinc-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-8 border-t-2 border-zinc-200">
                  <div className="mb-4">
                    <h3 className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Language
                    </h3>
                    <div className="px-4">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
