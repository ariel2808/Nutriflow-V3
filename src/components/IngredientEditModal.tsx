import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IngredientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (ingredientData: EditableIngredient) => void;
  ingredient: EditableIngredient | null;
}

export interface EditableIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  icon: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
}

// Unit options for the dropdown
const UNIT_OPTIONS = [
  // Weight
  'grams', 'ounces', 'pounds',
  // Volume
  'cups', 'milliliters', 'tablespoons', 'teaspoons',
  // Count
  'piece', 'slice', 'medium', 'large', 'small'
];

// Mock detailed nutrition data
const DETAILED_NUTRITION = {
  'Dietary Fiber': '10.1 g',
  'Total Sugars': '0.7 g',
  'Added Sugars': '0.0 g',
  'Saturated Fat': '2.1 g',
  'Trans Fat': '0.0 g',
  'Vitamin K': '21 mcg',
  'Folate': '81 mcg',
  'Vitamin C': '10 mg',
  'Potassium': '485 mg',
  'Magnesium': '29 mg'
};

export function IngredientEditModal({ isOpen, onClose, onUpdate, ingredient }: IngredientEditModalProps) {
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [isNutritionExpanded, setIsNutritionExpanded] = useState(false);

  // Initialize form data when ingredient changes
  useEffect(() => {
    if (ingredient) {
      setAmount(ingredient.amount.split(' ')[0] || ''); // Extract number part
      setUnit(ingredient.amount.split(' ').slice(1).join(' ') || ingredient.unit || 'medium');
    }
  }, [ingredient]);

  // Calculate nutrition based on amount (mock calculation)
  const calculateNutrition = () => {
    if (!ingredient) return { calories: 0, carbs: 0, protein: 0, fat: 0 };
    
    const baseAmount = parseFloat(ingredient.amount.split(' ')[0]) || 1;
    const currentAmount = parseFloat(amount) || 1;
    const multiplier = currentAmount / baseAmount;
    
    return {
      calories: Math.round((ingredient.calories || 0) * multiplier),
      carbs: ((ingredient.carbs || 0) * multiplier).toFixed(1),
      protein: ((ingredient.protein || 0) * multiplier).toFixed(1),
      fat: ((ingredient.fat || 0) * multiplier).toFixed(1)
    };
  };

  const nutrition = calculateNutrition();

  const handleUpdate = () => {
    if (!ingredient) return;
    
    const updatedIngredient: EditableIngredient = {
      ...ingredient,
      amount: `${amount} ${unit}`,
      unit: unit,
      calories: nutrition.calories,
      carbs: parseFloat(nutrition.carbs),
      protein: parseFloat(nutrition.protein),
      fat: parseFloat(nutrition.fat)
    };
    
    onUpdate(updatedIngredient);
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    if (ingredient) {
      setAmount(ingredient.amount.split(' ')[0] || '');
      setUnit(ingredient.amount.split(' ').slice(1).join(' ') || 'medium');
    }
    onClose();
  };

  if (!ingredient) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Semi-transparent overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            className="relative bg-white rounded-[20px] shadow-2xl max-h-[90vh] flex flex-col"
            style={{
              width: '320px',
              minHeight: '480px',
              maxHeight: '90vh',
              boxShadow: '0px 10px 40px rgba(0,0,0,0.15)'
            }}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 left-6 p-1 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={18} style={{ color: '#86868b' }} />
              </button>

              {/* Ingredient icon and name */}
              <div className="text-center mt-8">
                <div className="mb-4" style={{ fontSize: '60px' }}>
                  {ingredient.icon}
                </div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1F2937',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  {ingredient.name}
                </h2>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 scrollbar-visible">
              {/* Editable fields */}
              <div className="mb-6">
                <div className="flex gap-3">
                  {/* Amount field */}
                  <div className="flex-1">
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6B7280',
                      marginBottom: '8px',
                      display: 'block',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Amount
                    </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-3 border rounded-lg transition-all duration-200"
                      style={{
                        height: '44px',
                        borderColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '14px',
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
                  </div>

                  {/* Unit field */}
                  <div className="flex-1">
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6B7280',
                      marginBottom: '8px',
                      display: 'block',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3 py-3 border rounded-lg transition-all duration-200 appearance-none bg-white"
                      style={{
                        height: '44px',
                        borderColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '14px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '16px',
                        paddingRight: '40px'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3B82F6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {UNIT_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Nutrition summary */}
              <div className="mb-6">
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {nutrition.calories}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Calories
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {nutrition.carbs} g
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Carbs
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {nutrition.protein} g
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Protein
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1F2937',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {nutrition.fat} g
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Fat
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable nutrition details */}
              <div className="mb-6">
                <button
                  onClick={() => setIsNutritionExpanded(!isNutritionExpanded)}
                  className="w-full flex items-center justify-center py-3 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: '#F8F9FA',
                    color: '#1F2937',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8F9FA';
                  }}
                >
                  {isNutritionExpanded ? 'Nutrition Details' : 'See More'}
                </button>

                <AnimatePresence>
                  {isNutritionExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div 
                        className="mt-3 p-4 rounded-lg space-y-3"
                        style={{ 
                          backgroundColor: '#F8F9FA'
                        }}
                      >
                        {/* Main nutrients */}
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F2937',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Carbohydrates
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Dietary Fiber
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Dietary Fiber']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Total Sugars
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Total Sugars']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Added Sugars
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Added Sugars']}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Fats */}
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F2937',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Fats
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Saturated Fat
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Saturated Fat']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Trans Fat
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Trans Fat']}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Vitamins */}
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F2937',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Vitamins
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Vitamin K
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Vitamin K']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Folate
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Folate']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Vitamin C
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Vitamin C']}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Minerals */}
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F2937',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Minerals
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Potassium
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Potassium']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Magnesium
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: '#6B7280',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Magnesium']}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex-shrink-0 p-6 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    fontSize: '16px',
                    fontWeight: '500',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    height: '44px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="flex-1 py-3 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: '#3B82F6',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '500',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    height: '44px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
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