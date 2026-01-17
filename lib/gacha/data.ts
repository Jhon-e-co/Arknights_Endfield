export type Rarity = 4 | 5 | 6;

export interface Character {
  id: string;
  name: string;
  rarity: Rarity;
  element: string;
  type: string;
  image: string;
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
    image: '/characters/Ember.webp',
  },
  {
    id: 'gilberta',
    name: 'Gilberta',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Gilberta.webp',
  },
  {
    id: 'lifeng',
    name: 'Lifeng',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Lifeng.webp',
  },
  {
    id: 'laevatain',
    name: 'Laevatain',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Laevatain.webp',
  },
  {
    id: 'yvonne',
    name: 'Yvonne',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Yvonne.webp',
  },
  {
    id: 'ardelia',
    name: 'Ardelia',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Ardelia.webp',
  },
  {
    id: 'last-rite',
    name: 'Last Rite',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Last_Rite.webp',
  },
  {
    id: 'pogranichnik',
    name: 'Pogranichnik',
    rarity: 6,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Pogranichnik.webp',
  },
  {
    id: 'perlica',
    name: 'Perlica',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Perlica.webp',
  },
  {
    id: 'chen-qianyu',
    name: 'Chen Qianyu',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Chen_Qianyu.webp',
  },
  {
    id: 'wulfgard',
    name: 'Wulfgard',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Wulfgard.webp',
  },
  {
    id: 'arclight',
    name: 'Arclight',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Arclight.webp',
  },
  {
    id: 'xaihi',
    name: 'Xaihi',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Xaihi.webp',
  },
  {
    id: 'avywenna',
    name: 'Avywenna',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Avywenna.webp',
  },
  {
    id: 'snowshine',
    name: 'Snowshine',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Snowshine.webp',
  },
  {
    id: 'da-pan',
    name: 'Da Pan',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Da_Pan.webp',
  },
  {
    id: 'alesh',
    name: 'Alesh',
    rarity: 5,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Alesh.webp',
  },
  {
    id: 'akekuri',
    name: 'Akekuri',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Akekuri.webp',
  },
  {
    id: 'catcher',
    name: 'Catcher',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Catcher.webp',
  },
  {
    id: 'estella',
    name: 'Estella',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Estella.webp',
  },
  {
    id: 'fluorite',
    name: 'Fluorite',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Fluorite.webp',
  },
  {
    id: 'antal',
    name: 'Antal',
    rarity: 4,
    element: 'Unknown',
    type: 'Unknown',
    image: '/characters/Antal.webp',
  },
];

export function getCharactersByRarity(rarity: Rarity): Character[] {
  return CHARACTERS.filter((char) => char.rarity === rarity);
}

const CHARACTERS_BY_RARITY_CACHE: Record<Rarity, Character[]> = {
  6: getCharactersByRarity(6),
  5: getCharactersByRarity(5),
  4: getCharactersByRarity(4),
};

export function getRandomCharacter(rarity: Rarity): Character {
  const characters = CHARACTERS_BY_RARITY_CACHE[rarity];
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}
