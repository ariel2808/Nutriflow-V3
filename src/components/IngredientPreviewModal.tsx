import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IngredientPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: PreviewIngredient | null;
}

export interface PreviewIngredient {
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

export function IngredientPreviewModal({ isOpen, onClose, ingredient }: IngredientPreviewModalProps) {
  const [isNutritionExpanded, setIsNutritionExpanded] = useState(false);

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
            className="relative rounded-[20px] shadow-2xl max-h-[90vh] flex flex-col"
            style={{
              width: '320px',
              minHeight: '480px',
              maxHeight: '90vh',
              backgroundColor: 'var(--bg-main)',
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
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={18} style={{ color: 'var(--icon-secondary)' }} />
              </button>

              {/* Ingredient icon and name */}
              <div className="text-center mt-8">
                <div className="mb-4" style={{ fontSize: '60px' }}>
                  {ingredient.icon}
                </div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  {ingredient.name}
                </h2>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 scrollbar-visible">
              {/* Amount and unit display */}
              <div className="mb-6">
                <div className="text-center">
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Serving Size
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {ingredient.amount}
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
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {ingredient.calories || 0}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Calories
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {ingredient.carbs || 0} g
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Carbs
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {ingredient.protein || 0} g
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Protein
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      {ingredient.fat || 0} g
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
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
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    height: '40px',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
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
                          backgroundColor: 'var(--bg-card)'
                        }}
                      >
                        {/* Main nutrients */}
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Carbohydrates
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Dietary Fiber
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Dietary Fiber']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Total Sugars
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Total Sugars']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Added Sugars
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
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
                            color: 'var(--text-primary)',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Fats
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Saturated Fat
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Saturated Fat']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Trans Fat
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
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
                            color: 'var(--text-primary)',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Vitamins
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Vitamin K
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Vitamin K']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Folate
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Folate']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Vitamin C
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
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
                            color: 'var(--text-primary)',
                            marginBottom: '8px',
                            fontFamily: 'SF Pro Display, system-ui, sans-serif'
                          }}>
                            Minerals
                          </div>
                          <div className="space-y-2 ml-3">
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Potassium
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                {DETAILED_NUTRITION['Potassium']}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                fontFamily: 'SF Pro Display, system-ui, sans-serif'
                              }}>
                                Magnesium
                              </span>
                              <span style={{
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
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

            {/* Footer action */}
            <div className="flex-shrink-0 p-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  height: '44px',
                  border: 'none'
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
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}