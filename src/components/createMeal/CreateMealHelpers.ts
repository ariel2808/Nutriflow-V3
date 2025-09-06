import { BaseIngredient, SelectedIngredient, TotalNutrition } from './CreateMealTypes';

/**
 * Filter ingredients based on search query
 */
export const filterIngredients = (ingredients: BaseIngredient[], searchQuery: string): BaseIngredient[] => {
  if (!searchQuery.trim()) return ingredients;
  return ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ingredient.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

/**
 * Sort ingredients with selected items first, then others
 */
export const sortIngredients = (
  ingredients: BaseIngredient[], 
  selectedIds: Set<string>
): BaseIngredient[] => {
  const selected = ingredients.filter(ingredient => selectedIds.has(ingredient.id));
  const unselected = ingredients.filter(ingredient => !selectedIds.has(ingredient.id));
  return [...selected, ...unselected];
};

/**
 * Calculate total nutrition from selected ingredients
 */
export const calculateTotalNutrition = (selectedIngredients: SelectedIngredient[]): TotalNutrition => {
  return selectedIngredients.reduce(
    (total, ingredient) => ({
      calories: total.calories + ingredient.totalCalories,
      carbs: total.carbs + ingredient.totalCarbs,
      protein: total.protein + ingredient.totalProtein,
      fat: total.fat + ingredient.totalFat
    }),
    { calories: 0, carbs: 0, protein: 0, fat: 0 }
  );
};

/**
 * Create a new selected ingredient from a base ingredient
 */
export const createSelectedIngredient = (baseIngredient: BaseIngredient): SelectedIngredient => {
  const multiplier = baseIngredient.defaultAmount || 1;
  return {
    id: baseIngredient.id,
    name: baseIngredient.name,
    description: baseIngredient.description,
    calories: baseIngredient.calories,
    carbs: baseIngredient.carbs,
    protein: baseIngredient.protein,
    fat: baseIngredient.fat,
    amount: baseIngredient.defaultAmount,
    unit: baseIngredient.defaultUnit,
    totalCalories: baseIngredient.calories * multiplier,
    totalCarbs: baseIngredient.carbs * multiplier,
    totalProtein: baseIngredient.protein * multiplier,
    totalFat: baseIngredient.fat * multiplier
  };
};

/**
 * Check if the meal can be saved (has name and ingredients)
 */
export const canSaveMeal = (mealName: string, selectedIngredients: SelectedIngredient[]): boolean => {
  return mealName.trim() !== '' && selectedIngredients.length > 0;
};

/**
 * Create meal data object for saving
 */
export const createMealData = (
  mealName: string, 
  selectedIngredients: SelectedIngredient[], 
  totalNutrition: TotalNutrition
) => {
  return {
    name: mealName.trim(),
    ingredients: selectedIngredients,
    nutrition: totalNutrition,
    createdAt: new Date().toISOString()
  };
};