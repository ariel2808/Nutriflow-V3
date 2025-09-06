import React, { useState } from 'react';
import { X, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecipeData {
  id: string;
  name: string;
  description: string;
  icon?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  icon: string;
}

interface RecipeOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (recipe: RecipeData) => void;
  meal: RecipeData | null; // Keep as 'meal' for backward compatibility
}

export function RecipeOverviewModal({ isOpen, onClose, onEdit, meal: recipe }: RecipeOverviewModalProps) {
  if (!recipe) return null;

  const handleEdit = () => {
    onEdit(recipe);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={handleBackgroundClick}
        >
          {/* Semi-transparent overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            className="relative rounded-[20px] shadow-2xl flex flex-col"
            style={{
              width: '320px',
              height: '500px',
              backgroundColor: 'var(--bg-main)',
              boxShadow: '0px 10px 40px rgba(0,0,0,0.15)'
            }}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 flex-shrink-0">
              {/* Close and action buttons */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={onClose}
                  className="p-1 rounded-full transition-all duration-200"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X size={18} style={{ color: '#86868b' }} />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-full transition-all duration-200"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Edit size={16} style={{ color: '#3B82F6' }} />
                  </button>
                  <div style={{ fontSize: '24px' }}>
                    🍱
                  </div>
                </div>
              </div>

              {/* Recipe name and description */}
              <div className="text-center">
                {recipe.icon && (
                  <div className="mb-3" style={{ fontSize: '50px' }}>
                    {recipe.icon}
                  </div>
                )}
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  marginBottom: '8px'
                }}>
                  {recipe.name}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  lineHeight: '1.4'
                }}>
                  {recipe.description}
                </p>
              </div>
            </div>

            {/* Nutrition Summary */}
            <div className="px-6 pb-6 flex-shrink-0">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    marginBottom: '4px'
                  }}>
                    {recipe.calories}
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
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    marginBottom: '4px'
                  }}>
                    {recipe.carbs.toFixed(1)}g
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
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    marginBottom: '4px'
                  }}>
                    {recipe.protein.toFixed(1)}g
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
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    marginBottom: '4px'
                  }}>
                    {recipe.fat.toFixed(1)}g
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

            {/* Ingredients Section */}
            <div className="flex-1 overflow-hidden">
              <div className="px-6 pb-4">
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  Ingredients
                </h3>
              </div>

              {/* Scrollable ingredients list */}
              <div 
                className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-visible"
                style={{ maxHeight: '200px' }}
              >
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      style={{ minHeight: '32px' }}
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ fontSize: '20px' }}>
                          {ingredient.icon}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--text-primary)',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {ingredient.name}
                        </span>
                      </div>
                      
                      <span style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {ingredient.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export types for backward compatibility
export type { RecipeData as MealData, RecipeIngredient as MealIngredient, RecipeOverviewModalProps as MealOverviewModalProps };