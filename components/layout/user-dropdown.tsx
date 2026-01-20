"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UserDropdownProps {
  user: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    setIsOpen(false);
  };

  const avatarLetter = user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-none bg-zinc-200 hover:bg-[#FCEE21] transition-colors focus:outline-none"
      >
        <span className="text-sm font-bold">{avatarLetter}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-20 w-64 bg-white border-2 border-zinc-200 shadow-lg">
            <div className="p-4 border-b border-zinc-200">
              <div className="font-bold text-sm text-zinc-900 truncate">
                {user.user_metadata?.full_name || user.email}
              </div>
              <div className="text-xs text-zinc-500 truncate">
                {user.email}
              </div>
            </div>
            <div className="py-2">
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
