import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { ProfileSetupStepProps, TrainingScheduleData } from '../ProfileSetupTypes';
import { days, timeSlots, durationOptions } from '../ProfileSetupConstants';

interface TrainingScheduleScreenProps extends ProfileSetupStepProps {
  trainingSchedule: TrainingScheduleData;
  onDayToggle: (day: string) => void;
  onDayExpand: (day: string) => void;
  onSlotToggle: (day: string, slotId: string) => void;
  onDurationChange: (day: string, slotId: string, duration: string) => void;
}

export function TrainingScheduleScreen({
  trainingSchedule,
  onDayToggle,
  onDayExpand,
  onSlotToggle,
  onDurationChange,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: TrainingScheduleScreenProps) {
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
          Your Weekly Training Schedule
        </h1>
        <p style={{ fontSize: '16px', color: '#86868B', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          Plan your training times for each day
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-5 overflow-y-auto scrollbar-visible">
        <div className="space-y-4 pb-4">
          {days.map((day) => (
            <div
              key={day}
              className="rounded-xl border transition-all duration-200"
              style={{
                backgroundColor: trainingSchedule[day].enabled ? '#F8F9FA' : '#FFFFFF',
                border: '1px solid #E5E5E7'
              }}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '16px' }}>📅</span>
                  <span style={{ fontSize: '18px', fontWeight: '500', color: '#1D1D1F' }}>
                    {day.toUpperCase()}
                  </span>
                  {trainingSchedule[day].enabled && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {Object.values(trainingSchedule[day].slots).filter(slot => slot.enabled).length} sessions
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {trainingSchedule[day].enabled && (
                    <button
                      onClick={() => onDayExpand(day)}
                      className="p-1 rounded transition-colors"
                      style={{ color: '#86868B' }}
                    >
                      {trainingSchedule[day].expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  )}
                  <button
                    onClick={() => onDayToggle(day)}
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                    style={{
                      backgroundColor: trainingSchedule[day].enabled ? '#007AFF' : '#E5E5E7'
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      style={{
                        transform: trainingSchedule[day].enabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)'
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Time Slots */}
              <AnimatePresence>
                {trainingSchedule[day].enabled && trainingSchedule[day].expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t px-4 pb-4"
                    style={{ borderColor: '#E5E5E7' }}
                  >
                    <div className="space-y-3 pt-4">
                      {timeSlots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => onSlotToggle(day, slot.id)}
                              className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                              style={{
                                borderColor: trainingSchedule[day].slots[slot.id].enabled ? '#007AFF' : '#E5E5E7',
                                backgroundColor: trainingSchedule[day].slots[slot.id].enabled ? '#007AFF' : 'transparent'
                              }}
                            >
                              {trainingSchedule[day].slots[slot.id].enabled && (
                                <Check size={12} color="#FFFFFF" />
                              )}
                            </button>
                            <span style={{ fontSize: '16px' }}>{slot.icon}</span>
                            <span style={{ fontSize: '14px', color: '#1D1D1F' }}>
                              {slot.label} [{slot.time}]
                            </span>
                          </div>
                          
                          {trainingSchedule[day].slots[slot.id].enabled && (
                            <div className="relative">
                              <select
                                value={trainingSchedule[day].slots[slot.id].duration}
                                onChange={(e) => onDurationChange(day, slot.id, e.target.value)}
                                className="appearance-none bg-white border rounded-lg px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                style={{
                                  borderColor: '#E5E5E7',
                                  color: '#1D1D1F'
                                }}
                              >
                                <option value="">Duration</option>
                                {durationOptions.map((duration) => (
                                  <option key={duration} value={duration}>{duration}</option>
                                ))}
                              </select>
                              <ChevronDown 
                                size={16} 
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" 
                                color="#86868B"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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