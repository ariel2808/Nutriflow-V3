export interface MacroSegment {
  id: 'protein' | 'carbs' | 'fat';
  name: string;
  amount: number;
  unit: string;
  calories: number;
  percentage: number;
  color: string;
  gradient: string[];
  glowColor: string;
}

export interface TooltipData {
  segment: MacroSegment;
  position: number;
}

export interface TodaysNutritionProps {
  className?: string;
  onModalStateChange?: (isOpen: boolean) => void;
}