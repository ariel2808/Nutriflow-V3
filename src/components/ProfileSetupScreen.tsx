import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BasicInformationScreen } from './profileSetup/screens/BasicInformationScreen';
import { AthleteTypeScreen } from './profileSetup/screens/AthleteTypeScreen';
import { TrainingVolumeScreen } from './profileSetup/screens/TrainingVolumeScreen';
import { TrainingScheduleScreen } from './profileSetup/screens/TrainingScheduleScreen';
import { FitnessGoalsScreen } from './profileSetup/screens/FitnessGoalsScreen';
import { NutritionPreferencesScreen } from './profileSetup/screens/NutritionPreferencesScreen';
import { SupplementsScreen } from './profileSetup/screens/SupplementsScreen';
import { SleepRecoveryScreen } from './profileSetup/screens/SleepRecoveryScreen';
import { 
  BasicInformationData, 
  NutritionPreferencesData, 
  SupplementsData, 
  SleepRecoveryData,
  TrainingScheduleData,
  FitnessGoalsData,
  ProfileSetupScreenProps
} from './profileSetup/ProfileSetupTypes';
import { 
  getProgressPercentage, 
  getStepIndicator,
  validateBasicInfo,
  validateAthleteTypes,
  validateTrainingVolume,
  validateTrainingSchedule,
  validateNutritionPreferences,
  getDistanceFromCenter
} from './profileSetup/ProfileSetupHelpers';
import { days, timeSlots } from './profileSetup/ProfileSetupConstants';
import { Supplement } from './profile/SupplementTypes';

