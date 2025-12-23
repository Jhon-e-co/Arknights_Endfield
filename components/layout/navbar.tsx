import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-xl">
          <span>ENDFIELD</span>
          <span className="bg-[#FCEE21] px-1 text-black">TOOLS</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <Link href="/blueprints" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Blueprints
          </Link>
          <Link href="/teams" className="hover:text-black hover:underline decoration-[#FCEE21] decoration-2 underline-offset-4 transition-colors">
            Squads
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
          <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-none bg-zinc-200 hover:bg-[#FCEE21] transition-colors">
            <span className="text-sm font-bold">AD</span>
          </Link>
          <Link href="/auth/login">
            <Button className="bg-zinc-900 text-white hover:bg-[#FCEE21] hover:text-black rounded-none transition-colors font-bold">
              SIGN IN
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}