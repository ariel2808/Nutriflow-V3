import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SelectedIngredient {
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

interface IngredientEditPopupProps {
  isOpen: boolean;
  ingredient: SelectedIngredient | null;
  onClose: () => void;
  onUpdate: (ingredient: SelectedIngredient) => void;
}

// Common units for different food types
const UNIT_OPTIONS = [
  'piece', 'whole', 'half', 'quarter',
  'cup', 'oz', 'g', 'kg', 'lb',
  'tbsp', 'tsp', 'ml', 'l',
  'slice', 'serving', 'container',
  'small', 'medium', 'large'
];

export function IngredientEditPopup({ isOpen, ingredient, onClose, onUpdate }: IngredientEditPopupProps) {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);

  // Update local state when ingredient changes
  useEffect(() => {
    if (ingredient) {
      setAmount(ingredient.amount.toString());
      setUnit(ingredient.unit);
    }
  }, [ingredient]);

  if (!ingredient) return null;

  // Calculate nutrition based on current amount
  const currentAmount = parseFloat(amount) || 0;
  const multiplier = currentAmount / (ingredient.amount || 1); // Based on original amount
  const currentNutrition = {
    calories: Math.round(ingredient.calories * multiplier),
    carbs: (ingredient.carbs * multiplier),
    protein: (ingredient.protein * multiplier),
    fat: (ingredient.fat * multiplier)
  };

  const handleUpdate = () => {
    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount > 0) {
      const multiplier = parsedAmount / (ingredient.amount || 1);
      const updatedIngredient: SelectedIngredient = {
        ...ingredient,
        amount: parsedAmount,
        unit: unit,
        totalCalories: ingredient.calories * multiplier,
        totalCarbs: ingredient.carbs * multiplier,
        totalProtein: ingredient.protein * multiplier,
        totalFat: ingredient.fat * multiplier
      };
      onUpdate(updatedIngredient);
    }
  };

  const handleCancel = () => {
    // Reset to original values and close
    if (ingredient) {
      setAmount(ingredient.amount.toString());
      setUnit(ingredient.unit);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              width: '320px',
              height: '400px',
              maxWidth: '90vw',
              maxHeight: '75vh'
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <button
                onClick={onClose}
                className="p-1 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} style={{ color: '#6B7280' }} />
              </button>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1F2937',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Edit Ingredient
              </h3>
              <div className="w-8" /> {/* Spacer for alignment */}
            </div>

            {/* Content */}
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 overflow-y-auto" style={{ paddingBottom: '8px' }}>
                {/* Ingredient Icon and Name */}
                <div className="text-center mb-3">
                  <div className="mb-1" style={{ fontSize: '36px' }}>
                    {ingredient.name.toLowerCase().includes('banana') ? '🍌' :
                     ingredient.name.toLowerCase().includes('avocado') ? '🥑' :
                     ingredient.name.toLowerCase().includes('egg') ? '🥚' :
                     ingredient.name.toLowerCase().includes('oat') ? '🥣' :
                     ingredient.name.toLowerCase().includes('yogurt') ? '🥛' :
                     ingredient.name.toLowerCase().includes('almond') ? '🥜' : '🍽️'}
                  </div>
                  <h4 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1F2937',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {ingredient.name}
                  </h4>
                </div>

                {/* Amount and Unit Inputs */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.1"
                      min="0"
                      className="w-full px-3 py-2 rounded-lg border transition-all duration-200"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        color: '#1F2937',
                        fontSize: '14px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        height: '40px'
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
                  </div>

                  <div className="relative">
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Unit
                    </label>
                    <button
                      onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                      className="w-full px-3 py-2 rounded-lg border transition-all duration-200 text-left flex items-center justify-between"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        color: '#1F2937',
                        fontSize: '14px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        height: '40px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3B82F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                      }}
                    >
                      <span>{unit}</span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Unit Dropdown */}
                    <AnimatePresence>
                      {isUnitDropdownOpen && (
                        <motion.div
                          className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 max-h-28 overflow-y-auto"
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E5E7EB'
                          }}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {UNIT_OPTIONS.map((unitOption) => (
                            <button
                              key={unitOption}
                              onClick={() => {
                                setUnit(unitOption);
                                setIsUnitDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left transition-all duration-200"
                              style={{
                                backgroundColor: unit === unitOption ? '#F3F4F6' : 'transparent',
                                color: '#1F2937',
                                fontSize: '14px',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                                border: 'none'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#F9FAFB';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = unit === unitOption ? '#F3F4F6' : 'transparent';
                              }}
                            >
                              {unitOption}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Nutrition Summary */}
                <div className="grid grid-cols-4 gap-3 mb-2">
                  <div className="text-center">
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {currentNutrition.calories}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Calories
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {currentNutrition.carbs.toFixed(1)}g
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Carbs
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {currentNutrition.protein.toFixed(1)}g
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Protein
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1F2937',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {currentNutrition.fat.toFixed(1)}g
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Fat
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div 
                className="flex gap-3 px-4 py-3 flex-shrink-0"
                style={{ borderTop: '1px solid #E5E7EB' }}
              >
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 px-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    border: 'none',
                    height: '40px'
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
                  onClick={handleUpdate}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 py-2 px-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: (amount && parseFloat(amount) > 0) ? '#3B82F6' : '#E5E7EB',
                    color: (amount && parseFloat(amount) > 0) ? '#FFFFFF' : '#9CA3AF',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    border: 'none',
                    cursor: (amount && parseFloat(amount) > 0) ? 'pointer' : 'not-allowed',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => {
                    if (amount && parseFloat(amount) > 0) {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (amount && parseFloat(amount) > 0) {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}