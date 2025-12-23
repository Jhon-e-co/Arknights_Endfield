export interface User {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  blueprintsCreated: number;
  totalLikes: number;
}

export interface Character {
  id: string;
  name: string;
  element: 'fire' | 'ice' | 'electric' | 'physical' | 'ether';
  avatar: string;
  artwork: string;
  rarity: number;
}

export interface Squad {
  id: string;
  title: string;
  description: string;
  characterIds: string[];
  tags: string[];
  author: string;
  likes: number;
}

export interface Blueprint {
  id: string;
  title: string;
  author: string;
  author_id: string;
  image: string;
  tags: string[];
  likes: number;
  code: string;
  description: string;
  createdAt: string;
}

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'EndAdmin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EndAdmin',
    banner: 'https://via.placeholder.com/1200x300/1a1a1a/FFFFFF?text=EndAdmin+Banner',
    bio: 'Official Endfield Tools Administrator. Creating high-quality blueprints for the community.',
    blueprintsCreated: 2,
    totalLikes: 384
  },
  {
    id: 'user-2',
    name: 'Builder123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Builder123',
    banner: 'https://via.placeholder.com/1200x300/2a2a2a/FFFFFF?text=Builder123+Banner',
    bio: 'Passionate builder specializing in early game layouts and base designs.',
    blueprintsCreated: 1,
    totalLikes: 256
  },
  {
    id: 'user-3',
    name: 'AICMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AICMaster',
    banner: 'https://via.placeholder.com/1200x300/3a3a3a/FFFFFF?text=AICMaster+Banner',
    bio: 'End-game automation expert. Creating complex AIC systems for maximum efficiency.',
    blueprintsCreated: 1,
    totalLikes: 512
  },
  {
    id: 'user-4',
    name: 'HydroEngineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HydroEngineer',
    banner: 'https://via.placeholder.com/1200x300/4a4a4a/FFFFFF?text=HydroEngineer+Banner',
    bio: 'Water management specialist. Focused on sustainable and efficient water systems.',
    blueprintsCreated: 1,
    totalLikes: 192
  },
  {
    id: 'user-5',
    name: 'SolarExpert',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolarExpert',
    banner: 'https://via.placeholder.com/1200x300/5a5a5a/FFFFFF?text=SolarExpert+Banner',
    bio: 'Renewable energy advocate. Building clean power solutions for sustainable bases.',
    blueprintsCreated: 1,
    totalLikes: 384
  },
  {
    id: 'user-6',
    name: 'Strategist007',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Strategist007',
    banner: 'https://via.placeholder.com/1200x300/6a6a6a/FFFFFF?text=Strategist007+Banner',
    bio: 'Defense layout specialist. Creating fortified outposts and security systems.',
    blueprintsCreated: 1,
    totalLikes: 224
  }
];

export const CHARACTERS: Character[] = [
  {
    id: 'char-1',
    name: 'Endministrator',
    element: 'ether',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Endministrator',
    artwork: '/characters/Endministrator.webp',
    rarity: 6
  },
  {
    id: 'char-2',
    name: 'Perlica',
    element: 'ice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Perlica',
    artwork: '/characters/Perlica.webp',
    rarity: 6
  },
  {
    id: 'char-3',
    name: 'Chen',
    element: 'electric',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen',
    artwork: '/characters/Chen_Qianyu.webp',
    rarity: 6
  },
  {
    id: 'char-4',
    name: 'Angelina',
    element: 'electric',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angelina',
    artwork: '/characters/Alesh.webp',
    rarity: 6
  },
  {
    id: 'char-5',
    name: 'Wulfgard',
    element: 'physical',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wulfgard',
    artwork: '/characters/Wulfgard.webp',
    rarity: 5
  },
  {
    id: 'char-6',
    name: 'Xaihi',
    element: 'fire',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xaihi',
    artwork: '/characters/Xaihi.webp',
    rarity: 5
  },
  {
    id: 'char-7',
    name: 'Ember',
    element: 'fire',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ember',
    artwork: '/characters/Ember.webp',
    rarity: 5
  },
  {
    id: 'char-8',
    name: 'Avy',
    element: 'ice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avy',
    artwork: '/characters/Avywenna.webp',
    rarity: 4
  }
];

export const MOCK_SQUADS: Squad[] = [
  {
    id: 'squad-1',
    title: 'Perlica Perma-Freeze Team',
    description: 'A freeze-focused team built around Perlica\'s ice abilities. Excellent for crowd control and sustained damage.',
    characterIds: ['char-2', 'char-8', 'char-3', 'char-4'],
    tags: ['Freeze', 'CC', 'Sustained'],
    author: 'EndAdmin',
    likes: 256
  },
  {
    id: 'squad-2',
    title: 'Electric Burst Squad',
    description: 'High burst damage team centered around electric element characters. Great for quick eliminations.',
    characterIds: ['char-3', 'char-4', 'char-1', 'char-5'],
    tags: ['Burst', 'Electric', 'Damage'],
    author: 'Builder123',
    likes: 192
  },
  {
    id: 'squad-3',
    title: 'Fire & Physical Hybrid',
    description: 'Balanced team combining fire and physical elements for versatile combat situations.',
    characterIds: ['char-6', 'char-7', 'char-5', 'char-2'],
    tags: ['Hybrid', 'Versatile', 'Balanced'],
    author: 'AICMaster',
    likes: 128
  }
];

