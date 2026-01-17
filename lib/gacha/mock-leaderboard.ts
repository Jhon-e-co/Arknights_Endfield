import { Character } from './data';

export interface LeaderboardEntry {
  id: string;
  username: string;
  rank: number;
  pullData: Character[];
  timestamp: Date;
}

const mockCharacters: Character[] = [
  {
    id: 'ember',
    name: 'Ember',
    rarity: 6,
    image: '/characters/Ember.webp',
  },
  {
    id: 'perlica',
    name: 'Perlica',
    rarity: 6,
    image: '/characters/Perlica.webp',
  },
  {
    id: 'hoshiguma',
    name: 'Hoshiguma',
    rarity: 5,
    image: '/characters/Hoshiguma.webp',
  },
  {
    id: 'kroos',
    name: 'Kroos',
    rarity: 4,
    image: '/characters/Kroos.webp',
  },
];

export const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    username: 'LuckyStar_99',
    rank: 1,
    pullData: [
      mockCharacters[0],
      mockCharacters[1],
      mockCharacters[2],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    username: 'GachaMaster',
    rank: 2,
    pullData: [
      mockCharacters[1],
      mockCharacters[2],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    username: 'EndfieldFan',
    rank: 3,
    pullData: [
      mockCharacters[0],
      mockCharacters[2],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '4',
    username: 'OperatorX',
    rank: 4,
    pullData: [
      mockCharacters[2],
      mockCharacters[2],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '5',
    username: 'NewPlayer',
    rank: 5,
    pullData: [
      mockCharacters[1],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
      mockCharacters[3],
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
];