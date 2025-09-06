import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface NutritionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NutrientItem {
  name: string;
  current: number;
  target?: number;
  unit: string;
  category: 'carbs' | 'fat' | 'other' | 'vitamins' | 'minerals';
}

const nutritionData: NutrientItem[] = [
  // Carbohydrate breakdown
  { name: 'Dietary Fiber', current: 28, target: 35, unit: 'g', category: 'carbs' },
  { name: 'Total Sugars', current: 42, unit: 'g', category: 'carbs' },
  { name: 'Added Sugars', current: 18, unit: 'g', category: 'carbs' },
  
  // Fat breakdown
  { name: 'Saturated Fat', current: 12, unit: 'g', category: 'fat' },
  { name: 'Monounsaturated Fat', current: 18, unit: 'g', category: 'fat' },
  { name: 'Polyunsaturated Fat', current: 8, unit: 'g', category: 'fat' },
  { name: 'Trans Fat', current: 0, unit: 'g', category: 'fat' },
  
  // Other nutrients
  { name: 'Cholesterol', current: 185, unit: 'mg', category: 'other' },
  { name: 'Sodium', current: 1850, target: 2300, unit: 'mg', category: 'other' },
  { name: 'Salt', current: 4.7, unit: 'g', category: 'other' },
  { name: 'Water', current: 1.8, target: 2.5, unit: 'L', category: 'other' },
  { name: 'Alcohol', current: 0, unit: 'g', category: 'other' },
  
  // Vitamins
  { name: 'Vitamin B7 (Biotin)', current: 28, target: 30, unit: 'μg', category: 'vitamins' },
  { name: 'Vitamin C', current: 120, target: 90, unit: 'mg', category: 'vitamins' },
  { name: 'Vitamin D', current: 15, target: 20, unit: 'μg', category: 'vitamins' },
  { name: 'Vitamin E', current: 12, target: 15, unit: 'mg', category: 'vitamins' },
  { name: 'Vitamin K', current: 95, target: 120, unit: 'μg', category: 'vitamins' },
  
  // Minerals
  { name: 'Calcium', current: 850, target: 1000, unit: 'mg', category: 'minerals' },
  { name: 'Iron', current: 14, target: 18, unit: 'mg', category: 'minerals' },
  { name: 'Magnesium', current: 280, target: 400, unit: 'mg', category: 'minerals' },
  { name: 'Potassium', current: 2800, target: 3500, unit: 'mg', category: 'minerals' },
  { name: 'Zinc', current: 9, target: 11, unit: 'mg', category: 'minerals' },
];

const categoryTitles = {
  carbs: 'CARBOHYDRATE BREAKDOWN',
  fat: 'FAT BREAKDOWN', 
  other: 'OTHER NUTRIENTS',
  vitamins: 'VITAMINS',
  minerals: 'MINERALS'
};

const formatValue = (value: number, unit: string): string => {
  if (value >= 1000 && unit === 'mg') {
    return `${(value / 1000).toFixed(1)}g`;
  }
  if (value >= 1000) {
    return value.toLocaleString();
  }
  if (value % 1 === 0) {
    return value.toString();
  }
  return value.toFixed(1);
};

export const NutritionDetailModal: React.FC<NutritionDetailModalProps> = ({
  isOpen,
  onClose
}) => {
  const caloriesData = {
    current: 1721,
    target: 2213,
    progress: 0.78
  };

  const macrosData = {
    protein: { current: 78, target: 90, color: '#34D399' },
    carbs: { current: 156, target: 190, color: '#A78BFA' },
    fat: { current: 48, target: 65, color: '#FBBF24' }
  };

  const groupedNutrients = nutritionData.reduce((acc, nutrient) => {
    if (!acc[nutrient.category]) {
      acc[nutrient.category] = [];
    }
    acc[nutrient.category].push(nutrient);
    return acc;
  }, {} as Record<string, NutrientItem[]>);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
        >
          {/* Backdrop - Immediate blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeInOut" } }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            style={{ 
              backgroundColor: 'var(--bg-main)',
              width: '340px',
              height: '600px'
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              scale: 0.85, 
              opacity: 0, 
              y: 30,
              transition: { 
                duration: 0.25, 
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.2 },
                opacity: { duration: 0.15 }
              }
            }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3,
              delay: 0.05
            }}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--graph-grid) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--graph-grid) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            {/* Header Section */}
            <div className="relative z-10 p-5 pb-0 border-b" style={{ borderBottomColor: 'var(--border)' }}>
              {/* Title Bar */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl" style={{ color: 'var(--text-primary)' }}>Today's Summary</h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your nutrition progress for today</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: 'var(--icon-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--icon-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--icon-secondary)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Calories Summary */}
              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <div className="text-center mb-3">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Calories
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative mb-3">
                  <div 
                    className="w-full h-4 rounded-full"
                    style={{ backgroundColor: 'var(--border)' }}
                  >
                    <div
                      className="h-4 rounded-full transition-all duration-300"
                      style={{
                        width: `${caloriesData.progress * 100}%`,
                        background: 'linear-gradient(90deg, #BFDBFE 0%, #93C5FD 50%, #60A5FA 100%)'
                      }}
                    />
                  </div>
                </div>
                
                {/* Values */}
                <div className="text-center">
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {caloriesData.current.toLocaleString()}
                  </span>
                  <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    {' / '}{caloriesData.target.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Object.entries(macrosData).map(([name, data]) => (
                  <div key={name} className="text-center">
                    <div className="text-xs font-medium mb-2 capitalize" style={{ color: 'var(--text-secondary)' }}>
                      {name}
                    </div>
                    <div className="relative mb-2">
                      <div 
                        className="w-full h-3 rounded-full"
                        style={{ backgroundColor: 'var(--border)' }}
                      >
                        <div
                          className="h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((data.current / data.target) * 100, 100)}%`,
                            backgroundColor: data.color
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {data.current}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {' / '}{data.target}g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed List Section */}
            <div className="relative z-10 flex flex-col max-h-[calc(90vh-280px)]">
              <div className="flex-1 overflow-y-auto scrollbar-visible border-t" style={{ borderTopColor: 'var(--border)' }}>
                <div className="px-5 py-5">
                  {Object.entries(groupedNutrients).map(([category, nutrients]) => (
                    <div key={category} className="mb-6">
                      {/* Category Header */}
                      <div 
                        className="text-xs font-bold uppercase tracking-wide mb-3 pb-2 border-b"
                        style={{ 
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border)'
                        }}
                      >
                        {categoryTitles[category as keyof typeof categoryTitles]}
                      </div>
                      
                      {/* Nutrient Items */}
                      <div className="space-y-3">
                        {nutrients.map((nutrient, index) => (
                          <div 
                            key={`${category}-${index}`}
                            className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors cursor-pointer"
                            style={{
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <span 
                              className="text-sm"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {nutrient.name}
                            </span>
                            <span 
                              className="text-sm font-medium"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {nutrient.target ? (
                                <>
                                  {formatValue(nutrient.current, nutrient.unit)}
                                  <span style={{ color: 'var(--text-secondary)' }}>
                                    {' / '}{formatValue(nutrient.target, nutrient.unit)}{nutrient.unit}
                                  </span>
                                </>
                              ) : (
                                `${formatValue(nutrient.current, nutrient.unit)}${nutrient.unit}`
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document body level
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : modalContent;
};