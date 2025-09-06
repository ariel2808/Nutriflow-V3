// Sample ingredient data for the meal creation interface
export const SAMPLE_INGREDIENTS = [
  {
    id: '1',
    name: 'Banana',
    description: '1 whole, regular (150 g)',
    calories: 134,
    carbs: 34.0,
    protein: 1.3,
    fat: 0.4,
    defaultAmount: 1,
    defaultUnit: 'whole'
  },
  {
    id: '2',
    name: 'Avocado',
    description: '1 medium (150 g)',
    calories: 160,
    carbs: 4.0,
    protein: 2.0,
    fat: 14.7,
    defaultAmount: 0.5,
    defaultUnit: 'medium'
  },
  {
    id: '3',
    name: 'Egg, boiled',
    description: '1 egg, regular (60 g)',
    calories: 93,
    carbs: 0.6,
    protein: 6.3,
    fat: 6.5,
    defaultAmount: 2,
    defaultUnit: 'eggs'
  },
  {
    id: '4',
    name: 'Oatmeal',
    description: '1 cup cooked (240 g)',
    calories: 154,
    carbs: 28.0,
    protein: 5.4,
    fat: 3.2,
    defaultAmount: 1,
    defaultUnit: 'cup'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    description: '1 container (170 g)',
    calories: 100,
    carbs: 9.0,
    protein: 17.0,
    fat: 0.4,
    defaultAmount: 1,
    defaultUnit: 'container'
  },
  {
    id: '6',
    name: 'Almonds',
    description: '1 oz (28 g)',
    calories: 164,
    carbs: 6.1,
    protein: 6.0,
    fat: 14.2,
    defaultAmount: 1,
    defaultUnit: 'oz'
  }
];

// Filter options for ingredient lists
export const FILTER_OPTIONS = ['frequent', 'recent', 'created'] as const;