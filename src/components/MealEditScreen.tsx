import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Camera, Plus, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreateMealIngredientEditModal } from './CreateMealIngredientEditModal';
import { SAMPLE_INGREDIENTS, FILTER_OPTIONS } from './createMeal/CreateMealConstants';
import {
  SelectedIngredient,
  Filter
} from './createMeal/CreateMealTypes';
import {
  filterIngredients,
  sortIngredients,
  calculateTotalNutrition,
  createSelectedIngredient,
  canSaveMeal
} from './createMeal/CreateMealHelpers';

interface MealData {
  id: string;
  name: string;
  description: string;
  icon?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: Array<{
    id: string;
    name: string;
    amount: string;
    icon: string;
  }>;
}

interface MealEditScreenProps {
  onBack: () => void;
  onSave: (mealData: any) => void;
  onDelete: () => void;
  mealData: MealData;
}

export function MealEditScreen({ onBack, onSave, onDelete, mealData }: MealEditScreenProps) {
  const [mealName, setMealName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Filter>('frequent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<string>>(new Set());
  const [editingIngredient, setEditingIngredient] = useState<SelectedIngredient | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  // Initialize form with existing meal data
  useEffect(() => {
    if (mealData) {
      setMealName(mealData.name);
      
      // Convert meal ingredients to SelectedIngredient format
      const convertedIngredients: SelectedIngredient[] = mealData.ingredients?.map((ingredient: any, index: number) => {
        // Extract amount and unit from the amount string (e.g., "3 large" -> amount: 3, unit: "large")
        const amountParts = ingredient.amount?.split(' ') || ['1'];
        const amount = parseFloat(amountParts[0]) || 1;
        const unit = amountParts.slice(1).join(' ') || 'portion';
        
        // Calculate nutrition per unit (reverse engineer from total meal nutrition)
        const portionCalories = Math.round(mealData.calories / (mealData.ingredients?.length || 1));
        const portionCarbs = (mealData.carbs / (mealData.ingredients?.length || 1));
        const portionProtein = (mealData.protein / (mealData.ingredients?.length || 1));
        const portionFat = (mealData.fat / (mealData.ingredients?.length || 1));
        
        return {
          id: ingredient.id || `ingredient-${index}`,
          name: ingredient.name || 'Unknown Ingredient',
          description: ingredient.amount || '1 portion',
          calories: portionCalories || 0,
          carbs: portionCarbs || 0,
          protein: portionProtein || 0,
          fat: portionFat || 0,
          amount: amount,
          unit: unit,
          totalCalories: portionCalories * amount || 0,
          totalCarbs: portionCarbs * amount || 0,
          totalProtein: portionProtein * amount || 0,
          totalFat: portionFat * amount || 0
        };
      }) || [];
      
      setSelectedIngredients(convertedIngredients);
      setSelectedIngredientIds(new Set(mealData.ingredients?.map((ing: any) => ing.id) || []));
    } else {
      // Provide default values if no meal data is available
      setMealName('Sample Recipe');
      const defaultIngredients: SelectedIngredient[] = [
        {
          id: 'banana-1',
          name: 'Banana',
          description: '1 medium',
          calories: 105,
          carbs: 27,
          protein: 1.3,
          fat: 0.4,
          amount: 1,
          unit: 'medium',
          totalCalories: 105,
          totalCarbs: 27,
          totalProtein: 1.3,
          totalFat: 0.4
        },
        {
          id: 'oats-1',
          name: 'Rolled Oats',
          description: '1/2 cup',
          calories: 150,
          carbs: 27,
          protein: 5,
          fat: 3,
          amount: 0.5,
          unit: 'cup',
          totalCalories: 150,
          totalCarbs: 27,
          totalProtein: 5,
          totalFat: 3
        }
      ];
      setSelectedIngredients(defaultIngredients);
      setSelectedIngredientIds(new Set(['banana-1', 'oats-1']));
    }
  }, [mealData]);

  // Calculate total nutrition
  const totalNutrition = calculateTotalNutrition(selectedIngredients);

  // Get filtered and sorted ingredients
  const filteredIngredients = filterIngredients(SAMPLE_INGREDIENTS, searchQuery);
  const sortedIngredients = sortIngredients(filteredIngredients, selectedIngredientIds);

  const handleAddIngredient = (ingredient: any) => {
    if (selectedIngredientIds.has(ingredient.id)) {
      // Remove ingredient
      setSelectedIngredients(prev => prev.filter(item => item.id !== ingredient.id));
      setSelectedIngredientIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(ingredient.id);
        return newSet;
      });
    } else {
      // Add ingredient
      const newIngredient = createSelectedIngredient(ingredient);
      setSelectedIngredients(prev => [...prev, newIngredient]);
      setSelectedIngredientIds(prev => new Set([...prev, ingredient.id]));
    }
  };

  const handleIngredientClick = (ingredient: any) => {
    if (selectedIngredientIds.has(ingredient.id)) {
      // Edit existing selected ingredient
      const selectedIngredient = selectedIngredients.find(item => item.id === ingredient.id);
      if (selectedIngredient) {
        setEditingIngredient(selectedIngredient);
        setIsEditPopupOpen(true);
      }
    } else {
      // Create new ingredient for editing
      const newIngredient = createSelectedIngredient(ingredient);
      setEditingIngredient(newIngredient);
      setIsEditPopupOpen(true);
    }
  };

  // Handle clicking on existing ingredients in the meal to edit them
  const handleExistingIngredientClick = (ingredient: SelectedIngredient) => {
    setEditingIngredient(ingredient);
    setIsEditPopupOpen(true);
  };

  const handleUpdateIngredient = (updatedIngredient: SelectedIngredient) => {
    if (selectedIngredientIds.has(updatedIngredient.id)) {
      // Update existing ingredient
      setSelectedIngredients(prev => 
        prev.map(item => 
          item.id === updatedIngredient.id ? updatedIngredient : item
        )
      );
    } else {
      // Add new ingredient to the list
      setSelectedIngredients(prev => [...prev, updatedIngredient]);
      setSelectedIngredientIds(prev => new Set([...prev, updatedIngredient.id]));
    }
    setIsEditPopupOpen(false);
    setEditingIngredient(null);
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));
    setSelectedIngredientIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(ingredientId);
      return newSet;
    });
  };

  const handleSave = () => {
    if (canSaveMeal(mealName, selectedIngredients)) {
      const updatedMealData = {
        ...mealData,
        name: mealName,
        ingredients: selectedIngredients,
        calories: totalNutrition.calories,
        carbs: totalNutrition.carbs,
        protein: totalNutrition.protein,
        fat: totalNutrition.fat,
        description: selectedIngredients.slice(0, 3).map(ing => ing.name).join(' + ') + 
                    (selectedIngredients.length > 3 ? ` + ${selectedIngredients.length - 3} more` : '')
      };
      onSave(updatedMealData);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${mealName}"? This action cannot be undone.`)) {
      onDelete();
    }
  };

  const canSave = canSaveMeal(mealName, selectedIngredients);

  return (
    <div 
      className="w-full h-screen overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-main)',
        maxWidth: '375px',
        margin: '0 auto'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header with exact structure from other screens */}
        <div className="px-5 pt-12 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status Bar */}
            <div 
              className="flex justify-between items-center mb-8 text-sm"
              style={{ 
                color: 'var(--text-secondary)',
                height: '20px'
              }}
            >
              <span>8:00 AM</span>
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 500 }}>22°C</span>
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={onBack} 
                className="p-2 -ml-2 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ChevronLeft size={24} style={{ color: 'var(--icon-secondary)' }} />
              </button>
              
              <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Edit Recipe
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full transition-all duration-200"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Trash2 size={18} style={{ color: '#EF4444' }} />
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={!canSave}
                  style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: canSave ? '#3B82F6' : '#9CA3AF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: canSave ? 'pointer' : 'not-allowed',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Meal Name Section */}
        <div className="px-5 mb-6 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center"
          >
            <div className="relative mb-6">
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="Enter recipe name"
                className="text-center bg-transparent border-none outline-none"
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  width: '240px',
                  borderBottom: `2px solid ${mealName ? '#3B82F6' : '#E5E7EB'}`,
                  paddingBottom: '8px',
                  transition: 'border-color 200ms ease-out'
                }}
              />
            </div>

            {/* Dynamic Nutrition Summary */}
            <AnimatePresence>
              {selectedIngredients.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-4 gap-4"
                >
                  <div className="text-center">
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {Math.round(totalNutrition.calories)}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Calories
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {totalNutrition.carbs.toFixed(1)}g
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Carbs
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {totalNutrition.protein.toFixed(1)}g
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Protein
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {totalNutrition.fat.toFixed(1)}g
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Fat
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Current Ingredients Section (only show if we have ingredients) */}
        <AnimatePresence>
          {selectedIngredients.length > 0 && (
            <motion.div 
              className="px-5 mb-6 flex-shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  marginBottom: '12px'
                }}>
                  Current Ingredients
                </h3>
                
                <div className="space-y-2">
                  {selectedIngredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer group"
                      style={{ backgroundColor: 'var(--bg-main)' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => handleExistingIngredientClick(ingredient)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ fontSize: '20px' }}>
                          {ingredient.name.toLowerCase().includes('banana') ? '🍌' :
                           ingredient.name.toLowerCase().includes('avocado') ? '🥑' :
                           ingredient.name.toLowerCase().includes('egg') ? '🥚' :
                           ingredient.name.toLowerCase().includes('oat') ? '🥣' :
                           ingredient.name.toLowerCase().includes('yogurt') ? '🥛' :
                           ingredient.name.toLowerCase().includes('almond') ? '🥜' :
                           ingredient.name.toLowerCase().includes('chicken') ? '🍗' :
                           ingredient.name.toLowerCase().includes('tuna') ? '🐟' :
                           ingredient.name.toLowerCase().includes('rice') ? '🍚' :
                           ingredient.name.toLowerCase().includes('lettuce') ? '🥬' :
                           ingredient.name.toLowerCase().includes('tomato') ? '🍅' :
                           ingredient.name.toLowerCase().includes('bread') ? '🍞' :
                           ingredient.name.toLowerCase().includes('cottage') ? '🥛' :
                           ingredient.name.toLowerCase().includes('butter') ? '🧈' : '🍽️'}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            {ingredient.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            {ingredient.amount} {ingredient.unit}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {Math.round(ingredient.totalCalories)} kcal
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveIngredient(ingredient.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all duration-200"
                          style={{ backgroundColor: 'transparent' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 size={12} style={{ color: '#EF4444' }} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar Section */}
        <div 
          className="px-4 py-4 flex-shrink-0"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#9CA3AF' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Add more ingredients..."
                className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200"
                style={{
                  height: '48px',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                  fontSize: '16px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => alert('Barcode scanning would be implemented here')}
              >
                <Camera size={18} style={{ color: '#6B7280' }} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4 flex-shrink-0" style={{ backgroundColor: '#F8F9FA' }}>
          <motion.div
            className="flex rounded-full p-1"
            style={{ backgroundColor: '#F3F4F6' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex-1 py-2 px-4 rounded-full transition-all duration-200 ${
                  selectedFilter === filter ? 'shadow-sm' : ''
                }`}
                style={{
                  backgroundColor: selectedFilter === filter ? '#FFFFFF' : 'transparent',
                  color: selectedFilter === filter ? '#1F2937' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  height: '36px'
                }}
                onMouseEnter={(e) => {
                  if (selectedFilter !== filter) {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFilter !== filter) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Ingredients List */}
        <div className="flex-1 overflow-y-auto px-4 pb-32">
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {sortedIngredients.map((ingredient, index) => {
                const isSelected = selectedIngredientIds.has(ingredient.id);
                
                return (
                  <motion.div
                    key={ingredient.id}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: '#FFFFFF',
                      minHeight: '64px'
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleIngredientClick(ingredient)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: isSelected ? '#3B82F6' : '#1F2937',
                          marginBottom: '2px',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif',
                          cursor: 'pointer'
                        }}>
                          {ingredient.name}
                        </h3>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {ingredient.calories} kcal
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {ingredient.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddIngredient(ingredient);
                      }}
                      className="ml-4 flex items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: isSelected ? '#10B981' : 'transparent',
                        border: `2px solid ${isSelected ? '#10B981' : '#3B82F6'}`,
                        color: isSelected ? '#FFFFFF' : '#3B82F6'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.95)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                    >
                      <motion.div
                        key={isSelected ? 'check' : 'plus'}
                        initial={{ rotate: -45, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 45, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isSelected ? <Check size={16} /> : <Plus size={16} />}
                      </motion.div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {sortedIngredients.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  No ingredients found
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  marginTop: '4px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Try adjusting your search
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer Actions */}
        <div 
          className="flex-shrink-0 px-4 py-4"
          style={{
            backgroundColor: 'var(--bg-main)',
            borderTop: '1px solid var(--border)'
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: 'var(--btn-secondary-bg)',
                color: 'var(--btn-secondary-text)',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                height: '48px',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 py-3 px-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: canSave ? '#3B82F6' : '#E5E7EB',
                color: canSave ? '#FFFFFF' : '#9CA3AF',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                height: '48px',
                border: 'none',
                cursor: canSave ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (canSave) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }
              }}
              onMouseLeave={(e) => {
                if (canSave) {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                }
              }}
            >
              Update Meal
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient Edit Modal */}
      <CreateMealIngredientEditModal
        isOpen={isEditPopupOpen}
        ingredient={editingIngredient}
        onClose={() => {
          setIsEditPopupOpen(false);
          setEditingIngredient(null);
        }}
        onUpdate={handleUpdateIngredient}
      />

      {/* Separator lines between items */}
      <style jsx>{`
        .space-y-1 > * + * {
          border-top: 1px solid #E5E7EB;
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}