import React, { useState } from 'react';
import { ChevronLeft, Plus, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IngredientEditModal, EditableIngredient } from './IngredientEditModal';

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

// Editable ingredient interface (moved to IngredientEditModal)
// interface EditableIngredient is now imported from IngredientEditModal

// Sample meal data for editing
const defaultMealData = {
  id: '1',
  name: 'Breakfast',
  time: '08:00',
  ingredients: [
    { id: '1', name: 'Quinoa', amount: '1 cup', unit: 'cup', icon: '🌾', calories: 222, carbs: 39.4, protein: 8.1, fat: 3.6 },
    { id: '2', name: 'Avocado', amount: '1/2 medium', unit: 'medium', icon: '🥑', calories: 120, carbs: 6.2, protein: 1.7, fat: 11.0 },
    { id: '3', name: 'Chickpeas', amount: '1/2 cup', unit: 'cup', icon: '🫘', calories: 134, carbs: 22.5, protein: 7.3, fat: 2.1 },
    { id: '4', name: 'Cherry Tomatoes', amount: '1/2 cup', unit: 'cup', icon: '🍅', calories: 9, carbs: 1.9, protein: 0.4, fat: 0.1 }
  ] as EditableIngredient[]
};

interface EditMealScreenProps {
  onBack: () => void;
  onSave: (mealData: any) => void;
  onDelete: () => void;
  onAddItems?: () => void;
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

export function EditMealScreen({ onBack, onSave, onDelete, onAddItems, mealData = defaultMealData }: EditMealScreenProps) {
  const [mealName, setMealName] = useState(mealData.name);
  const [mealTime, setMealTime] = useState(mealData.time);
  const [ingredients, setIngredients] = useState<EditableIngredient[]>(mealData.ingredients);
  const [isNutritionExpanded, setIsNutritionExpanded] = useState(false);
  
  // Ingredient edit modal state
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<EditableIngredient | null>(null);

  // Calculate live nutrition totals
  const calculateNutrition = () => {
    return ingredients.reduce((totals, ingredient) => ({
      calories: totals.calories + (ingredient.calories || 0),
      carbs: totals.carbs + (ingredient.carbs || 0),
      protein: totals.protein + (ingredient.protein || 0),
      fat: totals.fat + (ingredient.fat || 0)
    }), { calories: 0, carbs: 0, protein: 0, fat: 0 });
  };

  const nutrition = calculateNutrition();

  const handleRemoveIngredient = (ingredientId: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
  };

  const handleIngredientAmountChange = (ingredientId: string, newAmount: string) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === ingredientId ? { ...ing, amount: newAmount } : ing
    ));
  };

  const handleIngredientClick = (ingredient: EditableIngredient) => {
    setSelectedIngredient(ingredient);
    setIsIngredientModalOpen(true);
  };

  const handleIngredientUpdate = (updatedIngredient: EditableIngredient) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === updatedIngredient.id ? updatedIngredient : ing
    ));
  };

  const handleCloseIngredientModal = () => {
    setIsIngredientModalOpen(false);
    setSelectedIngredient(null);
  };

  const handleAddIngredient = () => {
    // Navigate to Add Items screen
    if (onAddItems) {
      onAddItems();
    } else {
      alert('Add ingredient functionality would open a search/selection modal');
    }
  };



  const handleSave = () => {
    const updatedMealData = {
      ...mealData,
      name: mealName,
      time: mealTime,
      ingredients,
      nutrition
    };
    onSave(updatedMealData);
  };

  const handleCancel = () => {
    // Reset to original data and go back
    onBack();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this meal?')) {
      onDelete();
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex flex-col h-full">
        {/* Header with exact structure from ItemDetail */}
        <div className="px-5 pt-12 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status Bar */}
            <div 
              className="flex justify-between items-center mb-8 text-sm"
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

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-12">
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
              
              <button 
                onClick={handleSave}
                className="p-2 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Check size={24} style={{ color: '#3B82F6', strokeWidth: 2 }} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5">
          <motion.div 
            className="text-center pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Editable Meal Section */}
            <motion.div
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {/* Meal Icon with hover effect */}
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-200 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
                onClick={() => alert('Meal icon selection would be implemented here')}
              >
                <div className="flex items-center gap-0.5">
                  <ForkIcon />
                  <KnifeIcon />
                </div>
              </div>

              {/* Editable Meal Name */}
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="text-center mb-4 px-4 py-2 rounded-lg border transition-all duration-200"
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1F2937',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  minWidth: '200px'
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

              {/* Editable Time */}
              <input
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="text-center px-4 py-2 rounded-lg border font-mono transition-all duration-200"
                style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  fontFamily: 'SF Mono, Monaco, monospace'
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
            </motion.div>

            {/* Live Nutrition Summary */}
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#1F2937',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {Math.round(nutrition.calories)}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6B7280',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Calories
                  </div>
                </div>

                <div className="text-center">
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#1F2937',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {nutrition.carbs.toFixed(1)} g
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6B7280',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Carbs
                  </div>
                </div>

                <div className="text-center">
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#1F2937',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {nutrition.protein.toFixed(1)} g
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6B7280',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Protein
                  </div>
                </div>

                <div className="text-center">
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#1F2937',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {nutrition.fat.toFixed(1)} g
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6B7280',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Fat
                  </div>
                </div>
              </div>
            </motion.div>



            {/* Editable Ingredients Section */}
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="rounded-2xl p-5" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-center" style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#1F2937',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Ingredients
                  </h2>
                  
                  <button
                    onClick={handleAddIngredient}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      className="relative p-4 rounded-xl text-center transition-all duration-200 group cursor-pointer"
                      style={{
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.08)'
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      onClick={() => handleIngredientClick(ingredient)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0px 1px 3px rgba(0,0,0,0.08)';
                      }}
                    >
                      {/* Delete X button - shows on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering ingredient click
                          handleRemoveIngredient(ingredient.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#DC2626';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#EF4444';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <X size={12} />
                      </button>

                      <div className="mb-2" style={{ fontSize: '32px' }}>
                        {ingredient.icon}
                      </div>
                      
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#1F2937',
                        marginBottom: '4px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {ingredient.name}
                      </div>
                      
                      {/* Amount display (non-editable, click to edit via modal) */}
                      <div 
                        className="w-full text-center px-2 py-1 text-xs rounded border transition-all duration-200"
                        style={{
                          color: '#6B7280',
                          borderColor: '#E5E7EB',
                          backgroundColor: '#F9FAFB',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif',
                          cursor: 'pointer'
                        }}
                      >
                        {ingredient.amount}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Collapsible Nutrition Facts */}
            <motion.div 
              className="mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <button
                onClick={() => setIsNutritionExpanded(!isNutritionExpanded)}
                className="flex items-center justify-between w-full p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: '#F8F9FA',
                  color: '#1F2937'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8F9FA';
                }}
              >
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Nutrition Facts
                </h2>
                {isNutritionExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {isNutritionExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 mt-2 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                      <div className="space-y-4">
                        {/* Basic macros from calculated values */}
                        <div className="space-y-3">
                          <NutritionRow label="Calories" value={`${Math.round(nutrition.calories)} kcal`} isMain />
                          <NutritionRow label="Protein" value={`${nutrition.protein.toFixed(1)} g`} isMain />
                          <NutritionRow label="Carbs" value={`${nutrition.carbs.toFixed(1)} g`} isMain />
                          <NutritionRow label="Fat" value={`${nutrition.fat.toFixed(1)} g`} isMain />
                        </div>

                        <div className="h-px" style={{ backgroundColor: '#E5E7EB' }} />

                        {/* Placeholder detailed nutrition */}
                        <div className="space-y-3">
                          <NutritionRow label="Detailed nutrition available after saving" value="" isMain />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-5 border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          {/* Bottom Row - Cancel and Delete */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-full transition-all duration-200"
              style={{
                backgroundColor: '#F3F4F6',
                color: '#374151',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-full transition-all duration-200"
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EF4444';
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Ingredient Edit Modal */}
        <IngredientEditModal
          isOpen={isIngredientModalOpen}
          onClose={handleCloseIngredientModal}
          onUpdate={handleIngredientUpdate}
          ingredient={selectedIngredient}
        />
      </div>
    </div>
  );
}