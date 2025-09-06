import { MacroSegment } from './TodaysNutritionTypes';

// Sample nutrition data
export const currentCalories = 1721;
export const targetCalories = 2213;
export const totalProgress = (currentCalories / targetCalories) * 100;

export const macroSegments: MacroSegment[] = [
  {
    id: 'protein',
    name: 'Protein',
    amount: 78,
    unit: 'g',
    calories: 312,
    percentage: 18,
    color: '#34D399',
    gradient: ['#A7F3D0', '#6EE7B7', '#34D399'],
    glowColor: 'rgba(52, 211, 153, 0.3)'
  },
  {
    id: 'carbs',
    name: 'Carbs',
    amount: 95,
    unit: 'g',
    calories: 380,
    percentage: 22,
    color: '#A78BFA',
    gradient: ['#DDD6FE', '#C4B5FD', '#A78BFA'],
    glowColor: 'rgba(167, 139, 250, 0.3)'
  },
  {
    id: 'fat',
    name: 'Fat',
    amount: 45,
    unit: 'g',
    calories: 405,
    percentage: 24,
    color: '#FBBF24',
    gradient: ['#FEF3C7', '#FDE68A', '#FBBF24'],
    glowColor: 'rgba(251, 191, 36, 0.3)'
  }
];