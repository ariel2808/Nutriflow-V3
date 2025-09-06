import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AddIngredientNameScreenProps {
  onBack: () => void;
  onNext: (name: string) => void;
  onCancel: () => void;
  initialValue?: string;
}

export function AddIngredientNameScreen({ 
  onBack, 
  onNext, 
  onCancel, 
  initialValue = '' 
}: AddIngredientNameScreenProps) {
  const [foodName, setFoodName] = useState(initialValue);

  useEffect(() => {
    setFoodName(initialValue);
  }, [initialValue]);

  const handleNext = () => {
    if (foodName.trim()) {
      onNext(foodName.trim());
    }
  };

  const canProceed = foodName.trim().length > 0;

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
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center mb-16"
          >
            <h1 style={{
              fontSize: '28px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
              marginBottom: '32px',
              lineHeight: '1.3'
            }}>
              What is the food item?
            </h1>

            <div className="relative">
              <label style={{
                fontSize: '16px',
                fontWeight: '400',
                color: 'var(--text-secondary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif',
                display: 'block',
                marginBottom: '8px',
                textAlign: 'left'
              }}>
                Food name
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-center"
                  style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    borderBottom: `2px solid ${foodName ? '#3B82F6' : 'var(--border)'}`,
                    paddingBottom: '12px',
                    paddingTop: '8px',
                    transition: 'border-color 200ms ease-out'
                  }}
                  placeholder=""
                  autoFocus
                />
                
                {!foodName && (
                  <span style={{
                    position: 'absolute',
                    right: '0',
                    bottom: '12px',
                    fontSize: '16px',
                    color: 'var(--text-placeholder)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    pointerEvents: 'none'
                  }}>
                    enter
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-8 flex-shrink-0">
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