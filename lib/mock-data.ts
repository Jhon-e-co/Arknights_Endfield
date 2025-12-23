export interface User {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  bio: string;
  blueprintsCreated: number;
  totalLikes: number;
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