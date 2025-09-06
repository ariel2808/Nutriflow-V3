import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface TrainingVolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVolume: string;
  onVolumeUpdate: (volume: string) => void;
}

const trainingVolumes = [
  { id: 'light', icon: '💪', title: '3-5 hours', subtitle: 'Light load', description: 'Getting started or maintaining' },
  { id: 'moderate', icon: '🔥', title: '5-10 hours', subtitle: 'Moderate load', description: 'Regular training routine' },
  { id: 'heavy', icon: '⚡', title: '10-15 hours', subtitle: 'Heavy load', description: 'Serious athlete' },
  { id: 'elite', icon: '🚀', title: '15+ hours', subtitle: 'Full-time athlete', description: 'Elite level training' },
];

export function TrainingVolumeModal({ isOpen, onClose, currentVolume, onVolumeUpdate }: TrainingVolumeModalProps) {
  const [selectedVolume, setSelectedVolume] = useState<string>(currentVolume);

  const handleSave = () => {
    onVolumeUpdate(selectedVolume);
    onClose();
  };

  const handleCancel = () => {
    setSelectedVolume(currentVolume); // Reset to original state
    onClose();
  };

  // Find the selected volume object to display title
  const getCurrentVolumeTitle = (volumeId: string): string => {
    const volume = trainingVolumes.find(v => v.id === volumeId);
    return volume ? volume.title : volumeId;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeInOut" } }}
          onClick={handleCancel}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-sm rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
          style={{ backgroundColor: 'var(--bg-main)' }}
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
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
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

          {/* Header */}
          <div 
            className="relative z-10 p-6 border-b"
            style={{ borderBottomColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl" style={{ color: 'var(--text-primary)' }}>Training Volume</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Weekly training hours</p>
              </div>
              <button
                onClick={handleCancel}
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
          </div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Volume Options */}
            <div className="space-y-3 mb-6">
              {trainingVolumes.map((volume) => {
                const isSelected = selectedVolume === volume.id;
                return (
                  <motion.button
                    key={volume.id}
                    onClick={() => setSelectedVolume(volume.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                      border: `2px solid ${isSelected ? '#10B981' : 'var(--border)'}`,
                      boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#10B981';
                        e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <div style={{ fontSize: '28px' }}>{volume.icon}</div>
                      <div className="text-left">
                        <div style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: 'var(--text-primary)', 
                          marginBottom: '2px',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {volume.title}
                        </div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: isSelected ? '#10B981' : 'var(--text-secondary)', 
                          marginBottom: '2px', 
                          fontWeight: '500',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {volume.subtitle}
                        </div>
                        <div style={{ 
                          fontSize: '13px', 
                          color: 'var(--text-placeholder)',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {volume.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check size={16} color="#FFFFFF" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Current Selection Display */}
            <div 
              className="rounded-xl p-4 mb-6"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              <div className="text-center">
                <p className="text-xs mb-1" style={{ 
                  color: 'var(--text-placeholder)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>Current Selection</p>
                <p className="text-sm" style={{ 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  {getCurrentVolumeTitle(selectedVolume)} per week
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 rounded-full transition-colors text-sm"
                style={{
                  color: 'var(--btn-secondary-text)',
                  backgroundColor: 'var(--btn-secondary-bg)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--btn-secondary-bg)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
                style={{
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}
              >
                <Check size={16} />
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}