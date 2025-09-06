// Basic Information Form Data
export interface BasicInformationData {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
  units: 'metric' | 'imperial';
  height: string;
  weight: string;
  targetWeight: string;
  activityLevel: string;
}

// Nutrition Preferences Data
export interface NutritionPreferencesData {
  selectedPreferences: string[];
}

// Supplements Data
export interface SupplementsData {
  selectedSupplements: Supplement[];
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  category: 'performance' | 'recovery' | 'general' | 'vitamins';
}

// Sleep & Recovery Data
export interface SleepRecoveryData {
  bedtime: string;
  wakeTime: string;
  differentWeekendSchedule: boolean;
  weekendBedtime: string;
  weekendWakeTime: string;
  sleepQuality: number;
  fallAsleepTime: 'instant' | 'quick' | 'normal' | 'difficult';
  caffeineCutoff: string;
  screenTime: 'less30' | '30to60' | '1to2' | 'more2';
  sleepAids: 'none' | 'melatonin' | 'prescription' | 'natural';
}

// Training Schedule Data
export interface TrainingScheduleData {
  [day: string]: {
    enabled: boolean;
    expanded: boolean;
    slots: { [slot: string]: { enabled: boolean; duration: string } };
  };
}

// Fitness Goals Data
export interface FitnessGoalsData {
  performance: number;
  recovery: number;
  muscle: number;
  weight: number;
}

// Props interface for ProfileSetupScreen
export interface ProfileSetupScreenProps {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  onContinue: (nextStep: number) => void;
  onSkip: () => void;
  onBack: () => void;
}

// Props interface for individual screen components
export interface ProfileSetupStepProps {
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  stepIndicator: string;
  progressPercentage: number;
  canContinue: boolean;
}