'use client';

import { useGachaStore } from '@/app/calculator/use-gacha-store';

export default function BannerDisplay() {
  const { pity6, pity5, performPull, isAnimating } = useGachaStore();

  const handlePull = (count: 1 | 10) => {
    if (!isAnimating) {
      performPull(count);
    }
  };

  return (
    <div className="bg-zinc-900 border-2 border-[#FCEE21] rounded-lg overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="relative h-64 md:h-auto bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <img
            src="https://placehold.co/600x400/1a1a1a/FCEE21?text=Recruitment+Banner"
            alt="Recruitment Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">Standard Recruitment</h2>
            <p className="text-zinc-400 text-sm">Recruit operators for your squad</p>
          </div>
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-sm font-medium">CURRENCY</span>
              <span className="text-[#FCEE21] font-bold text-lg">∞</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-zinc-400 text-xs font-medium">6★ PITY</span>
                  <span className="text-[#FF4400] font-bold text-sm">{pity6}/80</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
                  <div
                    className="bg-[#FF4400] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(pity6 / 80) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-zinc-400 text-xs font-medium">5★ PITY</span>
                  <span className="text-[#FCEE21] font-bold text-sm">{pity5}/10</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-1.5">
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
              className="w-full bg-[#FCEE21] text-black font-bold py-4 px-6 rounded-lg hover:bg-[#E5D81C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              RECRUIT x10
            </button>
            <button
              onClick={() => handlePull(1)}
              disabled={isAnimating}
              className="w-full bg-zinc-800 text-white font-bold py-3 px-6 rounded-lg border-2 border-zinc-700 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              RECRUIT x1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
