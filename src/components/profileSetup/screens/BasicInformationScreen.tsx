import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { ProfileSetupStepProps } from '../ProfileSetupTypes';
import { BasicInformationData } from '../ProfileSetupTypes';

interface BasicInformationScreenProps extends ProfileSetupStepProps {
  basicInfo: BasicInformationData;
  onBasicInfoChange: (field: keyof BasicInformationData, value: string) => void;
  onUnitsToggle: (units: 'metric' | 'imperial') => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Activity level data with visual design
const activityLevels = [
  { 
    value: 'sedentary', 
    title: 'Desk Job', 
    description: 'Office work', 
    icon: '💻',
    color: '#64748B'
  },
  { 
    value: 'lightly-active', 
    title: 'Light Activity', 
    description: 'Teaching, retail', 
    icon: '🚶',
    color: '#10B981'
  },
  { 
    value: 'moderately-active', 
    title: 'Active Work', 
    description: 'Nurse, server', 
    icon: '🏃',
    color: '#F59E0B'
  },
  { 
    value: 'very-active', 
    title: 'Physical Job', 
    description: 'Construction', 
    icon: '🔨',
    color: '#EF4444'
  }
];

export function BasicInformationScreen({
  basicInfo,
  onBasicInfoChange,
  onUnitsToggle,
  onDateChange,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: BasicInformationScreenProps) {
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
                background: 'linear-gradient(90deg, #FF6B35 0%, #FF8A50 100%)'
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
          Basic Information
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--text-secondary)', 
          fontFamily: 'SF Pro Display, system-ui, sans-serif' 
        }}>
          Help us personalize your nutrition needs
        </p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-visible relative" style={{ zIndex: 10 }}>
        <div className="px-5 pb-6">
          <div className="space-y-6 w-full">
            
            {/* Section 1: Personal Details Card */}
            <motion.div 
              className="p-5 rounded-2xl transition-all duration-200 cursor-pointer w-full"
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '2px solid var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'var(--btn-primary-bg)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(74, 144, 226, 0.1)' }}
                >
                  <User size={20} style={{ color: 'var(--btn-primary-bg)' }} />
                </div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Personal Details
                </h3>
              </div>

              {/* Full Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={basicInfo.fullName}
                  onChange={(e) => onBasicInfoChange('fullName', e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border transition-all duration-150"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--input-text)',
                    fontSize: '16px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    minHeight: '48px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--btn-primary-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--input-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Birth Date Input */}
              <div className="relative">
                <input
                  type="date"
                  value={basicInfo.dateOfBirth}
                  onChange={onDateChange}
                  className="w-full px-3 py-3 rounded-xl border transition-all duration-150"
                  style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: basicInfo.dateOfBirth ? 'var(--input-text)' : 'var(--input-placeholder)',
                    fontSize: '16px',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    minHeight: '48px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--btn-primary-bg)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--input-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <Calendar 
                  size={20} 
                  style={{ color: 'var(--icon-secondary)' }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" 
                />
              </div>
            </motion.div>

            {/* Section 2: Gender Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: '16px' }}>⚧</span>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Gender
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 w-full">
                {/* Male Card */}
                <motion.button
                  onClick={() => onBasicInfoChange('gender', 'male')}
                  className="p-3 rounded-xl border transition-all duration-200 text-center"
                  style={{
                    backgroundColor: basicInfo.gender === 'male' ? 'rgba(74, 144, 226, 0.1)' : 'var(--bg-main)',
                    border: basicInfo.gender === 'male' ? '2px solid var(--btn-primary-bg)' : '1px solid var(--border)',
                    height: '80px',
                    width: '100%'
                  }}
                  whileHover={{ 
                    backgroundColor: basicInfo.gender === 'male' ? 'rgba(74, 144, 226, 0.1)' : 'var(--bg-card)',
                    scale: 1.02 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div style={{ fontSize: '28px', marginBottom: '2px' }}>👨</div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Male
                    </div>
                  </div>
                </motion.button>

                {/* Female Card */}
                <motion.button
                  onClick={() => onBasicInfoChange('gender', 'female')}
                  className="p-3 rounded-xl border transition-all duration-200 text-center"
                  style={{
                    backgroundColor: basicInfo.gender === 'female' ? 'rgba(74, 144, 226, 0.1)' : 'var(--bg-main)',
                    border: basicInfo.gender === 'female' ? '2px solid var(--btn-primary-bg)' : '1px solid var(--border)',
                    height: '80px',
                    width: '100%'
                  }}
                  whileHover={{ 
                    backgroundColor: basicInfo.gender === 'female' ? 'rgba(74, 144, 226, 0.1)' : 'var(--bg-card)',
                    scale: 1.02 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div style={{ fontSize: '28px', marginBottom: '2px' }}>👩</div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'var(--text-primary)',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif'
                    }}>
                      Female
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Section 3: Physical Measurements Card */}
            <motion.div 
              className="p-5 rounded-2xl transition-all duration-200 w-full"
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '2px solid var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'var(--btn-primary-bg)',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(74, 144, 226, 0.1)' }}
                  >
                    <span style={{ fontSize: '20px' }}>📏</span>
                  </div>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: 'var(--text-primary)',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Physical Measurements
                  </h3>
                </div>
              </div>

              {/* Units Toggle */}
              <div className="mb-5">
                <div 
                  className="inline-flex p-0.5 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-card)' }}
                >
                  <button
                    onClick={() => onUnitsToggle('metric')}
                    className="px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: basicInfo.units === 'metric' ? 'var(--bg-main)' : 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      boxShadow: basicInfo.units === 'metric' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => onUnitsToggle('imperial')}
                    className="px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: basicInfo.units === 'imperial' ? 'var(--bg-main)' : 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      boxShadow: basicInfo.units === 'imperial' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              {/* Height and Weight Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Height */}
                <div>
                  <label style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '4px', 
                    display: 'block',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Height
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={basicInfo.units === 'metric' ? '175' : '69'}
                      value={basicInfo.height}
                      onChange={(e) => onBasicInfoChange('height', e.target.value)}
                      className="w-full px-3 py-3 pr-10 rounded-xl border transition-all duration-150"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--input-text)',
                        fontSize: '16px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        minHeight: '48px'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--btn-primary-bg)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <span 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                    >
                      {basicInfo.units === 'metric' ? 'cm' : 'in'}
                    </span>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '4px', 
                    display: 'block',
                    fontFamily: 'SF Pro Display, system-ui, sans-serif'
                  }}>
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={basicInfo.units === 'metric' ? '70' : '154'}
                      value={basicInfo.weight}
                      onChange={(e) => onBasicInfoChange('weight', e.target.value)}
                      className="w-full px-3 py-3 pr-10 rounded-xl border transition-all duration-150"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--input-text)',
                        fontSize: '16px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        minHeight: '48px'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--btn-primary-bg)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <span 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                    >
                      {basicInfo.units === 'metric' ? 'kg' : 'lbs'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Weight */}
              <div>
                <label style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '4px', 
                  display: 'block',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Target Weight (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={basicInfo.units === 'metric' ? '68' : '150'}
                    value={basicInfo.targetWeight}
                    onChange={(e) => onBasicInfoChange('targetWeight', e.target.value)}
                    className="w-full px-3 py-3 pr-10 rounded-xl border transition-all duration-150"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--input-text)',
                      fontSize: '16px',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      minHeight: '48px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--btn-primary-bg)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--input-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <span 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                  >
                    {basicInfo.units === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Section 4: Work Activity Level */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '16px' }}>🏃</span>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Work Activity Level
                </h3>
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                (Outside of training sessions)
              </p>
              
              <div className="grid grid-cols-2 gap-2 w-full">
                {activityLevels.map((level, index) => (
                  <motion.button
                    key={level.value}
                    onClick={() => onBasicInfoChange('activityLevel', level.value)}
                    className="p-3 rounded-xl border transition-all duration-200 text-left"
                    style={{
                      backgroundColor: basicInfo.activityLevel === level.value ? 'rgba(74, 144, 226, 0.1)' : 'var(--bg-main)',
                      border: basicInfo.activityLevel === level.value ? '2px solid var(--btn-primary-bg)' : '1px solid var(--border)',
                      height: '100px',
                      width: '100%'
                    }}
                    whileHover={{ 
                      backgroundColor: basicInfo.activityLevel === level.value ? 'rgba(74, 144, 226, 0.1)' : 'var(--bg-card)',
                      scale: 1.02 
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex flex-col items-center text-center h-full justify-center">
                      <div style={{ fontSize: '20px', marginBottom: '2px' }}>{level.icon}</div>
                      <div 
                        className="w-3 h-3 rounded-full mb-1"
                        style={{ backgroundColor: level.color }}
                      />
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: 'var(--text-primary)',
                        marginBottom: '1px',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        lineHeight: '1.2'
                      }}>
                        {level.title}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-secondary)',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif',
                        lineHeight: '1.2'
                      }}>
                        {level.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
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
            backgroundColor: canContinue ? 'var(--btn-primary-bg)' : 'var(--btn-secondary-bg)',
            color: canContinue ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            fontSize: '16px',
            fontWeight: '500',
            height: '52px',
            fontFamily: 'SF Pro Display, system-ui, sans-serif'
          }}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
        >
          Continue
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