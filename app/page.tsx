import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion-wrapper';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Endfield Lab',
    'applicationCategory': 'GameTool',
    'operatingSystem': 'Web',
    'description': 'The ultimate toolkit for Arknights: Endfield. Share and discover automation blueprints, interactive map, production calculator, squad builds, and guides for Global Server players.',
    'url': 'https://www.endfieldlab.info',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background Typography */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-[15vw] font-black text-zinc-200/50 uppercase select-none pointer-events-none whitespace-nowrap overflow-hidden -z-0">
        SYSTEMS
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-black">
          Explore Endfield Lab
        </h2>
        <p className="text-zinc-600 text-center text-lg mb-12 max-w-2xl mx-auto">
          Powerful tools designed to enhance your Arknights: Endfield experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/blueprints" className="block group">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FCEE21] transition-all rounded-2xl p-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FCEE21] border border-black mb-4 rounded-xl">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Automated Blueprints
              </h3>
              <p className="text-zinc-600">
                Share and replicate efficient factory layouts
              </p>
            </div>
          </Link>

          <Link href="/teams" className="block group">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FCEE21] transition-all rounded-2xl p-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FCEE21] border border-black mb-4 rounded-xl">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Tactical Squads
              </h3>
              <p className="text-zinc-600">
                Optimize operator teams for high-difficulty stages
              </p>
            </div>
          </Link>

          <Link href="/guides" className="block group">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FCEE21] transition-all rounded-2xl p-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FCEE21] border border-black mb-4 rounded-xl">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Strategy Guides
              </h3>
              <p className="text-zinc-600">
                In-depth mechanics analysis and walkthroughs
              </p>
            </div>
          </Link>

          <Link href="/map" className="block group">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FCEE21] transition-all rounded-2xl p-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FCEE21] border border-black mb-4 rounded-xl">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Interactive Map
              </h3>
              <p className="text-zinc-600">
                Resource nodes and landmark locations
              </p>
            </div>
          </Link>

          <Link href="/calculator" className="block group">
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FCEE21] transition-all rounded-2xl p-8">
              <div className="w-12 h-12 flex items-center justify-center bg-[#FCEE21] border border-black mb-4 rounded-xl">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                Tools & Calculator
              </h3>
              <p className="text-zinc-600">
                Production efficiency and material planning
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* Status & Feedback Section */}
    <section className="relative py-20 bg-zinc-50 overflow-hidden">
      {/* Background Typography */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-[15vw] font-black text-zinc-200/50 uppercase select-none pointer-events-none whitespace-nowrap overflow-hidden -z-0">
        FEEDBACK
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-black">
          Work in Progress
        </h2>
        <p className="text-zinc-600 text-lg mb-8 max-w-2xl mx-auto">
          Endfield Lab is currently in active development. Features may change as we improve the platform.
        </p>

        <div className="bg-white border-2 border-black rounded-lg p-8 max-w-2xl mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-bold mb-4 text-black">
            We Need Your Feedback
          </h3>
          <p className="text-zinc-600 mb-6">
            Have a suggestion or found a bug? Help us build the ultimate toolkit for Arknights: Endfield players.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:endfieldlabs@gmail.com"
                className="inline-flex items-center gap-3 bg-[#FCEE21] text-black px-6 py-3 rounded-md font-bold hover:bg-[#E5D81C] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                endfieldlabs@gmail.com
              </a>
              <a 
                href="https://discord.gg/dgdMsSYYxs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-md font-bold border border-zinc-700 hover:border-[#FCEE21] hover:text-[#FCEE21] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
                </svg>
                Join Discord
              </a>
            </div>
          </div>
      </div>
    </section>
    </>
  );
}