import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { TooltipData } from './TodaysNutritionTypes';

interface NutritionTooltipProps {
  tooltip: TooltipData | null;
  onClose: () => void;
}

export function NutritionTooltip({ tooltip, onClose }: NutritionTooltipProps) {
  return (
    <AnimatePresence>
      {tooltip && (
        <motion.div
          className="fixed z-50"
          style={{
            left: `${tooltip.position}px`,
            top: '100px', // Positioned 180px above the progress bar (280px - 180px)
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
            zIndex: 999
          }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            style={{
              width: '160px',
              minHeight: '80px',
              backgroundColor: 'var(--tooltip-bg)',
              border: `2px solid ${tooltip.segment.color}`,
              borderRadius: '12px',
              padding: '12px',
              boxShadow: `0 8px 25px rgba(0,0,0,0.15), 0 0 20px ${tooltip.segment.glowColor}`,
              position: 'relative',
              zIndex: 999
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: tooltip.segment.color,
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <X size={10} />
            </button>

            {/* Content */}
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tooltip.segment.color }}
                />
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: tooltip.segment.color
                  }}
                >
                  {tooltip.segment.name}
                </span>
              </div>

              {/* Data rows */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Amount:</span>
                  <span style={{ fontSize: '12px', color: 'var(--tooltip-text)', fontWeight: '500' }}>
                    {tooltip.segment.amount}{tooltip.segment.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Calories:</span>
                  <span style={{ fontSize: '12px', color: 'var(--tooltip-text)', fontWeight: '500' }}>
                    {tooltip.segment.calories} cal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>% of Total:</span>
                  <span style={{ fontSize: '12px', color: tooltip.segment.color, fontWeight: '500' }}>
                    {tooltip.segment.percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Arrow pointer */}
            <div
              className="absolute"
              style={{
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${tooltip.segment.color}`,
                zIndex: 1000
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}