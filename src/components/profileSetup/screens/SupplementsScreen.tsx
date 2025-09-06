import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Check, Edit3, X } from 'lucide-react';
import { ProfileSetupStepProps, SupplementsData } from '../ProfileSetupTypes';
import { AddSupplementFlow } from '../../profile/AddSupplementFlow';
import { Supplement } from '../../profile/SupplementTypes';

interface SupplementsScreenProps extends ProfileSetupStepProps {
  supplements: SupplementsData;
  onSupplementAdd: (supplement: Supplement) => void;
  onSupplementRemove: (supplementId: string) => void;
  onSupplementEdit: (supplement: Supplement) => void;
}

// Popular supplements data
const popularSupplements = [
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    icon: '💪',
    description: 'Improves strength and power output',
    defaultDosage: '5g',
    defaultForm: 'powder',
    category: 'performance'
  },
  {
    id: 'magnesium',
    name: 'Magnesium Glycinate',
    icon: '🧘‍♂️',
    description: 'Supports muscle recovery and sleep',
    defaultDosage: '400mg',
    defaultForm: 'capsule',
    category: 'recovery'
  },
  {
    id: 'omega3',
    name: 'Omega-3 Fish Oil',
    icon: '🐟',
    description: 'Reduces inflammation and supports heart health',
    defaultDosage: '1000mg',
    defaultForm: 'softgel',
    category: 'general'
  },
  {
    id: 'vitaminD',
    name: 'Vitamin D3',
    icon: '☀️',
    description: 'Supports bone health and immune function',
    defaultDosage: '2000IU',
    defaultForm: 'softgel',
    category: 'vitamins'
  }
];

