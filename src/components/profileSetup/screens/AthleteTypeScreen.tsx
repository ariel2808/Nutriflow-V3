import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { ProfileSetupStepProps } from '../ProfileSetupTypes';
import { athleteTypes, suggestedSports, renderIcon } from '../ProfileSetupConstants';

interface AthleteTypeScreenProps extends ProfileSetupStepProps {
  selectedAthletes: string[];
  showOtherSearch: boolean;
  searchQuery: string;
  customSports: string[];
  onAthleteToggle: (id: string) => void;
  onSearchQueryChange: (query: string) => void;
  onCustomSportAdd: (sport: string) => void;
  onCustomSportRemove: (sport: string) => void;
}

export function AthleteTypeScreen({
  selectedAthletes,
  showOtherSearch,
  searchQuery,
  customSports,
  onAthleteToggle,
  onSearchQueryChange,
  onCustomSportAdd,
  onCustomSportRemove,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: AthleteTypeScreenProps) {
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
          What type of athlete are you?
        </h1>
        <p style={{ fontSize: '16px', color: '#86868B', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          Select all that apply to your athletic identity
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-5 overflow-y-auto scrollbar-visible">
        <div className="space-y-3 mb-6">
          {athleteTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => onAthleteToggle(type.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: selectedAthletes.includes(type.id) ? '#F0F8FF' : '#FFFFFF',
                border: selectedAthletes.includes(type.id) ? '2px solid #007AFF' : '1px solid #E5E5E7',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                {renderIcon(type.icon)}
                <div className="text-left">
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1D1D1F', marginBottom: '2px' }}>
                    {type.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#86868B' }}>
                    {type.subtitle}
                  </div>
                </div>
              </div>
              {selectedAthletes.includes(type.id) && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check size={16} color="#FFFFFF" />
                </div>
              )}
            </motion.button>
          ))}

          {/* Other Row */}
          <motion.button
            onClick={() => onAthleteToggle('other')}
            className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
            style={{
              backgroundColor: showOtherSearch ? '#F0F8FF' : '#FFFFFF',
              border: showOtherSearch ? '2px solid #007AFF' : '1px solid #E5E5E7',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-4">
              <div style={{ fontSize: '24px' }}>➕</div>
              <div className="text-left">
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1D1D1F', marginBottom: '2px' }}>
                  Other Sports
                </div>
                <div style={{ fontSize: '13px', color: '#86868B' }}>
                  Search for more sports...
                </div>
              </div>
            </div>
            <ChevronDown 
              size={20} 
              style={{ 
                color: '#86868B',
                transform: showOtherSearch ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </motion.button>

          {/* Other Search Section */}
          <AnimatePresence>
            {showOtherSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Type your sport or activity..."
                      value={searchQuery}
                      onChange={(e) => onSearchQueryChange(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E0E0E0',
                        color: '#1D1D1F'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          onCustomSportAdd(searchQuery);
                        }
                      }}
                    />
                    <button
                      onClick={() => onCustomSportAdd(searchQuery)}
                      disabled={!searchQuery}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>

                  {/* Custom Sports List */}
                  {customSports.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {customSports.map((sport) => (
                        <div key={sport} className="flex items-center justify-between bg-white p-2 rounded-lg">
                          <span className="text-sm">{sport}</span>
                          <button
                            onClick={() => onCustomSportRemove(sport)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Sports */}
                  <div>
                    <p style={{ fontSize: '14px', color: '#86868B', marginBottom: '8px' }}>Suggested:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSports.map((sport) => (
                        <button
                          key={sport}
                          onClick={() => onCustomSportAdd(sport)}
                          className="px-3 py-1 rounded-full text-sm transition-colors"
                          style={{
                            backgroundColor: customSports.includes(sport) ? '#007AFF' : '#F0F0F0',
                            color: customSports.includes(sport) ? '#FFFFFF' : '#1D1D1F'
                          }}
                        >
                          {sport}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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