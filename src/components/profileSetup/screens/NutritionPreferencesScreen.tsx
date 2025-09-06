import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { ProfileSetupStepProps, NutritionPreferencesData } from '../ProfileSetupTypes';
import { dietaryPreferences } from '../ProfileSetupConstants';

interface NutritionPreferencesScreenProps extends ProfileSetupStepProps {
  nutritionPreferences: NutritionPreferencesData;
  onNutritionPreferenceToggle: (preferenceId: string) => void;
}

export function NutritionPreferencesScreen({
  nutritionPreferences,
  onNutritionPreferenceToggle,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: NutritionPreferencesScreenProps) {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft size={24} color="#1D1D1F" />
          </button>
          <span style={{ fontSize: '14px', color: '#86868B' }}>{stepIndicator}</span>
        </div>

        <div className="mb-8">
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #FF6B35 0%, #FF8A50 100%)'
              }}
              initial={{ width: `${progressPercentage - 12.5}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1D1D1F', marginBottom: '8px', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          Nutrition Preferences
        </h1>
        <p style={{ fontSize: '16px', color: '#86868B', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          Tell us about your dietary needs and preferences
        </p>
      </div>

      {/* Scrollable Content - Direct List */}
      <div className="flex-1 px-5 overflow-y-auto scrollbar-visible">
        <div className="space-y-3 mb-6">
          {dietaryPreferences.map((preference) => (
            <motion.button
              key={preference.id}
              onClick={() => onNutritionPreferenceToggle(preference.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: nutritionPreferences.selectedPreferences.includes(preference.id) ? '#F0F8FF' : '#FFFFFF',
                border: nutritionPreferences.selectedPreferences.includes(preference.id) ? '2px solid #007AFF' : '1px solid #E5E5E7',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <span style={{ fontSize: '28px' }}>{preference.icon}</span>
                <div className="text-left">
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1D1D1F', marginBottom: '2px' }}>
                    {preference.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#86868B' }}>
                    {preference.subtitle}
                  </div>
                </div>
              </div>
              {nutritionPreferences.selectedPreferences.includes(preference.id) && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={16} color="#FFFFFF" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Selected Count Summary */}
        {nutritionPreferences.selectedPreferences.length > 0 && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#F0F8FF', border: '1px solid #007AFF' }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '24px' }}>✅</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#007AFF' }}>
                  {nutritionPreferences.selectedPreferences.length} preference{nutritionPreferences.selectedPreferences.length > 1 ? 's' : ''} selected
                </div>
                <div style={{ fontSize: '14px', color: '#86868B' }}>
                  We'll tailor your nutrition recommendations accordingly
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="flex-shrink-0 p-5 pt-0">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full py-4 rounded-full text-center transition-all duration-200 mb-3"
          style={{
            backgroundColor: canContinue ? '#007AFF' : '#E5E5E7',
            color: canContinue ? '#FFFFFF' : '#86868B',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Continue
        </button>
        <button
          onClick={onSkip}
          className="w-full text-center py-2"
          style={{ fontSize: '16px', color: '#86868B' }}
        >
          I'll set this up later
        </button>
      </div>
    </div>
  );
}