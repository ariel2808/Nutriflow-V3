import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddIngredientNutritionScreenProps {
  onBack: () => void;
  onNext: (nutrition: any) => void;
  onCancel: () => void;
  initialValue?: any;
}

interface NutritionField {
  key: string;
  label: string;
  unit: string;
  required: boolean;
  category: 'basic' | 'detailed';
}

const NUTRITION_FIELDS: NutritionField[] = [
  { key: 'calories', label: 'Energy (kcal)', unit: 'kcal', required: true, category: 'basic' },
  { key: 'totalFat', label: 'Total Fat', unit: 'g', required: true, category: 'basic' },
  { key: 'saturatedFat', label: 'Saturated Fat', unit: 'g', required: true, category: 'basic' },
  { key: 'carbs', label: 'Carbs', unit: 'g', required: true, category: 'basic' },
  { key: 'totalSugars', label: 'Total Sugars', unit: 'g', required: true, category: 'basic' },
  { key: 'protein', label: 'Protein', unit: 'g', required: true, category: 'basic' },
  { key: 'salt', label: 'Salt', unit: 'g', required: true, category: 'basic' },
  // Optional fields (shown when expanded)
  { key: 'dietaryFiber', label: 'Dietary Fiber', unit: 'g', required: false, category: 'detailed' },
  { key: 'transFat', label: 'Trans Fat', unit: 'g', required: false, category: 'detailed' },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg', required: false, category: 'detailed' },
  { key: 'sodium', label: 'Sodium', unit: 'mg', required: false, category: 'detailed' },
  { key: 'potassium', label: 'Potassium', unit: 'mg', required: false, category: 'detailed' },
  { key: 'vitaminA', label: 'Vitamin A', unit: 'μg', required: false, category: 'detailed' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', required: false, category: 'detailed' },
  { key: 'calcium', label: 'Calcium', unit: 'mg', required: false, category: 'detailed' },
  { key: 'iron', label: 'Iron', unit: 'mg', required: false, category: 'detailed' }
];

export function AddIngredientNutritionScreen({ 
  onBack, 
  onNext, 
  onCancel, 
  initialValue = {} 
}: AddIngredientNutritionScreenProps) {
  const [nutritionData, setNutritionData] = useState(initialValue);
  const [servingSize, setServingSize] = useState(initialValue.servingSize || '100');
  const [servingUnit, setServingUnit] = useState(initialValue.servingUnit || 'mL');
  const [isUSLabel, setIsUSLabel] = useState(initialValue.isUSLabel || false);
  const [showAllFields, setShowAllFields] = useState(false);

  useEffect(() => {
    setNutritionData(initialValue);
    setServingSize(initialValue.servingSize || '100');
    setServingUnit(initialValue.servingUnit || 'mL');
    setIsUSLabel(initialValue.isUSLabel || false);
  }, [initialValue]);

  const handleFieldChange = (key: string, value: string) => {
    setNutritionData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const requiredFields = NUTRITION_FIELDS.filter(field => field.required);
  const optionalFields = NUTRITION_FIELDS.filter(field => !field.required);
  
  const requiredFieldsFilled = requiredFields.every(field => 
    nutritionData[field.key] && nutritionData[field.key].toString().trim() !== ''
  );

  const handleNext = () => {
    if (requiredFieldsFilled) {
      const completeNutritionData = {
        ...nutritionData,
        servingSize,
        servingUnit,
        isUSLabel
      };
      onNext(completeNutritionData);
    }
  };

  const displayedFields = showAllFields ? NUTRITION_FIELDS : requiredFields;

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
              Fill in the nutrition facts
            </h1>

            {/* US Nutrition Label Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                US Nutrition Label
              </span>
              <button
                onClick={() => setIsUSLabel(!isUSLabel)}
                className="relative w-12 h-6 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isUSLabel ? '#3B82F6' : 'var(--border)'
                }}
              >
                <div
                  className="w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 absolute top-0.5"
                  style={{
                    left: isUSLabel ? '24px' : '2px'
                  }}
                />
              </button>
            </div>

            {/* Serving Size Input */}
            <div className="flex items-center gap-2 mb-6">
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Values Per
              </span>
              <input
                type="number"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className="px-3 py-2 rounded-lg border-none outline-none text-center"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  width: '80px'
                }}
              />
              <select
                value={servingUnit}
                onChange={(e) => setServingUnit(e.target.value)}
                className="px-3 py-2 rounded-lg border-none outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}
              >
                <option value="mL">mL</option>
                <option value="g">g</option>
                <option value="oz">oz</option>
                <option value="cup">cup</option>
              </select>
            </div>
          </motion.div>
        </div>

        {/* Nutrition Fields */}
        <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            {displayedFields.map((field, index) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <label style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {field.label} ({field.unit})
                  </label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={nutritionData[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.required ? 'required' : 'enter'}
                  className="w-24 px-3 py-2 rounded-lg border-none outline-none text-right"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}
                />
              </motion.div>
            ))}

            {/* Show All Toggle */}
            {!showAllFields && (
              <motion.button
                onClick={() => setShowAllFields(true)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 py-3 px-2 w-full text-left"
                style={{ backgroundColor: 'transparent' }}
              >
                <ChevronRight size={20} style={{ color: '#3B82F6' }} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#3B82F6',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Show all
                </span>
              </motion.button>
            )}

            {showAllFields && (
              <motion.button
                onClick={() => setShowAllFields(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 py-3 px-2 w-full text-left"
                style={{ backgroundColor: 'transparent' }}
              >
                <ChevronDown size={20} style={{ color: '#3B82F6' }} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#3B82F6',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Show less
                </span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-8 flex-shrink-0" style={{ backgroundColor: 'var(--bg-main)' }}>
          <motion.button
            onClick={handleNext}
            disabled={!requiredFieldsFilled}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full py-4 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: requiredFieldsFilled ? '#3B82F6' : 'var(--btn-secondary-bg)',
              color: requiredFieldsFilled ? '#FFFFFF' : 'var(--text-placeholder)',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'SF Pro Display, system-ui, sans-serif',
              border: 'none',
              cursor: requiredFieldsFilled ? 'pointer' : 'not-allowed',
              opacity: requiredFieldsFilled ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (requiredFieldsFilled) {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }
            }}
            onMouseLeave={(e) => {
              if (requiredFieldsFilled) {
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