export function SupplementsScreen({
  supplements,
  onSupplementAdd,
  onSupplementRemove,
  onSupplementEdit,
  onContinue,
  onSkip,
  onBack,
  stepIndicator,
  progressPercentage,
  canContinue
}: SupplementsScreenProps) {
  const [isAddSupplementFlowOpen, setIsAddSupplementFlowOpen] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<Supplement | null>(null);

  const handleQuickAdd = (popular: typeof popularSupplements[0]) => {
    const newSupplement: Supplement = {
      id: `${popular.id}_${Date.now()}`,
      name: popular.name,
      form: popular.defaultForm,
      dosage: popular.defaultDosage,
      schedule: 'Daily at 08:00',
      startDate: new Date().toISOString().split('T')[0]
    };
    onSupplementAdd(newSupplement);
  };

  const handleQuickRemove = (popularId: string) => {
    const supplementToRemove = supplements.selectedSupplements.find(s => 
      s.name.toLowerCase().includes(popularId.toLowerCase())
    );
    if (supplementToRemove) {
      onSupplementRemove(supplementToRemove.id);
    }
  };

  const handlePopularSupplementToggle = (popular: typeof popularSupplements[0]) => {
    const isAdded = isSupplementAdded(popular.id);
    if (isAdded) {
      handleQuickRemove(popular.id);
    } else {
      handleQuickAdd(popular);
    }
  };

  const handleEditSupplement = (supplement: Supplement) => {
    setEditingSupplement(supplement);
    setIsAddSupplementFlowOpen(true);
  };

  const handleSupplementFlowSave = (supplement: Supplement) => {
    if (editingSupplement) {
      // Update existing supplement
      onSupplementEdit(supplement);
      setEditingSupplement(null);
    } else {
      // Add new supplement
      onSupplementAdd(supplement);
    }
    setIsAddSupplementFlowOpen(false);
  };

  const handleSupplementFlowClose = () => {
    setIsAddSupplementFlowOpen(false);
    setEditingSupplement(null);
  };

  const isSupplementAdded = (popularId: string) => {
    return supplements.selectedSupplements.some(s => 
      s.name.toLowerCase().includes(popularId.toLowerCase())
    );
  };

  const getAddedSupplement = (popularId: string) => {
    return supplements.selectedSupplements.find(s => 
      s.name.toLowerCase().includes(popularId.toLowerCase())
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
          Current Supplements
        </h1>
        <p style={{ fontSize: '16px', color: '#86868B', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
          Track what you're already taking
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-5 overflow-y-auto scrollbar-visible">
        {/* Popular Supplements Section */}
        <div className="mb-6">
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1D1D1F', marginBottom: '16px' }}>
            💊 Popular Supplements
          </h3>
          
          <div className="space-y-3 mb-6">
            {popularSupplements.map((popular) => {
              const isAdded = isSupplementAdded(popular.id);
              const addedSupplement = getAddedSupplement(popular.id);
              return (
                <div key={popular.id} className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handlePopularSupplementToggle(popular)}
                    className="flex-1 flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: isAdded ? '#F0F9FF' : '#FFFFFF',
                      border: isAdded ? '2px solid #34C759' : '1px solid #E5E5E7',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: '28px' }}>{popular.icon}</span>
                      <div className="text-left flex-1">
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1D1D1F', marginBottom: '2px' }}>
                          {popular.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#86868B' }}>
                          {popular.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#007AFF', marginTop: '2px' }}>
                          {popular.defaultDosage} • {popular.defaultForm}
                        </div>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                      backgroundColor: isAdded ? '#34C759' : 'transparent',
                      border: isAdded ? 'none' : '2px solid #86868B'
                    }}>
                      {isAdded ? (
                        <Check size={16} color="#FFFFFF" />
                      ) : (
                        <Plus size={14} color="#86868B" />
                      )}
                    </div>
                  </motion.button>
                  
                  {/* Edit button for added supplements */}
                  {isAdded && addedSupplement && (
                    <button
                      onClick={() => handleEditSupplement(addedSupplement)}
                      className="p-3 rounded-xl transition-colors"
                      style={{
                        backgroundColor: '#F0F8FF',
                        border: '1px solid #007AFF'
                      }}
                    >
                      <Edit3 size={16} color="#007AFF" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Custom Supplement Button */}
          <button
            onClick={() => setIsAddSupplementFlowOpen(true)}
            className="w-full py-4 rounded-xl border-2 border-dashed transition-colors"
            style={{
              borderColor: '#007AFF',
              backgroundColor: '#F0F8FF',
              color: '#007AFF'
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <Plus size={20} />
              <span style={{ fontSize: '16px', fontWeight: '600' }}>
                Add Custom Supplement
              </span>
            </div>
          </button>
        </div>

        {/* Selected Supplements */}
        {supplements.selectedSupplements.length > 0 && (
          <div className="mb-6">
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1D1D1F', marginBottom: '16px' }}>
              📋 Your Supplements ({supplements.selectedSupplements.length})
            </h3>
            
            <div className="space-y-3">
              {supplements.selectedSupplements.map((supplement) => (
                <div
                  key={supplement.id}
                  className="flex items-center gap-2"
                >
                  <div
                    className="flex-1 p-4 rounded-xl"
                    style={{
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E5E5E7'
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1D1D1F', marginBottom: '4px' }}>
                      {supplement.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#86868B', marginBottom: '2px' }}>
                      💊 {supplement.dosage} • {supplement.form}
                    </div>
                    <div style={{ fontSize: '12px', color: '#007AFF' }}>
                      🕐 {supplement.schedule}
                    </div>
                  </div>
                  
                  {/* Edit button */}
                  <button
                    onClick={() => handleEditSupplement(supplement)}
                    className="p-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: '#F0F8FF',
                      border: '1px solid #007AFF'
                    }}
                  >
                    <Edit3 size={16} color="#007AFF" />
                  </button>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => onSupplementRemove(supplement.id)}
                    className="p-3 rounded-xl transition-colors hover:bg-red-50"
                    style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #EF4444'
                    }}
                  >
                    <X size={16} color="#EF4444" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Supplement Flow Modal */}
      <AddSupplementFlow
        isOpen={isAddSupplementFlowOpen}
        onClose={handleSupplementFlowClose}
        onSave={handleSupplementFlowSave}
        editingSupplement={editingSupplement}
      />

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