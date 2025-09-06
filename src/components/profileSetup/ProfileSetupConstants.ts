import triathleteIcon from 'figma:asset/92802ece0bbfc161d5bc70095163944e943a534c.png';

// Activity level options
export const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'lightly-active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'very-active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'extra-active', label: 'Extra Active', description: 'Very hard exercise, physical job' },
];

// Dietary preferences options
export const dietaryPreferences = [
  { id: 'none', icon: '🍽️', title: 'No preference', subtitle: 'All foods' },
  { id: 'kosher', icon: '☪️', title: 'Kosher', subtitle: 'Kosher dietary laws' },
  { id: 'vegan', icon: '🌱', title: 'Vegan', subtitle: 'Plant-based only' },
  { id: 'vegetarian', icon: '🥬', title: 'Vegetarian', subtitle: 'No meat or fish' },
  { id: 'lowcarb', icon: '🍖', title: 'Low carb', subtitle: 'Reduced carbohydrates' },
  { id: 'glutenfree', icon: '🌾', title: 'Gluten-free', subtitle: 'No gluten proteins' },
  { id: 'paleo', icon: '🥜', title: 'Paleo', subtitle: 'Whole foods only' },
  { id: 'pescatarian', icon: '🐟', title: 'Pescatarian', subtitle: 'Fish but no meat' },
];

// Supplement categories and items
export const supplementCategories = {
  performance: {
    name: 'Performance',
    color: '#FF6B35',
    icon: '💪',
    items: ['Creatine', 'Pre-Workout', 'Caffeine', 'Beta-Alanine']
  },
  recovery: {
    name: 'Recovery',
    color: '#007AFF',
    icon: '🔄',
    items: ['Whey Protein', 'Magnesium', 'ZMA', 'Glutamine']
  },
  general: {
    name: 'General',
    color: '#34C759',
    icon: '🌟',
    items: ['Multivitamin', 'Omega-3', 'Probiotics', 'Calcium']
  },
  vitamins: {
    name: 'Vitamins',
    color: '#8B5CF6',
    icon: '💊',
    items: ['Vitamin D', 'B12', 'Iron', 'Folate']
  }
};

// Athlete types data
export const athleteTypes = [
  { id: 'strength', icon: '🏋️', title: 'Strength Athlete', subtitle: 'Powerlifter, bodybuilder' },
  { id: 'runner', icon: '🏃', title: 'Runner', subtitle: 'Distance, sprinter, trail' },
  { id: 'cyclist', icon: '🚴', title: 'Cyclist', subtitle: 'Road, mountain, indoor' },
  { id: 'swimmer', icon: '🏊', title: 'Swimmer', subtitle: 'Pool, open water' },
  { id: 'triathlete', icon: 'triathlete-chain', title: 'Triathlete', subtitle: 'Multi-sport endurance' },
  { id: 'combat', icon: '🥊', title: 'Combat Athlete', subtitle: 'Boxing, MMA, martial arts' },
  { id: 'team', icon: '⚽', title: 'Team Sport Athlete', subtitle: 'Football, basketball, soccer' },
  { id: 'yoga', icon: '🧘', title: 'Yoga Practitioner', subtitle: 'Yogi, flexibility specialist' },
  { id: 'crossfit', icon: '🏃‍♂️', title: 'CrossFitter', subtitle: 'Functional fitness athlete' },
  { id: 'racquet', icon: '🎾', title: 'Racquet Sport Player', subtitle: 'Tennis, badminton, squash' },
  { id: 'adventure', icon: '🏂', title: 'Adventure Athlete', subtitle: 'Outdoor sports enthusiast' },
];

// Training volumes data
export const trainingVolumes = [
  { id: 'light', icon: '💪', title: '3-5 hours', subtitle: 'Light load', description: 'Getting started or maintaining' },
  { id: 'moderate', icon: '🔥', title: '5-10 hours', subtitle: 'Moderate load', description: 'Regular training routine' },
  { id: 'heavy', icon: '⚡', title: '10-15 hours', subtitle: 'Heavy load', description: 'Serious athlete' },
  { id: 'elite', icon: '🚀', title: '15+ hours', subtitle: 'Full-time athlete', description: 'Elite level training' },
];

// Time slots for training schedule
export const timeSlots = [
  { id: 'early', icon: '🌅', label: 'Early Morning', time: '5-8AM' },
  { id: 'morning', icon: '🌄', label: 'Morning', time: '8-12PM' },
  { id: 'afternoon', icon: '☀️', label: 'Afternoon', time: '12-5PM' },
  { id: 'evening', icon: '🌆', label: 'Evening', time: '5-9PM' },
  { id: 'night', icon: '🌙', label: 'Night', time: '9PM+' },
];

export const durationOptions = ['30min', '45min', '1h', '1.5h', '2h', '2.5h', '3h+'];

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Suggested sports for search
export const suggestedSports = [
  'Basketball', 'Rock Climbing', 'Skiing', 'Surfing', 
  'Gymnastics', 'Hockey', 'Volleyball', 'Golf'
];

// Radar chart goals
export const goalPresets = [
  { name: 'Endurance Athlete', performance: 90, recovery: 85, muscle: 40, weight: 30 },
  { name: 'Strength Focus', performance: 70, recovery: 60, muscle: 95, weight: 40 },
  { name: 'Weight Loss', performance: 60, recovery: 70, muscle: 50, weight: 90 },
  { name: 'Balanced', performance: 70, recovery: 70, muscle: 70, weight: 70 },
];

// Helper function to render icon (emoji or image)
export const renderIcon = (icon: string) => {
  if (icon === 'triathlete-chain') {
    return (
      <img 
        src={triathleteIcon} 
        alt="Triathlete" 
        style={{ 
          width: '24px', 
          height: '24px',
          objectFit: 'contain'
        }}
      />
    );
  }
  return <div style={{ fontSize: '24px' }}>{icon}</div>;
};