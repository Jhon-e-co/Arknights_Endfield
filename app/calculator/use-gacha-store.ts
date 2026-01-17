import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GachaSystem, GachaResult } from '@/lib/gacha/engine';
import { Character } from '@/lib/gacha/data';

interface GachaState {
  pity6: number;
  pity5: number;
  history: GachaResult[];
  inventory: Record<string, number>;
  totalPulls: number;
  lastResults: GachaResult[] | null;
  isAnimating: boolean;
}

interface GachaActions {
  performPull: (count: 1 | 10) => void;
  resetHistory: () => void;
  clearLastResults: () => void;
  setAnimating: (isAnimating: boolean) => void;
}

type GachaStore = GachaState & GachaActions;

export const useGachaStore = create<GachaStore>()(
  persist(
    (set, get) => ({
      pity6: 0,
      pity5: 0,
      history: [],
      inventory: {},
      totalPulls: 0,
      lastResults: null,
      isAnimating: false,

      performPull: (count: 1 | 10) => {
        const { pity6, pity5, history, inventory, totalPulls } = get();
        const system = new GachaSystem({ pity6, pity5 });

        let results: GachaResult[];
        if (count === 10) {
          results = system.rollTen();
        } else {
          results = [system.rollSingle()];
        }

        const newState = system.getState();

        const newInventory = { ...inventory };
        results.forEach((result) => {
          const charId = result.character.id;
          newInventory[charId] = (newInventory[charId] || 0) + 1;
        });

        const newHistory = [...results, ...history];

        set({
          pity6: newState.pity6,
          pity5: newState.pity5,
          history: newHistory,
          inventory: newInventory,
          totalPulls: totalPulls + count,
          lastResults: results,
          isAnimating: true,
        });
      },

      resetHistory: () => {
        set({
          pity6: 0,
          pity5: 0,
          history: [],
          inventory: {},
          totalPulls: 0,
          lastResults: null,
        });
      },

      clearLastResults: () => {
        set({ lastResults: null, isAnimating: false });
      },

      setAnimating: (isAnimating: boolean) => {
        set({ isAnimating });
      },
    }),
    {
      name: 'gacha-storage',
    }
  )
);

export function getCharacterById(id: string): Character | undefined {
  const { inventory } = useGachaStore.getState();
  const history = useGachaStore.getState().history;
  
  for (const result of history) {
    if (result.character.id === id) {
      return result.character;
    }
  }
  return undefined;
}
