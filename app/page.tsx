import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion-wrapper';

export default function Home() {
  return (
    <>
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
        {/* Construction Notice Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FCEE21] text-black px-4 py-2 font-bold uppercase tracking-widest text-xs md:text-sm mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="animate-pulse">●</span>
          <span>System Notice: Early Preview / Features Under Construction</span>
        </div>

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

    {/* Features Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-black">
            Explore Endfield Lab
          </h2>
          <p className="text-zinc-600 text-center text-lg mb-12 max-w-2xl mx-auto">
            Powerful tools designed to enhance your Arknights: Endfield experience
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blueprint Card */}
          <FadeIn delay={0.1}>
            <Link href="/blueprints" className="block group">
              <div className="bg-white border-2 border-zinc-200 rounded-lg p-6 hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-black mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-zinc-700 transition-colors">
                  Automated Blueprints
                </h3>
                <p className="text-zinc-600">
                  Share and replicate efficient factory layouts
                </p>
              </div>
            </Link>
          </FadeIn>

          {/* Teams Card */}
          <FadeIn delay={0.2}>
            <Link href="/teams" className="block group">
              <div className="bg-white border-2 border-zinc-200 rounded-lg p-6 hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-black mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-zinc-700 transition-colors">
                  Tactical Squads
                </h3>
                <p className="text-zinc-600">
                  Optimize operator teams for high-difficulty stages
                </p>
              </div>
            </Link>
          </FadeIn>

          {/* Guides Card */}
          <FadeIn delay={0.3}>
            <Link href="/guides" className="block group">
              <div className="bg-white border-2 border-zinc-200 rounded-lg p-6 hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-black mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-zinc-700 transition-colors">
                  Strategy Guides
                </h3>
                <p className="text-zinc-600">
                  In-depth mechanics analysis and walkthroughs
                </p>
              </div>
            </Link>
          </FadeIn>

          {/* Map Card */}
          <FadeIn delay={0.4}>
            <Link href="/map" className="block group">
              <div className="bg-white border-2 border-zinc-200 rounded-lg p-6 hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-black mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-zinc-700 transition-colors">
                  Interactive Map
                </h3>
                <p className="text-zinc-600">
                  Resource nodes and landmark locations
                </p>
              </div>
            </Link>
          </FadeIn>

          {/* Calculator Card */}
          <FadeIn delay={0.5}>
            <Link href="/calculator" className="block group">
              <div className="bg-white border-2 border-zinc-200 rounded-lg p-6 hover:border-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-black mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-zinc-700 transition-colors">
                  Tools & Calculator
                </h3>
                <p className="text-zinc-600">
                  Production efficiency and material planning
                </p>
              </div>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>

    {/* Status & Feedback Section */}
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4 text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-black">
            Work in Progress
          </h2>
          <p className="text-zinc-600 text-lg mb-8 max-w-2xl mx-auto">
            Endfield Lab is currently in active development. Features may change as we improve the platform.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="bg-white border-2 border-black rounded-lg p-8 max-w-2xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-bold mb-4 text-black">
              We Need Your Feedback
            </h3>
            <p className="text-zinc-600 mb-6">
              Have a suggestion or found a bug? Help us build the ultimate toolkit for Arknights: Endfield players.
            </p>
            <a 
              href="mailto:endfieldlabs@gmail.com"
              className="inline-flex items-center gap-3 bg-[#FCEE21] text-black px-6 py-3 rounded-md font-bold hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              endfieldlabs@gmail.com
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
    </>
  );
}