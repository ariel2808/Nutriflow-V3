import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit2, ChevronDown, Check } from 'lucide-react';

interface AthleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

type ViewMode = 'view' | 'edit';

// Available sports data - using the same list from profile building
const AVAILABLE_SPORTS = [
  { id: 'strength', emoji: '🏋️', label: 'Strength', title: 'Strength Athlete' },
  { id: 'runner', emoji: '🏃', label: 'Running', title: 'Runner' },
  { id: 'cyclist', emoji: '🚴', label: 'Cycling', title: 'Cyclist' },
  { id: 'swimmer', emoji: '🏊', label: 'Swimming', title: 'Swimmer' },
  { id: 'triathlete', emoji: '🔗', label: 'Triathlete', title: 'Triathlete' }, // Special icon for triathlete
  { id: 'combat', emoji: '🥊', label: 'Combat', title: 'Combat Athlete' },
  { id: 'team', emoji: '⚽', label: 'Team Sport', title: 'Team Sport Athlete' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga', title: 'Yoga Practitioner' },
  { id: 'crossfit', emoji: '🏃‍♂️', label: 'CrossFit', title: 'CrossFitter' },
  { id: 'racquet', emoji: '🎾', label: 'Racquet', title: 'Racquet Sport Player' },
  { id: 'adventure', emoji: '🏂', label: 'Adventure', title: 'Adventure Athlete' }
];

// Goal types
const GOAL_TYPES = [
  { id: 'competition', label: 'Competition', description: 'Specific event or race' },
  { id: 'general', label: 'General Goal', description: 'Fitness or performance target' },
  { id: 'weight', label: 'Weight Goal', description: 'Body composition target' },
  { id: 'health', label: 'Health Goal', description: 'Wellness objective' },
  { id: 'skill', label: 'Skill Goal', description: 'Technique improvement' }
];

// Mock data for the athlete profile
const initialAthleteData = {
  selectedSportIds: ['runner', 'cyclist'],
  customSport: '',
  currentGoal: {
    type: 'competition',
    title: 'Boston Marathon',
    targetDate: '2025-05-15'
  },
  consistency: 'flexible'
};

// Utility functions
const generateAthleteTitle = (sportIds: string[], customSport: string) => {
  const sports = sportIds.map(id => AVAILABLE_SPORTS.find(s => s.id === id)).filter(Boolean);
  const titles = sports.map(s => s!.title);
  
  if (customSport && sportIds.includes('other')) {
    titles.push(`${customSport} Athlete`);
  }
  
  if (titles.length === 0) return 'Athlete';
  if (titles.length === 1) return titles[0];
  if (titles.length === 2) return `${titles[0]} & ${titles[1].split(' ')[0]}`;
  return 'Multi-sport Athlete';
};

const generateAthleteSubtitle = (sportIds: string[], customSport: string) => {
  if (sportIds.length > 2 || (sportIds.length > 1 && sportIds.includes('other'))) {
    return 'Multi-sport athlete';
  }
  return 'Dedicated athlete';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

// Icons
const TargetIcon = () => <div className="w-6 h-6" style={{ fontSize: '24px' }}>🎯</div>;
const ChartIcon = () => <div className="w-6 h-6" style={{ fontSize: '24px' }}>📊</div>;

export function AthleteProfileModal({ isOpen, onClose, onEdit }: AthleteProfileModalProps) {
  const [mode, setMode] = useState<ViewMode>('view');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showSportModal, setShowSportModal] = useState(false);
  const [athleteData, setAthleteData] = useState(initialAthleteData);
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingConsistency, setEditingConsistency] = useState(false);

  if (!isOpen) return null;

  const selectedSports = athleteData.selectedSportIds
    .map(id => AVAILABLE_SPORTS.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, 4); // Show up to 4 sports in header

  const toggleCard = (cardId: string) => {
    if (mode === 'edit') {
      if (cardId === 'goal') setEditingGoal(!editingGoal);
      if (cardId === 'consistency') setEditingConsistency(!editingConsistency);
    } else {
      setExpandedCard(expandedCard === cardId ? null : cardId);
    }
  };

  const handleModeSwitch = (newMode: ViewMode) => {
    setMode(newMode);
    setExpandedCard(null);
    setEditingGoal(false);
    setEditingConsistency(false);
    if (newMode === 'edit') {
      // Pre-expand cards in edit mode
      setTimeout(() => {
        setEditingGoal(true);
        setEditingConsistency(true);
      }, 100);
    }
  };

  const handleSportToggle = (sportId: string) => {
    setAthleteData(prev => ({
      ...prev,
      selectedSportIds: prev.selectedSportIds.includes(sportId)
        ? prev.selectedSportIds.filter(id => id !== sportId)
        : [...prev.selectedSportIds, sportId]
    }));
  };

  const handleSave = () => {
    // Here you would typically save to your data store
    console.log('Saving athlete data:', athleteData);
    setMode('view');
    setExpandedCard(null);
    setEditingGoal(false);
    setEditingConsistency(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setAthleteData(initialAthleteData);
    setMode('view');
    setExpandedCard(null);
    setEditingGoal(false);
    setEditingConsistency(false);
  };

  return (
    <AnimatePresence key="athlete-profile-modal">
      {/* Main Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${mode === 'edit' ? 'p-4' : 'p-4'}`}>
        {/* Background Overlay */}
        <motion.div
          key="modal-backdrop"
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          key="modal-container"
          className="relative flex flex-col"
          style={{
            backgroundColor: 'var(--bg-main)',
            boxShadow: '0px 10px 40px rgba(0,0,0,0.15)',
            width: mode === 'edit' ? 'calc(100vw - 32px)' : '320px',
            height: mode === 'edit' ? 'calc(100vh - 64px)' : '500px',
            maxWidth: mode === 'edit' ? '800px' : '320px',
            maxHeight: mode === 'edit' ? '90vh' : '500px',
            borderRadius: mode === 'edit' ? '20px' : '24px',
            overflow: 'hidden'
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            width: mode === 'edit' ? 'calc(100vw - 32px)' : '320px',
            height: mode === 'edit' ? 'calc(100vh - 64px)' : '500px',
            maxWidth: mode === 'edit' ? '800px' : '320px',
            maxHeight: mode === 'edit' ? '90vh' : '500px',
            borderRadius: mode === 'edit' ? '20px' : '24px'
          }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4
          }}
          layout
        >
          {/* Header Section */}
          <div 
            className={`${mode === 'edit' ? 'px-6 py-5' : 'px-4 py-4'} flex-shrink-0`}
            style={{ 
              backgroundColor: 'var(--bg-main)',
              borderBottom: '1px solid #F3F4F6'
            }}
          >
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-4">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#6B7280'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={18} />
              </button>

              {/* Title */}
              <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Athlete Profile
              </h1>

              {/* Single Animated Action Button */}
              <motion.button
                onClick={mode === 'view' ? () => handleModeSwitch('edit') : handleSave}
                className="p-2 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#3B82F6'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {mode === 'view' ? (
                    <motion.div
                      key="edit"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Edit2 size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Sport Emojis and Labels */}
            <div className={`flex justify-center items-center mb-4 relative ${
              selectedSports.length <= 2 ? 'gap-6' : selectedSports.length === 3 ? 'gap-4' : 'gap-3'
            }`}>
              {selectedSports.map((sport, index) => (
                <div key={sport!.id} className="flex flex-col items-center">
                  <div style={{ 
                    fontSize: selectedSports.length <= 2 ? '48px' : selectedSports.length === 3 ? '40px' : '36px', 
                    marginBottom: '6px' 
                  }}>
                    {sport!.emoji}
                  </div>
                  <span style={{
                    fontSize: selectedSports.length <= 2 ? '14px' : '12px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    fontFamily: 'system-ui, sans-serif',
                    textAlign: 'center'
                  }}>
                    {sport!.label}
                  </span>
                </div>
              ))}
              {mode === 'edit' && (
                <button
                  onClick={() => setShowSportModal(true)}
                  className="absolute -top-2 -right-2 p-1 rounded-full"
                  style={{ 
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    fontSize: '12px'
                  }}
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>

            {/* Title and Subtitle */}
            <div className="text-center">
              {mode === 'edit' ? (
                <button
                  onClick={() => setShowSportModal(true)}
                  className="group text-center"
                >
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    {generateAthleteTitle(athleteData.selectedSportIds, athleteData.customSport)}
                  </h2>
                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    Tap to edit
                  </p>
                </button>
              ) : (
                <>
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    {generateAthleteTitle(athleteData.selectedSportIds, athleteData.customSport)}
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    {generateAthleteSubtitle(athleteData.selectedSportIds, athleteData.customSport)}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div 
            className={`${mode === 'edit' ? 'px-6 py-6' : 'px-4 py-4'} ${mode === 'view' ? 'space-y-4' : ''} overflow-y-auto flex-1 scrollbar-visible`} 
            style={{ 
              minHeight: 0,
              width: '100%',
              maxHeight: '100%',
              overflowY: 'auto',
              ...(mode === 'edit' && {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                alignItems: 'start',
                maxWidth: '100%',
                gridAutoRows: 'min-content'
              })
            }}
          >
            {/* Current Goal Card */}
            <motion.div
              key="goal-card"
              className={`rounded-2xl ${mode === 'view' ? 'cursor-pointer' : ''}`}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid #F3F4F6',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                width: '100%',
                minWidth: '0',
                maxWidth: '100%',
                overflow: mode === 'view' ? 'hidden' : 'visible'
              }}
              onClick={() => mode === 'view' && toggleCard('goal')}
              whileTap={mode === 'view' ? { scale: 0.98 } : {}}
              layout
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TargetIcon />
                    <div className="flex-1">
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#6B7280',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                        fontFamily: 'system-ui, sans-serif'
                      }}>
                        Current Goal
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        fontFamily: 'system-ui, sans-serif'
                      }}>
                        {athleteData.currentGoal.title}
                      </div>
                      {mode === 'view' && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'system-ui, sans-serif'
                        }}>
                          {formatDate(athleteData.currentGoal.targetDate)}
                        </div>
                      )}
                      {mode === 'edit' && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'system-ui, sans-serif'
                        }}>
                          Tap to edit
                        </div>
                      )}
                    </div>
                  </div>
                  {mode === 'view' && (
                    <motion.div
                      key="goal-chevron"
                      animate={{ rotate: expandedCard === 'goal' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} style={{ color: '#6B7280' }} />
                    </motion.div>
                  )}
                </div>

                {/* View Mode Expansion */}
                <AnimatePresence key="goal-view-expansion">
                  {mode === 'view' && expandedCard === 'goal' && (
                    <motion.div
                      key="goal-view-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div 
                        className="mt-4 pt-4 space-y-2"
                        style={{ borderTop: '1px solid #F3F4F6' }}
                      >
                        <div className="flex justify-between">
                          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>Type</span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
                            {GOAL_TYPES.find(type => type.id === athleteData.currentGoal.type)?.label || 'Competition'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>Goal</span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
                            {athleteData.currentGoal.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>Target Date</span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
                            {formatDate(athleteData.currentGoal.targetDate)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Edit Mode Panel */}
                <AnimatePresence key="goal-edit-expansion">
                  {mode === 'edit' && editingGoal && (
                    <motion.div
                      key="goal-edit-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div 
                        className="mt-4 pt-4 space-y-4"
                        style={{ borderTop: '1px solid #F3F4F6' }}
                      >
                        {/* Goal Type Selection */}
                        <div style={{ minWidth: '0' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                            Goal Type
                          </label>
                          <select
                            value={athleteData.currentGoal.type}
                            onChange={(e) => setAthleteData(prev => ({
                              ...prev,
                              currentGoal: { ...prev.currentGoal, type: e.target.value }
                            }))}
                            style={{
                              width: '100%',
                              minWidth: '0',
                              maxWidth: '100%',
                              padding: '14px',
                              marginTop: '6px',
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '10px',
                              fontSize: '15px',
                              boxSizing: 'border-box',
                              outline: 'none'
                            }}
                          >
                            {GOAL_TYPES.map((goalType) => (
                              <option key={goalType.id} value={goalType.id}>
                                {goalType.label} - {goalType.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Goal Name Input */}
                        <div style={{ minWidth: '0' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                            Goal Name
                          </label>
                          <input
                            type="text"
                            value={athleteData.currentGoal.title}
                            onChange={(e) => setAthleteData(prev => ({
                              ...prev,
                              currentGoal: { ...prev.currentGoal, title: e.target.value }
                            }))}
                            placeholder={
                              athleteData.currentGoal.type === 'competition' ? 'e.g. Boston Marathon' :
                              athleteData.currentGoal.type === 'weight' ? 'e.g. Lose 10 lbs' :
                              athleteData.currentGoal.type === 'skill' ? 'e.g. Improve technique' :
                              athleteData.currentGoal.type === 'health' ? 'e.g. Lower resting heart rate' :
                              'e.g. Run a 5K'
                            }
                            style={{
                              width: '100%',
                              minWidth: '0',
                              maxWidth: '100%',
                              padding: '14px',
                              marginTop: '6px',
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '10px',
                              fontSize: '15px',
                              boxSizing: 'border-box',
                              outline: 'none'
                            }}
                          />
                        </div>

                        {/* Target Date */}
                        <div style={{ minWidth: '0' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                            Target Date
                          </label>
                          <input
                            type="date"
                            value={athleteData.currentGoal.targetDate}
                            onChange={(e) => setAthleteData(prev => ({
                              ...prev,
                              currentGoal: { ...prev.currentGoal, targetDate: e.target.value }
                            }))}
                            style={{
                              width: '100%',
                              minWidth: '0',
                              maxWidth: '100%',
                              padding: '14px',
                              marginTop: '6px',
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '10px',
                              fontSize: '15px',
                              boxSizing: 'border-box',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Consistency Card */}
            <motion.div
              key="consistency-card"
              className={`rounded-2xl ${mode === 'view' ? 'cursor-pointer' : ''}`}
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid #F3F4F6',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                width: '100%',
                minWidth: '0',
                maxWidth: '100%',
                overflow: mode === 'view' ? 'hidden' : 'visible'
              }}
              onClick={() => mode === 'view' && toggleCard('consistency')}
              whileTap={mode === 'view' ? { scale: 0.98 } : {}}
              layout
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ChartIcon />
                    <div className="flex-1">
                      <div style={{
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#6B7280',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                        fontFamily: 'system-ui, sans-serif'
                      }}>
                        Consistency
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        fontFamily: 'system-ui, sans-serif'
                      }}>
                        Flexible Schedule
                      </div>
                      {mode === 'edit' && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6B7280',
                          fontFamily: 'system-ui, sans-serif'
                        }}>
                          Tap to edit
                        </div>
                      )}
                    </div>
                  </div>
                  {mode === 'view' && (
                    <motion.div
                      key="consistency-chevron"
                      animate={{ rotate: expandedCard === 'consistency' ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} style={{ color: '#6B7280' }} />
                    </motion.div>
                  )}
                </div>

                {/* View Mode Expansion */}
                <AnimatePresence key="consistency-view-expansion">
                  {mode === 'view' && expandedCard === 'consistency' && (
                    <motion.div
                      key="consistency-view-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div 
                        className="mt-4 pt-4 space-y-2"
                        style={{ borderTop: '1px solid #F3F4F6' }}
                      >
                        <div className="flex justify-between">
                          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>Approach</span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
                            Flexible Training
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>Priority</span>
                          <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
                            Adaptable Schedule
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Edit Mode Panel */}
                <AnimatePresence key="consistency-edit-expansion">
                  {mode === 'edit' && editingConsistency && (
                    <motion.div
                      key="consistency-edit-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div 
                        className="mt-4 pt-4 space-y-4"
                        style={{ borderTop: '1px solid #F3F4F6' }}
                      >
                        <div style={{ minWidth: '0' }}>
                          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                            Training Approach
                          </label>
                          <select
                            value={athleteData.consistency}
                            onChange={(e) => setAthleteData(prev => ({
                              ...prev,
                              consistency: e.target.value
                            }))}
                            style={{
                              width: '100%',
                              minWidth: '0',
                              maxWidth: '100%',
                              padding: '14px',
                              marginTop: '6px',
                              backgroundColor: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              borderRadius: '10px',
                              fontSize: '15px',
                              boxSizing: 'border-box',
                              outline: 'none'
                            }}
                          >
                            <option value="flexible">Flexible Schedule - Adapt to life changes</option>
                            <option value="consistent">Consistent Schedule - Regular training times</option>
                            <option value="strict">Strict Schedule - Fixed training routine</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Sport Selection Modal - Expanded for Better UX */}
          <AnimatePresence>
            {showSportModal && (
              <motion.div
                key="sport-modal"
                className="absolute inset-0 flex items-center justify-center p-4"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: mode === 'edit' ? '20px' : '24px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-full"
                  style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '20px',
                    width: 'calc(100% - 32px)',
                    height: 'calc(100% - 80px)',
                    maxWidth: '600px',
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6 border-b flex-shrink-0" style={{ borderColor: '#F3F4F6' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                          Select Your Sports
                        </h3>
                        <p style={{ fontSize: '14px', color: '#6B7280' }}>
                          Choose all sports you participate in regularly
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSportModal(false)}
                        className="p-2 rounded-full transition-all duration-200"
                        style={{ 
                          color: '#6B7280',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F3F4F6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto scrollbar-visible">
                    <div className="p-6">
                      {/* Sports Grid */}
                      <div 
                        className="grid gap-3 mb-6"
                        style={{
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
                        }}
                      >
                        {AVAILABLE_SPORTS.map((sport) => (
                          <button
                            key={sport.id}
                            onClick={() => handleSportToggle(sport.id)}
                            className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                            style={{
                              backgroundColor: athleteData.selectedSportIds.includes(sport.id) ? '#F0F8FF' : 'var(--bg-card)',
                              border: athleteData.selectedSportIds.includes(sport.id) ? '2px solid #007AFF' : '2px solid transparent',
                              boxShadow: athleteData.selectedSportIds.includes(sport.id) ? '0 2px 8px rgba(0, 122, 255, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                              transform: 'translateY(0)',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                              if (!athleteData.selectedSportIds.includes(sport.id)) {
                                e.currentTarget.style.backgroundColor = '#F8F9FA';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!athleteData.selectedSportIds.includes(sport.id)) {
                                e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                              }
                            }}
                          >
                            <div style={{ fontSize: '28px', flexShrink: 0 }}>{sport.emoji}</div>
                            <div className="flex-1">
                              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                {sport.label}
                              </div>
                              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                                {sport.title}
                              </div>
                            </div>
                            {athleteData.selectedSportIds.includes(sport.id) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check size={20} style={{ color: '#007AFF', flexShrink: 0 }} />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Other/Custom Sport Option */}
                      <div className="border-t pt-6" style={{ borderColor: '#F3F4F6' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                          Custom Sport
                        </h4>
                        <button
                          onClick={() => handleSportToggle('other')}
                          className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 mb-3"
                          style={{
                            backgroundColor: athleteData.selectedSportIds.includes('other') ? '#F0F8FF' : 'var(--bg-card)',
                            border: athleteData.selectedSportIds.includes('other') ? '2px solid #007AFF' : '2px solid transparent',
                            boxShadow: athleteData.selectedSportIds.includes('other') ? '0 2px 8px rgba(0, 122, 255, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            if (!athleteData.selectedSportIds.includes('other')) {
                              e.currentTarget.style.backgroundColor = '#F8F9FA';
                              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!athleteData.selectedSportIds.includes('other')) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                            }
                          }}
                        >
                          <div style={{ fontSize: '28px', flexShrink: 0 }}>➕</div>
                          <div className="flex-1">
                            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                              Other Sport
                            </div>
                            <div style={{ fontSize: '13px', color: '#6B7280' }}>
                              Add a custom sport not listed above
                            </div>
                          </div>
                          {athleteData.selectedSportIds.includes('other') && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Check size={20} style={{ color: '#007AFF', flexShrink: 0 }} />
                            </motion.div>
                          )}
                        </button>
                        
                        {athleteData.selectedSportIds.includes('other') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <input
                              type="text"
                              value={athleteData.customSport}
                              onChange={(e) => setAthleteData(prev => ({ ...prev, customSport: e.target.value }))}
                              placeholder="e.g. Tennis, Rock Climbing, Martial Arts"
                              style={{
                                width: '100%',
                                minWidth: '0',
                                maxWidth: '100%',
                                padding: '14px 16px',
                                backgroundColor: '#F9FAFB',
                                border: '2px solid #E5E7EB',
                                borderRadius: '12px',
                                fontSize: '15px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 200ms ease-in-out'
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = '#007AFF';
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                              }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer with action buttons */}
                  <div className="p-6 border-t flex-shrink-0" style={{ borderColor: '#F3F4F6' }}>
                    <div className="flex items-center justify-between">
                      <div style={{ fontSize: '14px', color: '#6B7280' }}>
                        {athleteData.selectedSportIds.length} sport{athleteData.selectedSportIds.length !== 1 ? 's' : ''} selected
                      </div>
                      <button
                        onClick={() => setShowSportModal(false)}
                        className="px-6 py-3 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: '#007AFF',
                          color: 'white',
                          fontSize: '15px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#0056CC';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#007AFF';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}