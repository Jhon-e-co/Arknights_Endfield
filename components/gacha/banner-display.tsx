'use client';

import { useGachaStore } from '@/app/tools/recruitment/use-gacha-store';

export default function BannerDisplay() {
  const { pity6, pity5, performPull, isAnimating } = useGachaStore();

  const handlePull = (count: 1 | 10) => {
    if (!isAnimating) {
      performPull(count);
    }
  };

  return (
    <div className="bg-white border-2 border-zinc-200 rounded-lg overflow-hidden shadow-lg">
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-auto bg-gradient-to-br from-zinc-100 via-zinc-50 to-white flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, #FCEE21 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, #FF4400 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, #A855F7 0%, transparent 50%)
              `
            }} />
          </div>
          <div className="relative z-10 text-center px-8">
            <div className="text-6xl font-black text-zinc-200 mb-4 tracking-tighter">
              EF
            </div>
            <div className="w-16 h-1 bg-[#FCEE21] mx-auto mb-4" />
            <h2 className="text-2xl font-black font-bold text-zinc-800 mb-1">Standard Recruitment</h2>
            <p className="text-zinc-500 text-sm">Recruit operators for your squad</p>
          </div>
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-500 text-sm font-medium">CURRENCY</span>
              <span className="text-[#FCEE21] font-bold text-lg">∞</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-zinc-500 text-xs font-medium">6★ PITY</span>
                  <span className="text-[#FF4400] font-bold text-sm">{pity6}/80</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-1.5">
                  <div
                    className="bg-[#FF4400] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(pity6 / 80) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-zinc-500 text-xs font-medium">5★ PITY</span>
                  <span className="text-[#FCEE21] font-bold text-sm">{pity5}/10</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-1.5">
                  <div
                    className="bg-[#FCEE21] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(pity5 / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePull(10)}
              disabled={isAnimating}
              className="w-full bg-[#FCEE21] text-black font-bold py-4 px-6 rounded-lg hover:bg-[#E5D81C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              RECRUIT x10
            </button>
            <button
              onClick={() => handlePull(1)}
              disabled={isAnimating}
              className="w-full bg-zinc-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-800"
            >
              RECRUIT x1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
