// Filter types for ingredient lists
export type Filter = 'frequent' | 'recent' | 'created';

// Props interface for the main CreateMealScreen component
export interface CreateMealScreenProps {
  onBack: () => void;
  onSave: (mealData: any) => void;
}

// Interface for individual selected ingredients in the meal
export interface SelectedIngredient {
  id: string;
  name: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  amount: number;
  unit: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

// Interface for base ingredients from the database/sample data
export interface BaseIngredient {
  id: string;
  name: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  defaultAmount: number;
  defaultUnit: string;
}

// Interface for total nutrition summary
export interface TotalNutrition {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

// Interface for meal data when saving
export interface MealData {
  name: string;
  ingredients: SelectedIngredient[];
  nutrition: TotalNutrition;
  createdAt: string;
}