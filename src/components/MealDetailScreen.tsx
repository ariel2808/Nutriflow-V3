import React, { useState } from 'react';
import { ChevronLeft, Check, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { IngredientPreviewModal, PreviewIngredient } from './IngredientPreviewModal';

// Utensil icons as components for consistency
const ForkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l0 20"/>
    <path d="M17 7l-5 5 5 5"/>
    <path d="M7 7l5 5-5 5"/>
  </svg>
);

const KnifeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 8.5L12 12l-3.5 3.5L12 19l3.5-3.5"/>
    <path d="M12 2v4"/>
    <path d="M12 18v4"/>
  </svg>
);

// Sample meal data (same structure as view mode)
const defaultMealData = {
  id: '1',
  name: 'Quinoa Power Bowl',
  time: '12:30 PM',
  consumed: false,
  nutrition: {
    calories: 485,
    carbs: 52.3,
    protein: 18.7,
    fat: 22.1,
    dietaryFiber: 8.2,
    totalSugars: 12.1,
    addedSugars: 2.3,
    saturatedFat: 3.8,
    transFat: 0.1,
    vitaminA: 2847,
    vitaminC: 45.2,
    vitaminD: 120,
    vitaminE: 4.1,
    calcium: 89,
    iron: 4.2,
    magnesium: 128,
    potassium: 847,
    sodium: 324,
    zinc: 2.1,
    cholesterol: 15,
    caffeine: 0
  },
  ingredients: [
    { id: '1', name: 'Quinoa', amount: '1 cup', unit: 'cup', icon: '🌾', calories: 222, carbs: 39, protein: 8, fat: 4 },
    { id: '2', name: 'Avocado', amount: '1/2 medium', unit: 'medium', icon: '🥑', calories: 160, carbs: 8.5, protein: 2, fat: 15 },
    { id: '3', name: 'Chickpeas', amount: '1/2 cup', unit: 'cup', icon: '🫘', calories: 134, carbs: 22, protein: 7, fat: 2 },
    { id: '4', name: 'Cherry Tomatoes', amount: '1/2 cup', unit: 'cup', icon: '🍅', calories: 15, carbs: 3, protein: 1, fat: 0 },
    { id: '5', name: 'Cucumber', amount: '1/3 cup', unit: 'cup', icon: '🥒', calories: 5, carbs: 1, protein: 0, fat: 0 },
    { id: '6', name: 'Feta Cheese', amount: '2 tbsp', unit: 'tbsp', icon: '🧀', calories: 75, carbs: 1, protein: 4, fat: 6 }
  ]
};

interface MealDetailScreenProps {
  onBack: () => void;
  onEdit?: () => void;
  mealData?: typeof defaultMealData;
}

interface NutritionRowProps {
  label: string;
  value: string;
  isMain?: boolean;
  isSub?: boolean;
}

function NutritionRow({ label, value, isMain = false, isSub = false }: NutritionRowProps) {
  return (
    <div 
      className="flex items-center justify-between min-h-[44px]"
      style={{ paddingLeft: isSub ? '16px' : '0' }}
    >
      <span style={{ 
        fontSize: isMain ? '16px' : '14px', 
        fontWeight: isMain ? '500' : '400',
        color: isMain ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontFamily: 'SF Pro Display, system-ui, sans-serif'
      }}>
        {label}
      </span>
      {value && (
        <span style={{ 
          fontSize: isMain ? '16px' : '14px', 
          fontWeight: isMain ? '500' : '400',
          color: isMain ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontFamily: 'SF Pro Display, system-ui, sans-serif'
        }}>
          {value}
        </span>
      )}
    </div>
  );
}

