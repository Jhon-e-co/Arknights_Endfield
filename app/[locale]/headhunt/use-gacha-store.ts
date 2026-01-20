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
  isPulling: boolean;
  error: string | null;
  isGuestMode: boolean;
}

interface GachaActions {
  performPull: (count: 1 | 10) => Promise<void>;
  fetchStats: () => Promise<void>;
  resetHistory: () => void;
  clearLastResults: () => void;
  setAnimating: (isAnimating: boolean) => void;
  setError: (error: string | null) => void;
  setHistory: (history: GachaResult[], inventory: Record<string, number>) => void;
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
      isPulling: false,
      error: null,
      isGuestMode: false,

      performPull: async (count: 1 | 10) => {
        const { history, inventory, totalPulls, pity6, pity5 } = get();
        
        set({ isPulling: true, error: null });

        try {
          const response = await fetch('/api/gacha/pull', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count }),
          });

          if (response.status === 401) {
            console.log('Guest mode detected, switching to local calculation');
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
              isPulling: false,
              isGuestMode: true,
              error: null,
            });
            return;
          }

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to perform pull');
          }

          const { data } = await response.json();

          const results: GachaResult[] = data.results.map((r: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
            character: {
              id: r.character.id,
              name: r.character.name,
              rarity: r.character.rarity,
              element: r.character.element,
              type: r.character.type,
              image: r.character.image,
            },
            newPity6: r.newPity6,
            newPity5: r.newPity5,
          }));

          const newInventory = { ...inventory };
          results.forEach((result) => {
            const charId = result.character.id;
            newInventory[charId] = (newInventory[charId] || 0) + 1;
          });

          const newHistory = [...results, ...history];

          set({
            pity6: data.pity6,
            pity5: data.pity5,
            history: newHistory,
            inventory: newInventory,
            totalPulls: totalPulls + count,
            lastResults: results,
            isAnimating: true,
            isPulling: false,
            isGuestMode: false,
          });
        } catch (error) {
          console.error('Pull error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to perform pull',
            isPulling: false,
          });
        }
      },

      fetchStats: async () => {
        set({ error: null });

        try {
          const response = await fetch('/api/gacha/stats');

          if (response.status === 401) {
            return;
          }

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch stats');
          }

          const { data } = await response.json();

          set({
            pity6: data.currentPity6,
            pity5: data.currentPity5,
            totalPulls: data.totalPulls,
          });
        } catch (error) {
          console.error('Stats fetch error:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch stats',
          });
        }
      },

      resetHistory: () => {
        set({
          pity6: 0,
          pity5: 0,
          history: [],
          inventory: {},
          totalPulls: 0,
          lastResults: null,
          isGuestMode: false,
        });
      },

      clearLastResults: () => {
        set({ lastResults: null, isAnimating: false });
      },

      setAnimating: (isAnimating: boolean) => {
        set({ isAnimating });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setHistory: (history: GachaResult[], inventory: Record<string, number>) => {
        set({ history, inventory });
      },
    }),
    {
      name: 'headhunt-storage',
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