export function ProfileSetupScreen({ step, onContinue, onSkip, onBack }: ProfileSetupScreenProps) {
  // Screen 1 state (Basic Information)
  const [basicInfo, setBasicInfo] = useState<BasicInformationData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    units: 'metric',
    height: '',
    weight: '',
    targetWeight: '',
    activityLevel: ''
  });

  // Screen 2 state (Athlete Types - multi-select)
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [showOtherSearch, setShowOtherSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSports, setCustomSports] = useState<string[]>([]);

  // Screen 3 state (Training Volume)
  const [selectedVolume, setSelectedVolume] = useState<string>('');

  // Screen 4 state (Training Schedule)
  const [trainingSchedule, setTrainingSchedule] = useState<TrainingScheduleData>(() => {
    const schedule: any = {};
    days.forEach(day => {
      schedule[day] = {
        enabled: false,
        expanded: false,
        slots: {}
      };
      timeSlots.forEach(slot => {
        schedule[day].slots[slot.id] = { enabled: false, duration: '' };
      });
    });
    return schedule;
  });

  // Screen 5 state (Fitness Goals)
  const [goals, setGoals] = useState<FitnessGoalsData>({
    performance: 70,
    recovery: 70,
    muscle: 70,
    weight: 70
  });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  // Screen 6 state (Nutrition Preferences) - Removed modal state
  const [nutritionPreferences, setNutritionPreferences] = useState<NutritionPreferencesData>({
    selectedPreferences: []
  });

  // Screen 7 state (Supplements) - Updated to use proper Supplement type
  const [supplements, setSupplements] = useState<SupplementsData>({
    selectedSupplements: []
  });

  // Screen 8 state (Sleep & Recovery)
  const [sleepRecovery, setSleepRecovery] = useState<SleepRecoveryData>({
    bedtime: '22:30',
    wakeTime: '06:30',
    differentWeekendSchedule: false,
    weekendBedtime: '23:00',
    weekendWakeTime: '08:00',
    sleepQuality: 5,
    fallAsleepTime: 'normal',
    caffeineCutoff: '14:00',
    screenTime: '30to60',
    sleepAids: 'none'
  });

  const canContinue = () => {
    if (step === 1) return validateBasicInfo(basicInfo);
    if (step === 2) return validateAthleteTypes(selectedAthletes, customSports);
    if (step === 3) return validateTrainingVolume(selectedVolume);
    if (step === 4) return validateTrainingSchedule(trainingSchedule);
    if (step === 5) return true; // Fitness goals always allows continue
    if (step === 6) return validateNutritionPreferences(nutritionPreferences);
    if (step === 7) return true; // Supplements is optional
    return true; // Step 8 always allows continue
  };

  const handleContinue = () => {
    if (canContinue()) {
      if (step < 8) {
        onContinue(step + 1);
      } else {
        onContinue(9); // Complete
      }
    }
  };

  // Basic Information handlers
  const handleBasicInfoChange = (field: keyof BasicInformationData, value: string) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitsToggle = (units: 'metric' | 'imperial') => {
    setBasicInfo(prev => ({
      ...prev,
      units
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasicInfo(prev => ({
      ...prev,
      dateOfBirth: e.target.value
    }));
  };

  // Athlete types handlers
  const handleAthleteToggle = (id: string) => {
    if (id === 'other') {
      setShowOtherSearch(!showOtherSearch);
    } else {
      setSelectedAthletes(prev => 
        prev.includes(id) 
          ? prev.filter(athlete => athlete !== id)
          : [...prev, id]
      );
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCustomSportAdd = (sport: string) => {
    if (sport && !customSports.includes(sport)) {
      setCustomSports(prev => [...prev, sport]);
      setSearchQuery('');
    }
  };

  const handleCustomSportRemove = (sport: string) => {
    setCustomSports(prev => prev.filter(s => s !== sport));
  };

  // Training volume handlers
  const handleVolumeSelect = (volumeId: string) => {
    setSelectedVolume(volumeId);
  };

  // Training schedule handlers
  const handleDayToggle = (day: string) => {
    setTrainingSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        expanded: !prev[day].enabled ? false : prev[day].expanded
      }
    }));
  };

  const handleDayExpand = (day: string) => {
    setTrainingSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        expanded: !prev[day].expanded
      }
    }));
  };

  const handleSlotToggle = (day: string, slotId: string) => {
    setTrainingSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: {
          ...prev[day].slots,
          [slotId]: {
            ...prev[day].slots[slotId],
            enabled: !prev[day].slots[slotId].enabled
          }
        }
      }
    }));
  };

  const handleDurationChange = (day: string, slotId: string, duration: string) => {
    setTrainingSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: {
          ...prev[day].slots,
          [slotId]: {
            ...prev[day].slots[slotId],
            duration
          }
        }
      }
    }));
  };

  // Fitness goals handlers
  const handleMouseDown = (goalKey: string, event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(goalKey);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const distance = getDistanceFromCenter(mouseX, mouseY, centerX, centerY);
    const percentage = Math.min(100, Math.max(0, (distance / radius) * 100));
    
    setGoals(prev => ({
      ...prev,
      [isDragging]: Math.round(percentage)
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    setDragStart(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Nutrition preferences handlers - Simplified (no modal)
  const handleNutritionPreferenceToggle = (preferenceId: string) => {
    setNutritionPreferences(prev => ({
      selectedPreferences: prev.selectedPreferences.includes(preferenceId)
        ? prev.selectedPreferences.filter(id => id !== preferenceId)
        : [...prev.selectedPreferences, preferenceId]
    }));
  };

  // Supplements handlers - Updated to use proper Supplement type with edit functionality
  const handleSupplementAdd = (supplement: Supplement) => {
    setSupplements(prev => ({
      selectedSupplements: [...prev.selectedSupplements, supplement]
    }));
  };

  const handleSupplementRemove = (supplementId: string) => {
    setSupplements(prev => ({
      selectedSupplements: prev.selectedSupplements.filter(s => s.id !== supplementId)
    }));
  };

  const handleSupplementEdit = (updatedSupplement: Supplement) => {
    setSupplements(prev => ({
      selectedSupplements: prev.selectedSupplements.map(s => 
        s.id === updatedSupplement.id ? updatedSupplement : s
      )
    }));
  };

  // Sleep & Recovery handlers
  const handleSleepRecoveryChange = (field: keyof SleepRecoveryData, value: any) => {
    setSleepRecovery(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Common props for all screens
  const commonProps = {
    onContinue: handleContinue,
    onSkip,
    onBack,
    stepIndicator: getStepIndicator(step),
    progressPercentage: getProgressPercentage(step),
    canContinue: canContinue()
  };

  const renderCurrentScreen = () => {
    switch (step) {
      case 1:
        return (
          <BasicInformationScreen
            {...commonProps}
            basicInfo={basicInfo}
            onBasicInfoChange={handleBasicInfoChange}
            onUnitsToggle={handleUnitsToggle}
            onDateChange={handleDateChange}
          />
        );
      case 2:
        return (
          <AthleteTypeScreen
            {...commonProps}
            selectedAthletes={selectedAthletes}
            showOtherSearch={showOtherSearch}
            searchQuery={searchQuery}
            customSports={customSports}
            onAthleteToggle={handleAthleteToggle}
            onSearchQueryChange={handleSearchQueryChange}
            onCustomSportAdd={handleCustomSportAdd}
            onCustomSportRemove={handleCustomSportRemove}
          />
        );
      case 3:
        return (
          <TrainingVolumeScreen
            {...commonProps}
            selectedVolume={selectedVolume}
            onVolumeSelect={handleVolumeSelect}
          />
        );
      case 4:
        return (
          <TrainingScheduleScreen
            {...commonProps}
            trainingSchedule={trainingSchedule}
            onDayToggle={handleDayToggle}
            onDayExpand={handleDayExpand}
            onSlotToggle={handleSlotToggle}
            onDurationChange={handleDurationChange}
          />
        );
      case 5:
        return (
          <FitnessGoalsScreen
            {...commonProps}
            goals={goals}
            isDragging={isDragging}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onGoalsChange={setGoals}
            chartRef={chartRef}
          />
        );
      case 6:
        return (
          <NutritionPreferencesScreen
            {...commonProps}
            nutritionPreferences={nutritionPreferences}
            onNutritionPreferenceToggle={handleNutritionPreferenceToggle}
          />
        );
      case 7:
        return (
          <SupplementsScreen
            {...commonProps}
            supplements={supplements}
            onSupplementAdd={handleSupplementAdd}
            onSupplementRemove={handleSupplementRemove}
            onSupplementEdit={handleSupplementEdit}
          />
        );
      case 8:
        return (
          <SleepRecoveryScreen
            {...commonProps}
            sleepRecovery={sleepRecovery}
            onSleepRecoveryChange={handleSleepRecoveryChange}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen overflow-hidden"
      >
        {renderCurrentScreen()}
      </motion.div>
    </AnimatePresence>
  );
}