export const MOCK_BLUEPRINTS: Blueprint[] = [
  {
    id: '1',
    title: 'High Efficiency Iron Smelting',
    author: 'EndAdmin',
    author_id: 'user-1',
    image: 'https://via.placeholder.com/800x450/ffffff/000000?text=IRON+SMELTING',
    tags: ['Iron', 'Early Game', 'Power'],
    likes: 128,
    code: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'A highly efficient iron smelting layout that maximizes output while minimizing energy consumption. Ideal for early game resource production.',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Starter Hub Layout',
    author: 'Builder123',
    author_id: 'user-2',
    image: 'https://via.placeholder.com/800x450/ffffff/000000?text=STARTER+HUB',
    tags: ['Base Layout', 'Early Game', 'Logistics'],
    likes: 256,
    code: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'A well-designed starter hub that includes all essential facilities for a smooth early game experience. Easy to expand as your base grows.',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'End-game AIC Complex',
    author: 'AICMaster',
    author_id: 'user-3',
    image: 'https://via.placeholder.com/800x450/ffffff/000000?text=AIC+COMPLEX',
    tags: ['AIC', 'End Game', 'Automation'],
    likes: 512,
    code: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'A massive AIC complex that automates almost all aspects of your base. Requires advanced technology and resources, but provides unparalleled efficiency.',
    createdAt: '2024-02-05'
  },
  {
    id: '4',
    title: 'Water Purification Plant',
    author: 'HydroEngineer',
    author_id: 'user-4',
    image: 'https://via.placeholder.com/800x450/ffffff/000000?text=WATER+PLANT',
    tags: ['Water', 'Mid Game', 'Sustainability'],
    likes: 192,
    code: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'A self-sustaining water purification plant that converts contaminated water into clean, usable resources. Essential for mid-game expansion.',
    createdAt: '2024-01-28'
  },
  {
    id: '5',
    title: 'Solar Power Array',
    author: 'SolarExpert',
    author_id: 'user-5',
    image: 'https://via.placeholder.com/800x450/ffffff/000000?text=SOLAR+ARRAY',
    tags: ['Power', 'Renewable', 'Mid Game'],
    likes: 384,
    code: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'A large-scale solar power array that provides clean, renewable energy for your base. Works best in sunny environments.',
    createdAt: '2024-02-01'
  },
  {
    id: '6',
    title: 'Defense Outpost Layout',
    author: 'Strategist007',
    author_id: 'user-6',
    image: 'https://via.placeholder.com/800x450/ffffff/000000?text=DEFENSE+OUTPOST',
    tags: ['Defense', 'Mid Game', 'Security'],
    likes: 224,
    code: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==',
    description: 'A robust defense outpost that can withstand waves of enemy attacks. Features multiple layers of defenses and emergency systems.',
    createdAt: '2024-02-10'
  }
];

/**
 * Get a blueprint by its ID
 * @param id The ID of the blueprint to retrieve
 * @returns The blueprint if found, undefined otherwise
 */
export function getBlueprintById(id: string): Blueprint | undefined {
  return MOCK_BLUEPRINTS.find(blueprint => blueprint.id === id);
}

/**
 * Get a user by their ID
 * @param id The ID of the user to retrieve
 * @returns The user if found, undefined otherwise
 */
export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find(user => user.id === id);
}

/**
 * Get all blueprints by a specific author
 * @param authorId The ID of the author
 * @returns Array of blueprints by the author
 */
export function getBlueprintsByAuthor(authorId: string): Blueprint[] {
  return MOCK_BLUEPRINTS.filter(blueprint => blueprint.author_id === authorId);
}

/**
 * Get a character by its ID
 * @param id The ID of the character to retrieve
 * @returns The character if found, undefined otherwise
 */
export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find(character => character.id === id);
}

/**
 * Get a squad by its ID
 * @param id The ID of the squad to retrieve
 * @returns The squad if found, undefined otherwise
 */
export function getSquadById(id: string): Squad | undefined {
  return MOCK_SQUADS.find(squad => squad.id === id);
}

/**
 * Get characters by their IDs
 * @param ids Array of character IDs
 * @returns Array of characters
 */
export function getCharactersByIds(ids: string[]): Character[] {
  return ids.map(id => getCharacterById(id)).filter((char): char is Character => char !== undefined);
}