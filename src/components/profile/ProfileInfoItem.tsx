import React, { useState } from 'react';
import { ProfileInfoItem as ProfileInfoItemType } from './ProfileData';
import { WeightHistoryModal } from './WeightHistoryModal';
import { GoalsRadarChart } from './GoalsRadarChart';
import { TrainingVolumeModal } from './TrainingVolumeModal';
import { SupplementsModal } from './SupplementsModal';
import { DietaryPreferencesModal } from './DietaryPreferencesModal';
import { SleepHoursModal } from '../SleepHoursModal';
import { Supplement } from './SupplementTypes';
import { formatSupplementsDisplay } from './SupplementHelpers';

interface ProfileInfoItemProps {
  item: ProfileInfoItemType;
  onModalStateChange: (isOpen: boolean) => void;
}

export function ProfileInfoItem({ item, onModalStateChange }: ProfileInfoItemProps) {
  const Icon = item.icon;
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showTrainingVolumeModal, setShowTrainingVolumeModal] = useState(false);
  const [showSupplementsModal, setShowSupplementsModal] = useState(false);
  const [showDietaryPreferencesModal, setShowDietaryPreferencesModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(78.0);
  const [currentTrainingVolume, setCurrentTrainingVolume] = useState<string>('moderate');
  const [currentSupplements, setCurrentSupplements] = useState<Supplement[]>([
    { id: '1', name: 'Creatine', form: 'powder', dosage: '5g', schedule: 'Daily', startDate: '2024-01-01' },
    { id: '2', name: 'Omega 3', form: 'capsule', dosage: '1000mg', schedule: 'Daily', startDate: '2024-01-01' },
    { id: '3', name: 'Magnesium', form: 'tablet', dosage: '400mg', schedule: 'Before bed', startDate: '2024-01-01' }
  ]);
  const [currentDietaryPreferences, setCurrentDietaryPreferences] = useState<string[]>(['kosher']);
  const [currentSleepHours, setCurrentSleepHours] = useState(7.5);
  
  const isWeightItem = item.label === 'Current Weight';
  const isGoalItem = item.label === 'Goal';
  const isTrainingVolumeItem = item.label === 'Training Volume';
  const isSupplementsItem = item.label === 'Supplements Used';
  const isDietaryPreferenceItem = item.label === 'Dietary Preference';
  const isSleepItem = item.label === 'Average Sleep';
  
  const handleWeightUpdate = (newWeight: number) => {
    setCurrentWeight(newWeight);
  };

  const handleTrainingVolumeUpdate = (volume: string) => {
    setCurrentTrainingVolume(volume);
  };

  const handleSupplementsUpdate = (supplements: Supplement[]) => {
    setCurrentSupplements(supplements);
  };

  const handleDietaryPreferencesUpdate = (preferences: string[]) => {
    setCurrentDietaryPreferences(preferences);
  };

  const handleSleepHoursUpdate = (hours: number) => {
    setCurrentSleepHours(hours);
  };

  const formatSleepHoursDisplay = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    } else if (minutes === 30) {
      return `${wholeHours}h 30m`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  };

  const formatTrainingVolumeDisplay = (volumeId: string): string => {
    const volumes: { [key: string]: string } = {
      'light': '3-5 hours',
      'moderate': '5-10 hours', 
      'heavy': '10-15 hours',
      'elite': '15+ hours'
    };
    return volumes[volumeId] || volumeId;
  };

  const formatDietaryPreferencesDisplay = (preferences: string[]): string => {
    if (preferences.length === 0) return 'No preference';
    if (preferences.includes('none')) return 'No preference';
    
    const labels: { [key: string]: string } = {
      'kosher': 'Kosher',
      'vegan': 'Vegan',
      'vegetarian': 'Vegetarian',
      'low-carb': 'Low carb',
      'gluten-free': 'Gluten-free',
      'paleo': 'Paleo',
      'pescatarian': 'Pescatarian'
    };
    
    const displayLabels = preferences.map(pref => labels[pref] || pref).filter(Boolean);
    if (displayLabels.length <= 2) {
      return displayLabels.join(', ');
    }
    return `${displayLabels.slice(0, 2).join(', ')} +${displayLabels.length - 2}`;
  };

  const getDisplayValue = () => {
    if (isWeightItem) return `${currentWeight} kg`;
    if (isTrainingVolumeItem) return formatTrainingVolumeDisplay(currentTrainingVolume);
    if (isSupplementsItem) return formatSupplementsDisplay(currentSupplements);
    if (isDietaryPreferenceItem) return formatDietaryPreferencesDisplay(currentDietaryPreferences);
    if (isSleepItem) return formatSleepHoursDisplay(currentSleepHours);
    return item.value;
  };

  const displayValue = getDisplayValue();
  
  return (
    <>
      <div 
        className={`rounded-xl p-4 transition-all duration-200 ${(isWeightItem || isGoalItem || isTrainingVolumeItem || isSupplementsItem || isDietaryPreferenceItem || isSleepItem) ? 'cursor-pointer' : ''}`}
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}
        onMouseEnter={(e) => {
          if (isWeightItem || isGoalItem || isTrainingVolumeItem || isSupplementsItem || isDietaryPreferenceItem || isSleepItem) {
            e.currentTarget.style.backgroundColor = 'var(--bg-main)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        }}
        onClick={() => {
          if (isWeightItem) {
            setShowWeightModal(true);
            onModalStateChange(true);
          } else if (isGoalItem) {
            setShowGoalsModal(true);
            onModalStateChange(true);
          } else if (isTrainingVolumeItem) {
            setShowTrainingVolumeModal(true);
            onModalStateChange(true);
          } else if (isSupplementsItem) {
            setShowSupplementsModal(true);
            onModalStateChange(true);
          } else if (isDietaryPreferenceItem) {
            setShowDietaryPreferencesModal(true);
            onModalStateChange(true);
          } else if (isSleepItem) {
            setShowSleepModal(true);
            onModalStateChange(true);
          }
        }}
      >
        <div className={`${item.iconColor} mb-2`}>
          <Icon size={20} />
        </div>
        <h3 className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{item.label}</h3>
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{displayValue}</p>
      </div>

      {isWeightItem && (
        <WeightHistoryModal
          isOpen={showWeightModal}
          onClose={() => {
            setShowWeightModal(false);
            onModalStateChange(false);
          }}
          currentWeight={currentWeight}
          onWeightUpdate={handleWeightUpdate}
        />
      )}

      {isGoalItem && (
        <GoalsRadarChart
          isOpen={showGoalsModal}
          onClose={() => {
            setShowGoalsModal(false);
            onModalStateChange(false);
          }}
        />
      )}

      {isTrainingVolumeItem && (
        <TrainingVolumeModal
          isOpen={showTrainingVolumeModal}
          onClose={() => {
            setShowTrainingVolumeModal(false);
            onModalStateChange(false);
          }}
          currentVolume={currentTrainingVolume}
          onVolumeUpdate={handleTrainingVolumeUpdate}
        />
      )}

      {isSupplementsItem && (
        <SupplementsModal
          isOpen={showSupplementsModal}
          onClose={() => {
            setShowSupplementsModal(false);
            onModalStateChange(false);
          }}
          supplements={currentSupplements}
          onSupplementsUpdate={handleSupplementsUpdate}
        />
      )}

      {isDietaryPreferenceItem && (
        <DietaryPreferencesModal
          isOpen={showDietaryPreferencesModal}
          onClose={() => {
            setShowDietaryPreferencesModal(false);
            onModalStateChange(false);
          }}
          currentPreferences={currentDietaryPreferences}
          onSave={handleDietaryPreferencesUpdate}
        />
      )}

      {isSleepItem && (
        <SleepHoursModal
          isOpen={showSleepModal}
          onClose={() => {
            setShowSleepModal(false);
            onModalStateChange(false);
          }}
          currentHours={currentSleepHours}
          onSave={handleSleepHoursUpdate}
        />
      )}
    </>
  );
}