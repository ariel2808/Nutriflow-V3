import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { athleteTypes, renderIcon } from '../profileSetup/ProfileSetupConstants';

interface AthleteTypeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSportTypes: string[];
}

// Sport-specific data
const sportCharacteristics = {
  runner: {
    primaryFocus: 'Endurance',
    trainingVolume: 'High',
    recoveryNeeds: 'Extended',
    seasonalVariation: 'Yes',
    carbLoading: 'Critical',
    hydration: 'Very High',
    proteinTiming: 'Post-workout',
    electrolyteBalance: 'Essential',
    baseSeasonFocus: 'Volume building',
    baseSeasonNutrition: 'Moderate carbs',
    competitionFocus: 'Intensity + Racing',
    competitionNutrition: 'High performance fuel',
    color: '#F97316'
  },
  cyclist: {
    primaryFocus: 'Endurance + Power',
    trainingVolume: 'Very High',
    recoveryNeeds: 'Extended',
    seasonalVariation: 'Yes',
    carbLoading: 'Critical',
    hydration: 'Very High',
    proteinTiming: 'During + Post-workout',
    electrolyteBalance: 'Critical',
    baseSeasonFocus: 'Base miles + Power',
    baseSeasonNutrition: 'High carbs',
    competitionFocus: 'Race prep + Events',
    competitionNutrition: 'Race-day fueling',
    color: '#3B82F6'
  },
  strength: {
    primaryFocus: 'Muscle + Power',
    trainingVolume: 'Moderate',
    recoveryNeeds: 'High',
    seasonalVariation: 'Limited',
    carbLoading: 'Moderate',
    hydration: 'High',
    proteinTiming: 'Pre + Post-workout',
    electrolyteBalance: 'Important',
    baseSeasonFocus: 'Volume + Hypertrophy',
    baseSeasonNutrition: 'High protein + Carbs',
    competitionFocus: 'Peak strength',
    competitionNutrition: 'Performance timing',
    color: '#8B5CF6'
  },
  swimmer: {
    primaryFocus: 'Endurance + Technique',
    trainingVolume: 'High',
    recoveryNeeds: 'Extended',
    seasonalVariation: 'Yes',
    carbLoading: 'Important',
    hydration: 'High',
    proteinTiming: 'Post-workout',
    electrolyteBalance: 'Essential',
    baseSeasonFocus: 'Aerobic base',
    baseSeasonNutrition: 'Balanced macros',
    competitionFocus: 'Speed + Taper',
    competitionNutrition: 'Competition prep',
    color: '#10B981'
  },
  triathlete: {
    primaryFocus: 'Multi-discipline Endurance',
    trainingVolume: 'Very High',
    recoveryNeeds: 'Critical',
    seasonalVariation: 'Yes',
    carbLoading: 'Critical',
    hydration: 'Critical',
    proteinTiming: 'Multiple times daily',
    electrolyteBalance: 'Critical',
    baseSeasonFocus: 'Build all disciplines',
    baseSeasonNutrition: 'High carbs + Protein',
    competitionFocus: 'Race-specific prep',
    competitionNutrition: 'Race-day strategy',
    color: '#EF4444'
  }
};

// Default characteristics for unknown sports
const defaultCharacteristics = {
  primaryFocus: 'Sport-specific',
  trainingVolume: 'Moderate',
  recoveryNeeds: 'Standard',
  seasonalVariation: 'Varies',
  carbLoading: 'Important',
  hydration: 'High',
  proteinTiming: 'Post-workout',
  electrolyteBalance: 'Important',
  baseSeasonFocus: 'Foundation building',
  baseSeasonNutrition: 'Balanced approach',
  competitionFocus: 'Performance peak',
  competitionNutrition: 'Optimized timing',
  color: '#6B7280'
};

