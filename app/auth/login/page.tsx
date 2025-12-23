import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md border border-zinc-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase">
            Endfield <span className="bg-[#FCEE21] px-1">Identity</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sign in to upload blueprints and sync data.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full bg-black text-white hover:bg-[#FCEE21] hover:text-black font-bold h-12 rounded-none transition-colors"
          >
            CONTINUE WITH GOOGLE
          </Button>
          <Button
            variant="outline"
            className="w-full border-2 border-black bg-transparent text-black hover:bg-zinc-100 font-bold h-12 rounded-none"
          >
            CONTINUE WITH DISCORD
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-400">
          By signing in, you agree to our Terms of Service.
        </div>
      </div>
    </div>
  );
}