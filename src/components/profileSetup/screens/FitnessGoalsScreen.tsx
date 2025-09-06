import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { ProfileSetupStepProps, FitnessGoalsData } from '../ProfileSetupTypes';
import { goalPresets } from '../ProfileSetupConstants';
import { calculateBalanceScore, detectContrasts, getCoordinates } from '../ProfileSetupHelpers';

interface FitnessGoalsScreenProps extends ProfileSetupStepProps {
  goals: FitnessGoalsData;
  isDragging: string | null;
  onMouseDown: (goalKey: string, event: React.MouseEvent) => void;
  onMouseMove: (event: React.MouseEvent) => void;
  onGoalsChange: (goals: FitnessGoalsData) => void;
  chartRef: React.RefObject<SVGSVGElement>;
}

export function FitnessGoalsScreen({
  goals,
  isDragging,
  onMouseDown,
  onMouseMove,
  onGoalsChange,
  chartRef,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: FitnessGoalsScreenProps) {
  const balanceScore = calculateBalanceScore(goals);
  const contrasts = detectContrasts(goals);

  const applyPreset = (preset: typeof goalPresets[0]) => {
    onGoalsChange({
      performance: preset.performance,
      recovery: preset.recovery,
      muscle: preset.muscle,
      weight: preset.weight
    });
  };

  const resetGoals = () => {
    onGoalsChange({ performance: 70, recovery: 70, muscle: 70, weight: 70 });
  };

  const autoBalance = () => {
    onGoalsChange({ performance: 70, recovery: 70, muscle: 70, weight: 70 });
  };

  const renderRadarChart = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const goalKeys = ['performance', 'recovery', 'muscle', 'weight'] as const;
    const goalLabels = ['Performance', 'Recovery', 'Muscle Gain', 'Weight Loss'];
    
    const points = goalKeys.map((key, index) => {
      const angle = (index * Math.PI * 2) / 4;
      return getCoordinates(angle, goals[key], centerX, centerY, radius);
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="relative">
        <svg 
          ref={chartRef}
          width="300" 
          height="300" 
          className="drop-shadow-sm cursor-crosshair"
          onMouseMove={onMouseMove}
        >
          {/* Grid lines */}
          {[20, 40, 60, 80, 100].map(percent => {
            const gridPoints = goalKeys.map((_, index) => {
              const angle = (index * Math.PI * 2) / 4;
              return getCoordinates(angle, percent, centerX, centerY, radius);
            });
            const gridPath = gridPoints.map((point, index) => 
              `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
            ).join(' ') + ' Z';
            
            return (
              <path
                key={percent}
                d={gridPath}
                fill="none"
                stroke="#E0E0E0"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          {/* Axis lines */}
          {goalKeys.map((_, index) => {
            const angle = (index * Math.PI * 2) / 4;
            const end = getCoordinates(angle, 100, centerX, centerY, radius);
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={end.x}
                y2={end.y}
                stroke="#E0E0E0"
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}

          {/* Contrast warning lines */}
          {contrasts.map((contrast, index) => {
            if (contrast.type === 'conflict' && contrast.goals.length === 2) {
              const goal1Index = goalKeys.indexOf(contrast.goals[0] as any);
              const goal2Index = goalKeys.indexOf(contrast.goals[1] as any);
              
              if (goal1Index !== -1 && goal2Index !== -1) {
                const point1 = points[goal1Index];
                const point2 = points[goal2Index];
                
                return (
                  <line
                    key={`contrast-${index}`}
                    x1={point1.x}
                    y1={point1.y}
                    x2={point2.x}
                    y2={point2.y}
                    stroke="#FF6B35"
                    strokeWidth="2"
                    strokeDasharray="6,3"
                    opacity="0.7"
                  />
                );
              }
            }
            return null;
          })}

          {/* Data shape */}
          <path
            d={pathData}
            fill="#FF6B35"
            fillOpacity="0.2"
            stroke="#FF6B35"
            strokeWidth="2"
          />

          {/* Drag points with contrast highlighting */}
          {points.map((point, index) => {
            const goalKey = goalKeys[index];
            const hasContrast = contrasts.some(c => c.goals.includes(goalKey));
            
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="8"
                fill={hasContrast ? "#EF4444" : "#FF6B35"}
                stroke="#FFFFFF"
                strokeWidth="3"
                className="cursor-grab active:cursor-grabbing"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  cursor: isDragging === goalKeys[index] ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => onMouseDown(goalKeys[index], e)}
              />
            );
          })}

          {/* Center point */}
          <circle
            cx={centerX}
            cy={centerY}
            r="4"
            fill="#4CAF50"
          />
        </svg>

        {/* Labels with proper positioning */}
        <div className="absolute inset-0 pointer-events-none">
          {goalLabels.map((label, index) => {
            const angle = (index * Math.PI * 2) / 4;
            const labelPos = getCoordinates(angle, 115, 150, 150, radius);
            const goalKey = goalKeys[index];
            const hasContrast = contrasts.some(c => c.goals.includes(goalKey));
            
            return (
              <div
                key={label}
                className="absolute text-sm font-medium"
                style={{
                  left: `${labelPos.x - 40}px`,
                  top: `${Math.max(5, labelPos.y - 12)}px`,
                  width: '80px',
                  textAlign: 'center',
                  color: hasContrast ? '#EF4444' : '#1D1D1F'
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  {hasContrast && <AlertTriangle size={12} color="#EF4444" />}
                  <span>{label}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {goals[goalKeys[index] as keyof typeof goals]}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          Your Fitness Goals
        </h1>
        <p style={{ fontSize: '16px', color: '#86868B', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          Drag the orange dots to adjust your priorities
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-5 overflow-y-auto scrollbar-visible">
        {/* Radar Chart with increased bottom margin */}
        <div className="flex justify-center mb-12">
          {renderRadarChart()}
        </div>

        {/* Contrast Warnings */}
        {contrasts.length > 0 && (
          <div className="mb-4 space-y-2">
            {contrasts.map((contrast, index) => {
              const bgColor = contrast.type === 'conflict' ? '#FEF2F2' : 
                             contrast.type === 'warning' ? '#FFF7ED' : '#F0F9FF';
              const textColor = contrast.type === 'conflict' ? '#DC2626' : 
                               contrast.type === 'warning' ? '#EA580C' : '#0369A1';
              
              return (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: bgColor }}
                >
                  <AlertTriangle size={16} color={textColor} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm" style={{ color: textColor }}>
                    {contrast.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Balance Score with increased top margin */}
        <div className="text-center mb-6 mt-8">
          <p style={{ 
            fontSize: '18px', 
            color: balanceScore >= 80 ? '#4CAF50' : balanceScore >= 60 ? '#FF6B35' : '#EF4444',
            fontWeight: '600'
          }}>
            Balance Score: {balanceScore}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {balanceScore >= 80 ? 'Well balanced goals' : 
             balanceScore >= 60 ? 'Moderately focused' : 'Highly focused approach'}
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={resetGoals}
            className="px-4 py-2 rounded-lg border text-sm transition-colors"
            style={{
              borderColor: '#E5E5E7',
              color: '#86868B',
              backgroundColor: '#FFFFFF'
            }}
          >
            ↻ Reset
          </button>
          <button
            onClick={autoBalance}
            className="px-4 py-2 rounded-lg border text-sm transition-colors"
            style={{
              borderColor: '#E5E5E7',
              color: '#86868B',
              backgroundColor: '#FFFFFF'
            }}
          >
            ⚖️ Balance
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {goalPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="py-3 px-3 rounded-lg border text-sm transition-colors"
              style={{
                borderColor: '#E5E5E7',
                color: '#1D1D1F',
                backgroundColor: '#FFFFFF'
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="flex-shrink-0 p-5 pt-0">
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-full text-center transition-all duration-200 mb-3"
          style={{
            backgroundColor: '#007AFF',
            color: '#FFFFFF',
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