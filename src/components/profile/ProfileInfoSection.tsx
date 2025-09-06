import React, { useState } from 'react';
import { ProfileInfoItem } from './ProfileInfoItem';
import { profileInfoItems } from './ProfileData';
import { athleteTypes, renderIcon } from '../profileSetup/ProfileSetupConstants';
import { AthleteProfileModal } from './AthleteProfileModal';

interface ProfileInfoSectionProps {
  onModalStateChange: (isOpen: boolean) => void;
}

// Mock data for selected sport types - in a real app this would come from user profile data
const selectedSportTypes = ['runner', 'cyclist']; // Example: user is a runner and cyclist

export function ProfileInfoSection({ onModalStateChange }: ProfileInfoSectionProps) {
  const [isAthleteProfileModalOpen, setIsAthleteProfileModalOpen] = useState(false);

  // Get the selected sport type details
  const selectedSports = athleteTypes.filter(type => selectedSportTypes.includes(type.id));

  const handleOpenAthleteProfile = () => {
    setIsAthleteProfileModalOpen(true);
    onModalStateChange(true);
  };

  const handleCloseAthleteProfile = () => {
    setIsAthleteProfileModalOpen(false);
    onModalStateChange(false);
  };

  const handleEditAthleteProfile = () => {
    // TODO: Implement navigation to athlete profile edit screen
    console.log('Navigate to athlete profile edit screen');
    alert('Athlete profile edit screen would be implemented here');
    handleCloseAthleteProfile();
  };

  return (
    <div>
      <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>Athlete Profile</h2>
      
      {/* Sport Type Row */}
      <div className="mb-4">
        <button
          onClick={handleOpenAthleteProfile}
          className="w-full p-4 rounded-2xl transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-main)',
            border: '2px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: '64px' // Narrower than regular cards
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--btn-primary-bg)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.15)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div className="flex items-center justify-between h-full">
            {/* Left side - Sport types */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                {selectedSports.map((sport, index) => (
                  <div key={sport.id} className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(74, 144, 226, 0.1)' }}
                    >
                      <div style={{ fontSize: '16px' }}>
                        {renderIcon(sport.icon)}
                      </div>
                    </div>
                    {index < selectedSports.length - 1 && (
                      <div 
                        className="w-1 h-1 rounded-full mx-1"
                        style={{ backgroundColor: 'var(--text-secondary)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col">
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  {selectedSports.length === 1 
                    ? selectedSports[0].title
                    : selectedSports.map(s => s.title.split(' ')[0]).join(' & ')
                  }
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  {selectedSports.length > 1 
                    ? 'Multi-sport athlete'
                    : selectedSports[0]?.subtitle || 'Athlete'
                  }
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Weight Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {profileInfoItems.map((item, index) => (
          <ProfileInfoItem key={index} item={item} onModalStateChange={onModalStateChange} />
        ))}
      </div>

      {/* Athlete Profile Modal */}
      <AthleteProfileModal
        isOpen={isAthleteProfileModalOpen}
        onClose={handleCloseAthleteProfile}
        onEdit={handleEditAthleteProfile}
      />
    </div>
  );
}