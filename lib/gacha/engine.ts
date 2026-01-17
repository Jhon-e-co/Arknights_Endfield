import { Character, getRandomCharacter, Rarity } from './data';

export interface GachaResult {
  character: Character;
  newPity6: number;
  newPity5: number;
}

export interface GachaState {
  pity6: number;
  pity5: number;
}

export class GachaSystem {
  private pity6: number;
  private pity5: number;

  constructor(initialState?: Partial<GachaState>) {
    this.pity6 = initialState?.pity6 ?? 0;
    this.pity5 = initialState?.pity5 ?? 0;
  }

  getState(): GachaState {
    return {
      pity6: this.pity6,
      pity5: this.pity5,
    };
  }

  private calculate6StarProbability(): number {
    if (this.pity6 >= 80) {
      return 1.0;
    }
    if (this.pity6 >= 65) {
      return 0.008 + (this.pity6 - 64) * 0.05;
    }
    return 0.008;
  }

  private calculate5StarProbability(): number {
    if (this.pity5 >= 10) {
      return 1.0;
    }
    return 0.08;
  }

  rollSingle(): GachaResult {
    const roll = Math.random();
    let rarity: Rarity;
    let newPity6 = this.pity6 + 1;
    let newPity5 = this.pity5 + 1;

    const prob6 = this.calculate6StarProbability();

    if (roll < prob6) {
      rarity = 6;
      newPity6 = 0;
      newPity5 = 0;
    } else {
      const prob5 = this.calculate5StarProbability();
      const adjustedRoll = (roll - prob6) / (1 - prob6);

      if (adjustedRoll < prob5) {
        rarity = 5;
        newPity5 = 0;
      } else {
        rarity = 4;
      }
    }

    this.pity6 = newPity6;
    this.pity5 = newPity5;

    return {
      character: getRandomCharacter(rarity),
      newPity6,
      newPity5,
    };
  }

  rollTen(): GachaResult[] {
    const results: GachaResult[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(this.rollSingle());
    }
    return results;
  }

  reset() {
    this.pity6 = 0;
    this.pity5 = 0;
  }
}

export function rollSingle(currentPity6: number, currentPity5: number): GachaResult {
  const system = new GachaSystem({ pity6: currentPity6, pity5: currentPity5 });
  return system.rollSingle();
}

export function rollTen(currentPity6: number, currentPity5: number): GachaResult[] {
  const system = new GachaSystem({ pity6: currentPity6, pity5: currentPity5 });
  return system.rollTen();
}
