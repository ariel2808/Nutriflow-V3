import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AddIngredientServingSizeScreenProps {
  onBack: () => void;
  onSave: (servingSizes: string[]) => void;
  onCancel: () => void;
  initialValue?: string[];
  ingredientName: string;
}

interface ServingSizeOption {
  id: string;
  name: string;
  emoji: string;
}

const SERVING_SIZE_OPTIONS: ServingSizeOption[] = [
  { id: 'cup', name: 'Cup', emoji: '🥤' },
  { id: 'each', name: 'Each', emoji: '🥚' },
  { id: 'package', name: 'Package', emoji: '📦' },
  { id: 'serving', name: 'Serving', emoji: '🥣' },
  { id: 'tablespoon', name: 'Tablespoon', emoji: '🥄' },
  { id: 'teaspoon', name: 'Teaspoon', emoji: '🥄' }
];

export function AddIngredientServingSizeScreen({ 
  onBack, 
  onSave, 
  onCancel, 
  initialValue = [],
  ingredientName 
}: AddIngredientServingSizeScreenProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialValue);

  useEffect(() => {
    setSelectedSizes(initialValue);
  }, [initialValue]);

  const handleSizeToggle = (sizeId: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(sizeId)) {
        return prev.filter(id => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedSizes);
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden"
      style={{ 
        backgroundColor: 'var(--bg-main)',
        maxWidth: '375px',
        margin: '0 auto'
      }}
    >
      <div className="flex flex-col h-full min-h-0">
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
            <div className="text-center mb-8">
              <h1 style={{
                fontSize: '28px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                Would you like to add more<br />serving sizes?
              </h1>
              <p style={{
                fontSize: '16px',
                fontWeight: '400',
                color: 'var(--text-secondary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                (Optional)
              </p>
            </div>
          </motion.div>
        </div>

        {/* Serving Size Grid */}
        <div className="flex-1 px-5 py-6 overflow-y-auto min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
          >
            {SERVING_SIZE_OPTIONS.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => handleSizeToggle(option.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="relative p-4 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center aspect-square"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: selectedSizes.includes(option.id) ? '2px solid #3B82F6' : '2px solid transparent',
                  minHeight: '120px'
                }}
                onMouseEnter={(e) => {
                  if (!selectedSizes.includes(option.id)) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* Selection indicator */}
                {selectedSizes.includes(option.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={14} style={{ color: 'white' }} />
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {option.emoji}
                  </div>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {option.name}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Footer with Save button */}
        <div 
          className="px-5 py-6 flex-shrink-0 border-t" 
          style={{ 
            backgroundColor: 'var(--bg-main)',
            borderColor: 'var(--border)',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            className="w-full py-4 rounded-2xl transition-all duration-200 shadow-lg"
            style={{
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: '700',
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
              border: 'none',
              cursor: 'pointer',
              minHeight: '56px',
              letterSpacing: '0.025em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10B981';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
          >
            Save Ingredient
          </motion.button>
        </div>
      </div>
    </div>
  );
}