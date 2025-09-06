import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Moon, Bed } from 'lucide-react';
import { ProfileSetupStepProps, SleepRecoveryData } from '../ProfileSetupTypes';
import { calculateSleepHours } from '../ProfileSetupHelpers';

interface SleepRecoveryScreenProps extends ProfileSetupStepProps {
  sleepRecovery: SleepRecoveryData;
  onSleepRecoveryChange: (field: keyof SleepRecoveryData, value: any) => void;
}

// Sleep quality options
const sleepQualityOptions = [
  { value: 'excellent', label: 'Excellent', emoji: '⭐', color: '#10B981' },
  { value: 'good', label: 'Good', emoji: '😊', color: '#F59E0B' },
  { value: 'fair', label: 'Fair', emoji: '😐', color: '#F59E0B' },
  { value: 'poor', label: 'Poor', emoji: '😴', color: '#EF4444' }
];

export function SleepRecoveryScreen({
  sleepRecovery,
  onSleepRecoveryChange,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: SleepRecoveryScreenProps) {
  const sleepHours = calculateSleepHours(sleepRecovery.bedtime, sleepRecovery.wakeTime);

  // Convert sleep hours to slider value (6-10 range)
  const getSleepHoursSliderValue = () => {
    if (sleepRecovery.targetSleepHours) {
      return sleepRecovery.targetSleepHours;
    }
    return sleepHours || 8; // Default to 8 hours
  };

  const handleSleepHoursChange = (value: number) => {
    onSleepRecoveryChange('targetSleepHours', value);
  };

  const formatSleepHours = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) {
      return `${wholeHours}h`;
    } else if (minutes === 30) {
      return `${wholeHours}.5h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Fixed Header */}
      <div 
        className="flex-shrink-0 w-full px-5 pt-14 pb-6 relative"
        style={{ 
          backgroundColor: 'var(--bg-main)',
          zIndex: 30
        }}
      >
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft size={24} style={{ color: 'var(--text-primary)' }} />
          </button>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stepIndicator}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div 
            className="w-full rounded-full overflow-hidden"
            style={{ height: '4px', backgroundColor: 'var(--border)' }}
          >
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #8B5CF6 0%, #A855F7 100%)'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Title Section */}
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: 'var(--text-primary)', 
          marginBottom: '8px', 
          fontFamily: 'SF Pro Display, system-ui, sans-serif' 
        }}>
          Sleep & Recovery
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--text-secondary)', 
          fontFamily: 'SF Pro Display, system-ui, sans-serif' 
        }}>
          Better sleep means better performance
        </p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-visible relative" style={{ zIndex: 10 }}>
        <div className="px-5 pb-6">
          <div className="space-y-6 w-full">
            
            {/* Section 1: Sleep Goal Card */}
            <motion.div 
              className="p-5 rounded-2xl transition-all duration-200 cursor-pointer w-full"
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '2px solid var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              whileHover={{ 
                scale: 1.02,
                borderColor: '#8B5CF6',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                >
                  <Moon size={20} style={{ color: '#8B5CF6' }} />
                </div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Average Sleep Hours
                </h3>
              </div>

              {/* Sleep Hours Display */}
              <div className="text-center mb-6">
                <div 
                  className="inline-flex items-center justify-center px-6 py-4 rounded-2xl mb-4"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                >
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold', 
                    color: '#8B5CF6',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    {formatSleepHours(getSleepHoursSliderValue())}
                  </div>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  per night
                </p>
              </div>

              {/* Sleep Hours Slider */}
              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>6h</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>10h</span>
                </div>
                
                <div className="relative w-full">
                  <input
                    type="range"
                    min="6"
                    max="10"
                    step="0.5"
                    value={getSleepHoursSliderValue()}
                    onChange={(e) => handleSleepHoursChange(parseFloat(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((getSleepHoursSliderValue() - 6) / 4) * 100}%, #E5E7EB ${((getSleepHoursSliderValue() - 6) / 4) * 100}%, #E5E7EB 100%)`,
                      outline: 'none'
                    }}
                  />
                  <style jsx>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: #FFFFFF;
                      border: 3px solid #8B5CF6;
                      cursor: pointer;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: #FFFFFF;
                      border: 3px solid #8B5CF6;
                      cursor: pointer;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                  `}</style>
                </div>
              </div>
            </motion.div>

            {/* Section 2: Sleep Quality Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: '16px' }}>😴</span>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Sleep Quality
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                {sleepQualityOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    onClick={() => onSleepRecoveryChange('sleepQuality', option.value)}
                    className="p-4 rounded-xl border transition-all duration-200 text-center"
                    style={{
                      backgroundColor: sleepRecovery.sleepQuality === option.value ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-main)',
                      border: sleepRecovery.sleepQuality === option.value ? '2px solid #8B5CF6' : '1px solid var(--border)',
                      height: '80px',
                      width: '100%'
                    }}
                    whileHover={{ 
                      backgroundColor: sleepRecovery.sleepQuality === option.value ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-card)',
                      scale: 1.02 
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{option.emoji}</div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: 'var(--text-primary)',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {option.label}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Section 3: Bedtime Card */}
            <motion.div 
              className="p-5 rounded-2xl transition-all duration-200 w-full"
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '2px solid var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              whileHover={{ 
                scale: 1.02,
                borderColor: '#8B5CF6',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                >
                  <Bed size={20} style={{ color: '#8B5CF6' }} />
                </div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Typical Bedtime
                </h3>
              </div>

              {/* Bedtime Input */}
              <div>
                <label style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '8px', 
                  display: 'block',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  What time do you usually go to bed?
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={sleepRecovery.bedtime}
                    onChange={(e) => onSleepRecoveryChange('bedtime', e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl border transition-all duration-150"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--input-text)',
                      fontSize: '16px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      minHeight: '48px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8B5CF6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--input-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <Bed 
                    size={20} 
                    style={{ color: 'var(--icon-secondary)' }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" 
                  />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Fixed Footer Actions */}
      <div 
        className="flex-shrink-0 w-full px-5 py-5 relative"
        style={{ 
          backgroundColor: 'var(--bg-main)',
          zIndex: 30
        }}
      >
        <motion.button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full rounded-2xl text-center transition-all duration-200 mb-3"
          style={{
            backgroundColor: canContinue ? '#8B5CF6' : 'var(--btn-secondary-bg)',
            color: canContinue ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '16px',
            fontWeight: '500',
            height: '52px',
            fontFamily: 'SF Pro Display, system-ui, sans-serif',
            background: canContinue ? 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)' : 'var(--btn-secondary-bg)'
          }}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
        >
          Complete Profile
        </motion.button>
        <button
          onClick={onSkip}
          className="w-full text-center transition-colors duration-200"
          style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)',
            height: '44px',
            fontFamily: 'SF Pro Display, system-ui, sans-serif'
          }}
        >
          I'll set this up later
        </button>
      </div>
    </div>
  );
}