export function MealDetailScreen({ onBack, onEdit, mealData = defaultMealData }: MealDetailScreenProps) {
  const [isConsumed, setIsConsumed] = useState(mealData.consumed);
  const [selectedIngredient, setSelectedIngredient] = useState<PreviewIngredient | null>(null);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

  const handleConsumedToggle = () => {
    setIsConsumed(!isConsumed);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Fallback if onEdit is not provided
      alert('Edit meal functionality would be implemented here');
    }
  };

  const handleIngredientClick = (ingredient: any) => {
    // Convert ingredient to PreviewIngredient format
    const previewIngredient: PreviewIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      icon: ingredient.icon,
      calories: ingredient.calories,
      carbs: ingredient.carbs,
      protein: ingredient.protein,
      fat: ingredient.fat
    };
    
    setSelectedIngredient(previewIngredient);
    setIsIngredientModalOpen(true);
  };

  const handleCloseIngredientModal = () => {
    setIsIngredientModalOpen(false);
    setSelectedIngredient(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="px-5 pt-12 h-full flex flex-col">
        <motion.div 
          className="flex-1 min-h-0 overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.1
          }}
        >
          {/* Status Bar */}
          <div 
            className="flex justify-between items-center mb-8 text-sm flex-shrink-0"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>8:00 AM</span>
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 500 }}>22°C</span>
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-12 flex-shrink-0">
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
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleConsumedToggle}
                className="p-2 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: isConsumed ? 'var(--btn-primary-bg)' : 'transparent',
                  transform: isConsumed ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (!isConsumed) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isConsumed) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Check 
                  size={20} 
                  style={{ 
                    color: isConsumed ? '#FFFFFF' : 'var(--icon-secondary)',
                    transition: 'color 200ms ease-in-out'
                  }} 
                />
              </button>
              <button 
                onClick={handleEditClick}
                className="p-2 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Edit2 size={20} style={{ color: 'var(--icon-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <motion.div 
            className="text-center pb-8"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            animate="visible"
          >
            {/* Large Icon */}
            <motion.div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { scale: 1, opacity: 1 }
              }}
            >
              <div className="flex items-center gap-0.5">
                <ForkIcon />
                <KnifeIcon />
              </div>
            </motion.div>

            {/* Title and Time */}
            <motion.div
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <h1 className="mb-2" style={{ color: 'var(--text-primary)' }}>{mealData.name}</h1>
              <p 
                className="text-lg mb-8 font-mono"
                style={{ color: 'var(--text-placeholder)' }}
              >
                {mealData.time}
              </p>
            </motion.div>

            {/* Nutrition Summary Cards */}
            <motion.div 
              className="mb-8"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {mealData.nutrition.calories}
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
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {mealData.nutrition.carbs.toFixed(1)} g
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
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {mealData.nutrition.protein.toFixed(1)} g
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
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {mealData.nutrition.fat.toFixed(1)} g
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-secondary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Fat
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ingredients Section */}
            <motion.div 
              className="mb-8"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)' }}>
                <h2 className="text-center mb-5" style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Ingredients
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  {mealData.ingredients.map((ingredient, index) => (
                    <motion.button
                      key={ingredient.id}
                      className="p-4 rounded-xl text-center transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--bg-main)',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.08)'
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0px 1px 3px rgba(0,0,0,0.08)';
                      }}
                      onClick={() => handleIngredientClick(ingredient)}
                    >
                      <div className="mb-2" style={{ fontSize: '32px' }}>
                        {ingredient.icon}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {ingredient.name}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {ingredient.amount}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Nutrition Facts Section */}
            <motion.div 
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <h2 className="mb-6" style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Nutrition Facts
              </h2>

              <div className="space-y-4">
                {/* Macronutrients */}
                <div className="space-y-3">
                  <NutritionRow label="Calories" value={`${mealData.nutrition.calories} kcal`} isMain />
                  <NutritionRow label="Protein" value={`${mealData.nutrition.protein.toFixed(1)} g`} isMain />
                  
                  <NutritionRow label="Carbs" value={`${mealData.nutrition.carbs.toFixed(1)} g`} isMain />
                  <NutritionRow label="Dietary Fiber" value={`${mealData.nutrition.dietaryFiber.toFixed(1)} g`} isSub />
                  <NutritionRow label="Total Sugars" value={`${mealData.nutrition.totalSugars.toFixed(1)} g`} isSub />
                  <NutritionRow label="Added Sugars" value={`${mealData.nutrition.addedSugars.toFixed(1)} g`} isSub />
                  
                  <NutritionRow label="Fat" value={`${mealData.nutrition.fat.toFixed(1)} g`} isMain />
                  <NutritionRow label="Saturated Fat" value={`${mealData.nutrition.saturatedFat.toFixed(1)} g`} isSub />
                  <NutritionRow label="Trans Fat" value={`${mealData.nutrition.transFat.toFixed(1)} g`} isSub />
                </div>

                <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

                {/* Vitamins */}
                <div className="space-y-3">
                  <NutritionRow label="Vitamins" value="" isMain />
                  <NutritionRow label="Vitamin A" value={`${mealData.nutrition.vitaminA} IU`} isSub />
                  <NutritionRow label="Vitamin C" value={`${mealData.nutrition.vitaminC.toFixed(1)} mg`} isSub />
                  <NutritionRow label="Vitamin D" value={`${mealData.nutrition.vitaminD} IU`} isSub />
                  <NutritionRow label="Vitamin E" value={`${mealData.nutrition.vitaminE.toFixed(1)} mg`} isSub />
                </div>

                <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

                {/* Minerals */}
                <div className="space-y-3">
                  <NutritionRow label="Minerals" value="" isMain />
                  <NutritionRow label="Calcium" value={`${mealData.nutrition.calcium} mg`} isSub />
                  <NutritionRow label="Iron" value={`${mealData.nutrition.iron.toFixed(1)} mg`} isSub />
                  <NutritionRow label="Magnesium" value={`${mealData.nutrition.magnesium} mg`} isSub />
                  <NutritionRow label="Potassium" value={`${mealData.nutrition.potassium} mg`} isSub />
                  <NutritionRow label="Sodium" value={`${mealData.nutrition.sodium} mg`} isSub />
                  <NutritionRow label="Zinc" value={`${mealData.nutrition.zinc.toFixed(1)} mg`} isSub />
                </div>

                <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

                {/* Other */}
                <div className="space-y-3">
                  <NutritionRow label="Other" value="" isMain />
                  <NutritionRow label="Cholesterol" value={`${mealData.nutrition.cholesterol} mg`} isSub />
                  <NutritionRow label="Caffeine" value={`${mealData.nutrition.caffeine} mg`} isSub />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ingredient Preview Modal */}
      <IngredientPreviewModal
        isOpen={isIngredientModalOpen}
        onClose={handleCloseIngredientModal}
        ingredient={selectedIngredient}
      />
    </div>
  );
}