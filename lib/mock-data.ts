export interface User {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  blueprintsCreated: number;
  totalLikes: number;
}

export interface CharacterGuide {
  overview: {
    tier: 'T0' | 'T1' | 'T2' | 'T3';
    role: string[];
    tips: string;
  };
  skillPriority: {
    name: string;
    type: 'Normal' | 'Ultimate' | 'Combo' | 'Passive';
    priority: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  loadout: {
    bestWeapons: string[];
    bestEquipment: string[];
    statsPriority: string[];
  };
  teams: {
    name: string;
    members: string[];
    description: string;
  }[];
}

export interface Character {
  id: string;
  name: string;
  element: 'heat' | 'cryo' | 'electric' | 'physical' | 'nature';
  avatar?: string;
  portrait?: string;
  rarity: number;
  guide?: CharacterGuide;
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
  initialIsLiked?: boolean;
  initialIsCollected?: boolean;
}

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'EndAdmin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EndAdmin',
    banner: 'https://via.placeholder.com/1200x300/1a1a1a/FFFFFF?text=EndAdmin+Banner',
    bio: 'Official Endfield Lab Administrator. Creating high-quality blueprints for the community.',
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
    element: 'physical',
    portrait: 'Endministrator.webp',
    rarity: 6,
    guide: {
      overview: {
        tier: 'T0',
        role: ['Main DPS', 'Physics', 'Breaker'],
        tips: 'A powerful physical carry that excels at breaking enemy stances and dealing massive burst damage via Ultimate.'
      },
      skillPriority: [
        {
          name: 'Constructive Sequence',
          type: 'Normal',
          priority: 'High',
          description: 'A forceful burst of Originium Arts that attacks enemies within the area of effect. Deals Physical DMG and applies Crush.'
        },
        {
          name: 'Bombardment Sequence',
          type: 'Ultimate',
          priority: 'High',
          description: 'Bombards the ground with Originium Arts, dealing massive Physical DMG to all enemies within a fan-shaped area. Consumes Originium Crystals for extra DMG.'
        },
        {
          name: 'Sealing Sequence',
          type: 'Combo',
          priority: 'Medium',
          description: 'COMBO TRIGGER: Rushes to the enemy side to deal Physical DMG and attach Originium Crystals that temporarily seals them.'
        }
      ],
      loadout: {
        bestWeapons: ['Judgement', 'Standard Issue Blade'],
        bestEquipment: ['Frontline Assault Set'],
        statsPriority: ['Atk%', 'Crit Dmg', 'Physical DMG Bonus']
      },
      teams: [
        {
          name: 'Fast Break Comp',
          members: ['char-3', 'char-1'],
          description: 'Chen Qianyu rapidly builds up the Break gauge with her skills. Once broken, Endministrator follows up with Bombardment Sequence for massive burst damage.'
        },
        {
          name: 'Starter Combo',
          members: ['char-2', 'char-1'],
          description: 'Perlica initiates with Chain skills to trigger Endministrator\'s QTE entry, allowing for a smooth combat flow.'
        }
      ]
    }
  },
  {
    id: 'char-2',
    name: 'Perlica',
    element: 'electric',
    portrait: 'Perlica.webp',
    rarity: 5
  },
  {
    id: 'char-3',
    name: 'Chen Qianyu',
    element: 'physical',
    portrait: 'Chen_Qianyu.webp',
    rarity: 5
  },
  {
    id: 'char-4',
    name: 'Alesh',
    element: 'cryo',
    portrait: 'Alesh.webp',
    rarity: 5
  },
  {
    id: 'char-5',
    name: 'Wulfgard',
    element: 'heat',
    portrait: 'Wulfgard.webp',
    rarity: 5
  },
  {
    id: 'char-6',
    name: 'Xaihi',
    element: 'cryo',
    portrait: 'Xaihi.webp',
    rarity: 5
  },
  {
    id: 'char-7',
    name: 'Ember',
    element: 'heat',
    portrait: 'Ember.webp',
    rarity: 6
  },
  {
    id: 'char-8',
    name: 'Avywenna',
    element: 'electric',
    portrait: 'Avywenna.webp',
    rarity: 5
  },
  {
    id: 'char-9',
    name: 'Akekuri',
    element: 'heat',
    portrait: 'Akekuri.webp',
    avatar: 'Akekuri.webp',
    rarity: 4
  },
  {
    id: 'char-10',
    name: 'Antal',
    element: 'electric',
    portrait: 'Antal.webp',
    avatar: 'Antal.webp',
    rarity: 4
  },
  {
    id: 'char-11',
    name: 'Arclight',
    element: 'electric',
    portrait: 'Arclight.webp',
    avatar: 'Arclight.webp',
    rarity: 5
  },
  {
    id: 'char-12',
    name: 'Ardelia',
    element: 'nature',
    portrait: 'Ardelia.webp',
    avatar: 'Ardelia.webp',
    rarity: 6
  },
  {
    id: 'char-13',
    name: 'Catcher',
    element: 'physical',
    portrait: 'Catcher.webp',
    avatar: 'Catcher.webp',
    rarity: 4
  },
  {
    id: 'char-14',
    name: 'Da_Pan',
    element: 'physical',
    portrait: 'Da_Pan.webp',
    avatar: 'Da_Pan.webp',
    rarity: 5
  },
  {
    id: 'char-15',
    name: 'Estella',
    element: 'cryo',
    portrait: 'Estella.webp',
    avatar: 'Estella.webp',
    rarity: 4
  },
  {
    id: 'char-16',
    name: 'Fluorite',
    element: 'nature',
    portrait: 'Fluorite.webp',
    avatar: 'Fluorite.webp',
    rarity: 4
  },
  {
    id: 'char-17',
    name: 'Gilberta',
    element: 'nature',
    portrait: 'Gilberta.webp',
    avatar: 'Gilberta.webp',
    rarity: 6
  },
  {
    id: 'char-18',
    name: 'Laevatain',
    element: 'heat',
    portrait: 'Laevatain.webp',
    avatar: 'Laevatain.webp',
    rarity: 6
  },
  {
    id: 'char-19',
    name: 'Last_Rite',
    element: 'cryo',
    portrait: 'Last_Rite.webp',
    avatar: 'Last_Rite.webp',
    rarity: 6
  },
  {
    id: 'char-20',
    name: 'Lifeng',
    element: 'physical',
    portrait: 'Lifeng.webp',
    avatar: 'Lifeng.webp',
    rarity: 6
  },
  {
    id: 'char-21',
    name: 'Pogranichnik',
    element: 'physical',
    portrait: 'Pogranichnik.webp',
    avatar: 'Pogranichnik.webp',
    rarity: 6
  },
  {
    id: 'char-22',
    name: 'Snowshine',
    element: 'cryo',
    portrait: 'Snowshine.webp',
    avatar: 'Snowshine.webp',
    rarity: 5
  },
  {
    id: 'char-23',
    name: 'Yvonne',
    element: 'cryo',
    portrait: 'Yvonne.webp',
    avatar: 'Yvonne.webp',
    rarity: 6
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

export function getCharacterAvatar(character: Character): string {
  if (character.avatar && character.avatar.startsWith('http')) {
    return character.avatar;
  }
  if (character.avatar) {
    return character.avatar.startsWith('/images/avatars/')
      ? character.avatar
      : `/images/avatars/${character.avatar}`;
  }
  return `/images/avatars/${character.name.replace(/\s+/g, '_')}.webp`;
}

export function getCharacterPortrait(character: Character): string {
  if (character.portrait) return `/characters/${character.portrait}`;
  return `/characters/${character.name.replace(/\s+/g, '_')}.webp`;
}