import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserDropdown } from "./user-dropdown";
import { MusicWidget } from "@/components/music/music-widget";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-[2000] w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl">
          <span>ENDFIELD</span>
          <span className="bg-[#FCEE21] px-1 text-black">LAB</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="/blueprints" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Blueprints
          </Link>
          <Link href="/teams" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Squads
          </Link>
          <Link href="/guides" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Guides
          </Link>
          <Link href="/map" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Map
          </Link>
          <Link href="/calculator" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Calculator
          </Link>
        </div>

        {/* Auth Button */}
        <div className="flex items-center gap-4">
          <MusicWidget />
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link href="/auth/login">
              <Button className="bg-zinc-900 text-white hover:bg-[#FCEE21] hover:text-black rounded-none transition-colors font-bold">
                SIGN IN
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}