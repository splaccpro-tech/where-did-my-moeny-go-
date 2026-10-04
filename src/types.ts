export type CategoryId = 'food' | 'shopping' | 'transport' | 'entertainment' | 'others';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // ISO YYYY-MM-DD
  createdAt: number;
}

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  food: {
    id: 'food',
    name: 'Food',
    emoji: '🍔',
    color: '#ea580c', // Orange
    bgColor: '#fff7ed',
  },
  shopping: {
    id: 'shopping',
    name: 'Shopping',
    emoji: '🛍️',
    color: '#0284c7', // Sky Blue
    bgColor: '#f0f9ff',
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    emoji: '🚗',
    color: '#059669', // Emerald
    bgColor: '#ecfdf5',
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    emoji: '🎮',
    color: '#7c3aed', // Violet
    bgColor: '#f5f3ff',
  },
  others: {
    id: 'others',
    name: 'Others',
    emoji: '💻',
    color: '#475569', // Slate
    bgColor: '#f8fafc',
  },
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 250,
    category: 'food',
    description: 'Quick lunch with friends',
    date: '2026-10-04',
    createdAt: 1728038400000,
  },
  {
    id: 'exp-2',
    amount: 1850,
    category: 'shopping',
    description: 'Weekly grocery supplies',
    date: '2026-10-03',
    createdAt: 1727952000000,
  },
  {
    id: 'exp-3',
    amount: 220,
    category: 'transport',
    description: 'Metro card monthly recharge',
    date: '2026-10-02',
    createdAt: 1727865600000,
  },
  {
    id: 'exp-4',
    amount: 699,
    category: 'entertainment',
    description: 'Weekend movie tickets',
    date: '2026-10-01',
    createdAt: 1727779200000,
  },
  {
    id: 'exp-5',
    amount: 1200,
    category: 'food',
    description: 'Family dinner',
    date: '2026-09-30',
    createdAt: 1727692800000,
  },
  {
    id: 'exp-6',
    amount: 1450,
    category: 'others',
    description: 'Broadband internet bill',
    date: '2026-09-28',
    createdAt: 1727520000000,
  },
];