export function AthleteTypeDetailsModal({ isOpen, onClose, selectedSportTypes }: AthleteTypeDetailsModalProps) {
  // Get characteristics for selected sports
  const getCharacteristics = () => {
    if (selectedSportTypes.length === 0) return defaultCharacteristics;
    
    // For multiple sports, combine characteristics intelligently
    if (selectedSportTypes.length > 1) {
      const chars = selectedSportTypes.map(sport => 
        sportCharacteristics[sport as keyof typeof sportCharacteristics] || defaultCharacteristics
      );
      
      return {
        primaryFocus: 'Multi-sport Endurance',
        trainingVolume: 'Very High',
        recoveryNeeds: 'Critical',
        seasonalVariation: 'Yes',
        carbLoading: 'Critical',
        hydration: 'Critical',
        proteinTiming: 'Multiple times daily',
        electrolyteBalance: 'Critical',
        baseSeasonFocus: 'Multi-discipline base',
        baseSeasonNutrition: 'High carbs + Protein',
        competitionFocus: 'Sport-specific peaks',
        competitionNutrition: 'Adaptive strategy',
        color: '#F59E0B'
      };
    }
    
    return sportCharacteristics[selectedSportTypes[0] as keyof typeof sportCharacteristics] || defaultCharacteristics;
  };

  const characteristics = getCharacteristics();
  const selectedSports = athleteTypes.filter(type => selectedSportTypes.includes(type.id));

  // Generate title
  const getTitle = () => {
    if (selectedSports.length === 0) return 'Athlete Profile';
    if (selectedSports.length === 1) return selectedSports[0].title;
    if (selectedSports.length === 2) {
      return selectedSports.map(s => s.title.split(' ')[0]).join(' & ');
    }
    return 'Multi-sport Athlete';
  };

  const getSubtitle = () => {
    if (selectedSports.length <= 1) {
      return selectedSports[0]?.subtitle || 'Athletic profile';
    }
    return 'Multi-sport athlete';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Background Overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-main)',
            boxShadow: '0px 10px 40px rgba(0,0,0,0.15)',
            maxHeight: '80vh'
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex-1">
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                marginBottom: '4px',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                {getTitle()}
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                {getSubtitle()}
              </p>
            </div>

            {/* Sport Icons */}
            <div className="flex items-center gap-2 ml-4">
              {selectedSports.slice(0, 3).map((sport, index) => (
                <div key={sport.id} style={{ fontSize: '24px' }}>
                  {renderIcon(sport.icon)}
                </div>
              ))}
              {selectedSports.length > 3 && (
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)',
                  fontWeight: '500'
                }}>
                  +{selectedSports.length - 3}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-full transition-colors duration-200"
              style={{ 
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 pb-6 overflow-y-auto scrollbar-visible" style={{ maxHeight: 'calc(80vh - 120px)' }}>
            <div className="space-y-4">

              {/* Section 1: Training Characteristics */}
              <motion.div 
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: '20px' }}>💪</span>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Training Characteristics
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Primary Focus:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: characteristics.color,
                      fontWeight: '600'
                    }}>
                      {characteristics.primaryFocus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Training Volume:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: characteristics.color,
                      fontWeight: '600'
                    }}>
                      {characteristics.trainingVolume}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Recovery Needs:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: characteristics.color,
                      fontWeight: '600'
                    }}>
                      {characteristics.recoveryNeeds}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Seasonal Variation:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: characteristics.color,
                      fontWeight: '600'
                    }}>
                      {characteristics.seasonalVariation}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Section 2: Nutrition Priorities */}
              <motion.div 
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: '20px' }}>🍎</span>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Nutrition Priorities
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Carb Loading:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#10B981',
                      fontWeight: '600'
                    }}>
                      {characteristics.carbLoading}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Hydration:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#10B981',
                      fontWeight: '600'
                    }}>
                      {characteristics.hydration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Protein Timing:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#10B981',
                      fontWeight: '600'
                    }}>
                      {characteristics.proteinTiming}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      • Electrolyte Balance:
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#10B981',
                      fontWeight: '600'
                    }}>
                      {characteristics.electrolyteBalance}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Section 3: Training Periodization */}
              <motion.div 
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Training Periodization
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {/* Base Season */}
                  <div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      Base Season (Nov-Feb)
                    </div>
                    <div className="space-y-1 ml-2">
                      <div className="flex justify-between">
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          • Focus:
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          {characteristics.baseSeasonFocus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          • Nutrition:
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          {characteristics.baseSeasonNutrition}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Competition Season */}
                  <div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      Competition (Mar-Oct)
                    </div>
                    <div className="space-y-1 ml-2">
                      <div className="flex justify-between">
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          • Focus:
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          {characteristics.competitionFocus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          • Nutrition:
                        </span>
                        <span style={{ 
                          fontSize: '13px', 
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          {characteristics.competitionNutrition}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}