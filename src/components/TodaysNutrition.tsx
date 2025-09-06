import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NutritionTooltip } from './nutrition/NutritionTooltip';
import { NutritionDetailModal } from './nutrition/NutritionDetailModal';
import { MacroSegment, TooltipData, TodaysNutritionProps } from './nutrition/TodaysNutritionTypes';
import { macroSegments, currentCalories, targetCalories, totalProgress } from './nutrition/TodaysNutritionData';

export function TodaysNutrition({ className = '', onModalStateChange }: TodaysNutritionProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSegmentClick = (segment: MacroSegment, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = rect.left + (rect.width / 2);
    
    if (tooltip?.segment.id === segment.id) {
      setTooltip(null);
    } else {
      setTooltip({ segment, position });
    }
  };

  const closeTooltip = () => {
    setTooltip(null);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    const clickedElement = event.target as HTMLElement;
    
    // Check if click is on a progress segment by looking for the data-segment attribute
    const isSegmentClick = clickedElement.closest('[data-segment]');
    
    // Only open modal if not clicking on a progress segment
    if (!isSegmentClick) {
      setIsDetailModalOpen(true);
      setTooltip(null); // Close any open tooltip
      onModalStateChange?.(true); // Notify parent of modal state
    }
  };

  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    onModalStateChange?.(false); // Notify parent of modal state
  };

  // Calculate cumulative positions for segments
  let cumulativePosition = 0;
  const segmentPositions = macroSegments.map(segment => {
    const start = cumulativePosition;
    cumulativePosition += segment.percentage;
    return { ...segment, start, width: segment.percentage };
  });

  return (
    <>
      <motion.div
        className={`relative cursor-pointer ${className}`}
        style={{
          width: '100%',
          maxWidth: '343px',
          height: 'auto',
          minHeight: '180px',
          margin: '0 auto',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 200ms ease-out'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={handleCardClick}
        whileHover={{
          scale: 1.02,
          boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
        }}
        whileTap={{
          scale: 0.98
        }}
      >
        {/* Header Section */}
        <div className="mb-4" style={{ height: '40px' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: '1.3',
                  color: 'var(--text-primary)',
                  margin: '0 0 4px 0'
                }}
              >
                Today's Nutrition
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '1.2',
                  color: 'var(--text-secondary)',
                  margin: '0'
                }}
              >
                Calorie breakdown by macronutrients
              </p>
            </div>
            {/* Subtle indicator for clickability */}
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                opacity: 0.6,
                transition: 'opacity 200ms ease-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
              }}
            >
              Tap for details
            </div>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="mb-4" style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
          <div
            className="relative"
            style={{
              width: '295px',
              height: '20px',
              backgroundColor: 'var(--bg-main)',
              borderRadius: '12px',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              margin: '0 auto',
              border: '1px solid var(--border)'
            }}
          >
            {/* Progress Segments */}
            {segmentPositions.map((segment) => (
              <motion.div
                key={segment.id}
                className="absolute top-0 h-full cursor-pointer"
                data-segment={segment.id}
                style={{
                  left: `${segment.start}%`,
                  width: `${segment.width}%`,
                  background: `linear-gradient(to right, ${segment.gradient[0]}, ${segment.gradient[1]}, ${segment.gradient[2]})`,
                  borderRadius: segment.start === 0 ? '12px 0 0 12px' : 
                             segment.start + segment.width >= totalProgress ? '0 12px 12px 0' : '0',
                  boxShadow: `
                    0 2px 8px rgba(0,0,0,0.15),
                    0 0 20px ${segment.glowColor},
                    inset 0 1px 2px rgba(255,255,255,0.3)
                  `,
                  zIndex: hoveredSegment === segment.id ? 3 : 2,
                  transform: hoveredSegment === segment.id ? 'translateY(-1px)' : 'translateY(0)',
                  filter: hoveredSegment === segment.id ? 'brightness(1.1)' : 'brightness(1)',
                  transition: 'all 0.3s ease'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${segment.width}%` }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => handleSegmentClick(segment, e)}
                onMouseEnter={() => setHoveredSegment(segment.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                whileHover={{
                  boxShadow: `0 2px 8px rgba(0,0,0,0.15), 0 0 25px ${segment.glowColor}, inset 0 1px 2px rgba(255,255,255,0.3)`
                }}
              >
                {/* Enhanced glow effect on hover */}
                {hoveredSegment === segment.id && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      borderRadius: 'inherit',
                      background: `linear-gradient(to right, ${segment.gradient[0]}, ${segment.gradient[1]}, ${segment.gradient[2]})`,
                      opacity: 0.6,
                      boxShadow: `0 0 30px ${segment.glowColor}`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Calories Display */}
        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                lineHeight: '1.2'
              }}
            >
              {currentCalories}
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '400',
                color: 'var(--text-secondary)',
                lineHeight: '1.2',
                marginLeft: '4px'
              }}
            >
              / {targetCalories} cal
            </span>
          </div>
        </div>

        {/* Summary Stats Footer */}
        <motion.div
          className="flex items-center justify-between"
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        >
          <div className="text-center flex-1">
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.2'
              }}
            >
              {Math.round(totalProgress)}%
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.2'
              }}
            >
              Daily Goal
            </div>
          </div>
          
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'var(--border)'
            }}
          />
          
          <div className="text-center flex-1">
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.2'
              }}
            >
              {targetCalories - currentCalories}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.2'
              }}
            >
              Remaining
            </div>
          </div>
          
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'var(--border)'
            }}
          />
          
          <div className="text-center flex-1">
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#10B981',
                lineHeight: '1.2'
              }}
            >
              +42
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.2'
              }}
            >
              vs Yesterday
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Tooltip */}
      <NutritionTooltip tooltip={tooltip} onClose={closeTooltip} />
      
      {/* Detailed Nutrition Modal */}
      <NutritionDetailModal 
        isOpen={isDetailModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}