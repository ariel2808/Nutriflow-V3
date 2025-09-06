import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { ProfileSetupStepProps } from '../ProfileSetupTypes';
import { trainingVolumes } from '../ProfileSetupConstants';

interface TrainingVolumeScreenProps extends ProfileSetupStepProps {
  selectedVolume: string;
  onVolumeSelect: (volumeId: string) => void;
}

export function TrainingVolumeScreen({
  selectedVolume,
  onVolumeSelect,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: TrainingVolumeScreenProps) {
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
          Weekly Training Volume
        </h1>
        <p style={{ fontSize: '16px', color: '#86868B', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          How much do you typically train per week?
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-5 overflow-y-auto scrollbar-visible">
        <div className="space-y-3 mb-6">
          {trainingVolumes.map((volume) => (
            <motion.button
              key={volume.id}
              onClick={() => onVolumeSelect(volume.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: selectedVolume === volume.id ? '#F0F8FF' : '#FFFFFF',
                border: selectedVolume === volume.id ? '2px solid #007AFF' : '1px solid #E5E5E7',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <div style={{ fontSize: '28px' }}>{volume.icon}</div>
                <div className="text-left">
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1D1D1F', marginBottom: '2px' }}>
                    {volume.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#007AFF', marginBottom: '2px', fontWeight: '500' }}>
                    {volume.subtitle}
                  </div>
                  <div style={{ fontSize: '13px', color: '#86868B' }}>
                    {volume.description}
                  </div>
                </div>
              </div>
              {selectedVolume === volume.id && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={16} color="#FFFFFF" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
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