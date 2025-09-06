import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Search, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AddIngredientCategoryScreenProps {
  onBack: () => void;
  onNext: (category: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

const FOOD_CATEGORIES = [
  { id: 'alcoholic-drinks', name: 'Alcoholic Drinks & Beverages', emoji: '🍷' },
  { id: 'baby-food', name: 'Baby Food', emoji: '🍼' },
  { id: 'baking-ingredients', name: 'Baking Ingredients', emoji: '🥧' },
  { id: 'bread', name: 'Bread', emoji: '🍞' },
  { id: 'candy-sweets', name: 'Candy & Sweets', emoji: '🍭' },
  { id: 'cereals-grains', name: 'Cereals & Grain Products', emoji: '🥣' },
  { id: 'cheeses', name: 'Cheeses', emoji: '🧀' },
  { id: 'chocolate', name: 'Chocolate', emoji: '🍫' },
  { id: 'dietary-supplements', name: 'Dietary & Nutritional Supplements', emoji: '💊' },
  { id: 'dips-spreads', name: 'Dips & Spreads', emoji: '🥜' },
  { id: 'fast-food', name: 'Fast Food & Restaurants', emoji: '🍟' },
  { id: 'fish-seafood', name: 'Fish & Seafood', emoji: '🐟' },
  { id: 'fruits', name: 'Fruits', emoji: '🍎' },
  { id: 'meat-poultry', name: 'Meat & Poultry', emoji: '🍗' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs', emoji: '🥛' },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥕' },
  { id: 'nuts-seeds', name: 'Nuts & Seeds', emoji: '🌰' },
  { id: 'oils-fats', name: 'Oils & Fats', emoji: '🫒' },
  { id: 'snacks', name: 'Snacks', emoji: '🍿' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤' },
  { id: 'herbs-spices', name: 'Herbs & Spices', emoji: '🌿' },
  { id: 'pasta-noodles', name: 'Pasta & Noodles', emoji: '🍝' },
  { id: 'rice-grains', name: 'Rice & Other Grains', emoji: '🍚' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'other', name: 'Other', emoji: '🍽️' }
];

export function AddIngredientCategoryScreen({ 
  onBack, 
  onNext, 
  onCancel, 
  initialValue = '' 
}: AddIngredientCategoryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialValue);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(initialValue);
  }, [initialValue]);

  const filteredCategories = FOOD_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedCategory) {
      onNext(selectedCategory);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const canProceed = selectedCategory.length > 0;

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
        {/* Header */}
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
              <span>21:13</span>
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 500 }}>22°C</span>
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-6">
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
                onClick={onCancel}
                className="p-2 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={24} style={{ color: 'var(--icon-secondary)' }} />
              </button>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '28px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Select a category
            </h1>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: 'var(--icon-secondary)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for categories"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-2"
          >
            {filteredCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: selectedCategory === category.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                  minHeight: '56px'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedCategory === category.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)';
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '24px' }}>
                    {category.emoji}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {category.name}
                  </span>
                </div>
                
                {selectedCategory === category.id && (
                  <Check size={20} style={{ color: '#3B82F6' }} />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-8 flex-shrink-0" style={{ backgroundColor: 'var(--bg-main)' }}>
          <motion.button
            onClick={handleNext}
            disabled={!canProceed}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full py-4 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: canProceed ? '#3B82F6' : 'var(--btn-secondary-bg)',
              color: canProceed ? '#FFFFFF' : 'var(--text-placeholder)',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
              border: 'none',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              opacity: canProceed ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (canProceed) {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }
            }}
            onMouseLeave={(e) => {
              if (canProceed) {
                e.currentTarget.style.backgroundColor = '#3B82F6';
              }
            }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}