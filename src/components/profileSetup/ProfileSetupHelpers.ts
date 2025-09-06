import { FitnessGoalsData } from './ProfileSetupTypes';

// Progress calculation helpers
export const getProgressPercentage = (step: number) => {
  if (step === 1) return 12.5;
  if (step === 2) return 25;
  if (step === 3) return 37.5;
  if (step === 4) return 50;
  if (step === 5) return 62.5;
  if (step === 6) return 75;
  if (step === 7) return 87.5;
  return 100;
};

export const getStepIndicator = (step: number) => {
  return `${step} of 8`;
};

// Radar chart coordinates and calculations
export const getCoordinates = (angle: number, distance: number, centerX: number, centerY: number, radius: number) => {
  const x = centerX + Math.cos(angle - Math.PI / 2) * distance * radius / 100;
  const y = centerY + Math.sin(angle - Math.PI / 2) * distance * radius / 100;
  return { x, y };
};

export const getDistanceFromCenter = (x: number, y: number, centerX: number, centerY: number) => {
  return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
};

// Balance score calculation
export const calculateBalanceScore = (goals: FitnessGoalsData) => {
  const values = Object.values(goals);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const score = Math.max(0, 100 - (variance / 10));
  return Math.round(score);
};

// Contrast detection logic
export const detectContrasts = (goals: FitnessGoalsData) => {
  const contrasts = [];
  
  // Muscle gain vs Weight loss conflict
  if (goals.muscle > 70 && goals.weight > 70) {
    contrasts.push({
      type: 'conflict',
      message: 'High muscle gain and weight loss goals may conflict',
      goals: ['muscle', 'weight']
    });
  }
  
  // Performance vs Recovery balance
  if (goals.performance > 85 && goals.recovery < 50) {
    contrasts.push({
      type: 'warning',
      message: 'High performance with low recovery may lead to burnout',
      goals: ['performance', 'recovery']
    });
  }
  
  // Very high single focus warning
  const highGoals = Object.entries(goals).filter(([_, value]) => value > 90);
  if (highGoals.length === 1) {
    const goalName = highGoals[0][0];
    const goalLabels = {
      performance: 'Performance',
      recovery: 'Recovery', 
      muscle: 'Muscle Gain',
      weight: 'Weight Loss'
    };
    contrasts.push({
      type: 'info',
      message: `Very focused on ${goalLabels[goalName as keyof typeof goalLabels]} - consider balance`,
      goals: [goalName]
    });
  }
  
  return contrasts;
};

// Sleep hours calculation
export const calculateSleepHours = (bedtime: string, wakeTime: string) => {
  const bedtimeDate = new Date(`2000-01-01 ${bedtime}`);
  const wakeTimeDate = new Date(`2000-01-02 ${wakeTime}`);
  const diffMs = wakeTimeDate.getTime() - bedtimeDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10;
};

// Validation helpers
export const validateBasicInfo = (basicInfo: any) => {
  return basicInfo.fullName && basicInfo.dateOfBirth && basicInfo.gender && basicInfo.height && basicInfo.weight && basicInfo.activityLevel;
};

export const validateAthleteTypes = (selectedAthletes: string[], customSports: string[]) => {
  return selectedAthletes.length > 0 || customSports.length > 0;
};

export const validateTrainingVolume = (selectedVolume: string) => {
  return !!selectedVolume;
};

export const validateTrainingSchedule = (trainingSchedule: any) => {
  return Object.values(trainingSchedule).some((day: any) => day.enabled);
};

export const validateNutritionPreferences = (preferences: any) => {
  return preferences.selectedPreferences.length > 0;
};