import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion-wrapper';

export default function Home() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-white"></div>
      
      {/* Large ENDFIELD Text Decoration */}
      <div className="absolute right-[-10%] bottom-[-10%] text-[20rem] font-black text-zinc-100 pointer-events-none select-none">
        ENDFIELD
      </div>
      
      {/* Corner HUD Elements */}
      <div className="absolute top-8 left-8 text-zinc-400 font-mono text-sm">
        [ REC ]
      </div>
      <div className="absolute top-8 right-8 text-zinc-400 font-mono text-sm">
        [ HUD ]
      </div>
      <div className="absolute bottom-8 left-8 text-zinc-400 font-mono text-sm">
        [ STATUS: ONLINE ]
      </div>
      <div className="absolute bottom-8 right-8 text-zinc-400 font-mono text-sm">
        [ V1.0.0 ]
      </div>
      
      {/* Warning Stripes */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-brand to-transparent opacity-50"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-brand to-transparent opacity-50"></div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Hero Headline */}
        <FadeIn>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            Build. Optimize. Conquer.
          </h1>
        </FadeIn>
        
        {/* Hero Subtitle */}
        <FadeIn delay={0.2}>
          <p className="text-xl md:text-2xl text-zinc-600 max-w-3xl mx-auto mb-12">
            The ultimate toolkit for Arknights: Endfield Global Server.
          </p>
        </FadeIn>
        
        {/* CTA Buttons */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Primary Button */}
            <Link 
              href="/blueprints" 
              className="bg-brand text-black px-8 py-4 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-brand-hover transition-colors"
            >
              Browse Blueprints
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            {/* Secondary Button */}
            <Link 
              href="/map" 
              className="bg-white text-black border-2 border-black px-8 py-4 rounded-md font-bold text-lg hover:bg-zinc-100 transition-colors"
            >
              Interactive Map
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}