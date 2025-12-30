import { CHARACTERS, getCharacterAvatar } from './mock-data';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  element: string;
}

export interface Material {
  id: string;
  name: string;
  icon: string;
  rarity: number;
}

export interface CalculationResult {
  digiCash: number;
  expRecords: number;
  materials: Array<{
    material: Material;
    quantity: number;
  }>;
}

export const MOCK_MATERIALS: Material[] = [
  {
    id: '1',
    name: 'Oroberyl',
    icon: '🔴',
    rarity: 4
  },
  {
    id: '2',
    name: 'Nephrite',
    icon: '🟢',
    rarity: 3
  },
  {
    id: '3',
    name: 'Aurumite',
    icon: '🟡',
    rarity: 5
  },
  {
    id: '4',
    name: 'Exp Record',
    icon: '📚',
    rarity: 2
  }
];

export const MOCK_CHARACTERS: Character[] = CHARACTERS.map((char) => ({
  id: char.id,
  name: char.name,
  avatar: getCharacterAvatar(char),
  element: char.element.charAt(0).toUpperCase() + char.element.slice(1)
}));

export function calculateCost(startLv: number, endLv: number): CalculationResult {
  if (endLv <= startLv) {
    return {
      digiCash: 0,
      expRecords: 0,
      materials: []
    };
  }

  const levelDiff = endLv - startLv;
  const digiCash = levelDiff * 1000;
  const expRecords = levelDiff * 10;

  const materials = [
    {
      material: MOCK_MATERIALS[0],
      quantity: Math.floor(levelDiff / 5) + 1
    },
    {
      material: MOCK_MATERIALS[1],
      quantity: Math.floor(levelDiff / 3) + 1
    },
    {
      material: MOCK_MATERIALS[2],
      quantity: Math.floor(levelDiff / 10) + 1
    }
  ];

  return {
    digiCash,
    expRecords,
    materials
  };
}
