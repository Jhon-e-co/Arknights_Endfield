export type Rarity = 4 | 5 | 6;

export interface Character {
  id: string;
  name: string;
  rarity: Rarity;
  element: string;
  type: string;
}

export const RARITY_COLORS: Record<Rarity, string> = {
  6: '#FF4400',
  5: '#FCEE21',
  4: '#A855F7',
};

export const CHARACTERS: Character[] = [
  {
    id: 'ember',
    name: 'Ember',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'gilberta',
    name: 'Gilberta',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'lifeng',
    name: 'Lifeng',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'laevatain',
    name: 'Laevatain',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'yvonne',
    name: 'Yvonne',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'ardelia',
    name: 'Ardelia',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'last-rite',
    name: 'Last Rite',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'pogranichnik',
    name: 'Pogranichnik',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'perlica',
    name: 'Perlica',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'chen-qianyu',
    name: 'Chen Qianyu',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'wulfgard',
    name: 'Wulfgard',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'arclight',
    name: 'Arclight',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'xaihi',
    name: 'Xaihi',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'avywenna',
    name: 'Avywenna',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'snowshine',
    name: 'Snowshine',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'da-pan',
    name: 'Da Pan',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'alesh',
    name: 'Alesh',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'akekuri',
    name: 'Akekuri',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'catcher',
    name: 'Catcher',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'estella',
    name: 'Estella',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'fluorite',
    name: 'Fluorite',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
  },
  {
    id: 'antal',
    name: 'Antal',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
  },
];

export function getCharactersByRarity(rarity: Rarity): Character[] {
  return CHARACTERS.filter((char) => char.rarity === rarity);
}

export function getRandomCharacter(rarity: Rarity): Character {
  const characters = getCharactersByRarity(rarity);
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}
