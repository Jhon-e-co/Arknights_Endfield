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

export const MOCK_CHARACTERS: Character[] = [
  {
    id: '1',
    name: 'Aurora',
    avatar: 'https://via.placeholder.com/80/ffffff/000000?text=A',
    element: 'Heat'
  },
  {
    id: '2',
    name: 'Specter',
    avatar: 'https://via.placeholder.com/80/ffffff/000000?text=S',
    element: 'Volt'
  },
  {
    id: '3',
    name: 'Texas',
    avatar: 'https://via.placeholder.com/80/ffffff/000000?text=T',
    element: 'Physical'
  },
  {
    id: '4',
    name: 'Lappland',
    avatar: 'https://via.placeholder.com/80/ffffff/000000?text=L',
    element: 'Ice'
  },
  {
    id: '5',
    name: 'Exusiai',
    avatar: 'https://via.placeholder.com/80/ffffff/000000?text=E',
    element: 'Radiation'
  }
];

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

/**
 * Calculate the cost to upgrade a character from start level to end level
 * @param startLv Current level
 * @param endLv Target level
 * @returns CalculationResult with digiCash, expRecords, and materials
 */
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

  // Simulate material requirements based on level difference
  const materials = [
    {
      material: MOCK_MATERIALS[0], // Oroberyl
      quantity: Math.floor(levelDiff / 5) + 1
    },
    {
      material: MOCK_MATERIALS[1], // Nephrite
      quantity: Math.floor(levelDiff / 3) + 1
    },
    {
      material: MOCK_MATERIALS[2], // Aurumite
      quantity: Math.floor(levelDiff / 10) + 1
    }
  ];

  return {
    digiCash,
    expRecords,
    materials
  };
}