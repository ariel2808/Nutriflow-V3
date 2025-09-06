import React, { useState } from 'react';
import { ChevronLeft, Search, Camera, Plus, Check, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AddItemIngredientEditModal, EditableIngredient } from './AddItemIngredientEditModal';
import { RecipeOverviewModal } from './RecipeOverviewModal';

// Sample data for foods with extended nutrition data
const SAMPLE_FOODS = [
  {
    id: '1',
    name: 'Banana',
    description: '1 whole, regular (150 g)',
    calories: 134,
    carbs: 34,
    protein: 1.6,
    fat: 0.5,
    category: 'fruits'
  },
  {
    id: '2',
    name: 'Coffee',
    description: '1 cup (237 mL)',
    calories: 2,
    carbs: 0,
    protein: 0.3,
    fat: 0,
    category: 'beverages'
  },
  {
    id: '3',
    name: 'Egg, boiled',
    description: '1 egg, regular (60 g)',
    calories: 93,
    carbs: 0.8,
    protein: 8.2,
    fat: 6.6,
    category: 'protein'
  },
  {
    id: '4',
    name: 'Oatmeal',
    description: '1 cup cooked (240 g)',
    calories: 154,
    carbs: 28,
    protein: 5.4,
    fat: 3.2,
    category: 'grains'
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    description: '1 container (170 g)',
    calories: 100,
    carbs: 6,
    protein: 17,
    fat: 0,
    category: 'dairy'
  },
  {
    id: '6',
    name: 'Almonds',
    description: '1 oz (28 g)',
    calories: 164,
    carbs: 6,
    protein: 6,
    fat: 14,
    category: 'nuts'
  }
];

// Sample data for recipes with detailed nutrition and ingredients
const SAMPLE_RECIPES = [
  {
    id: '1',
    name: 'Breakfast Omelet',
    description: '3 eggs + 2 bread + 50g cottage',
    icon: '🍳',
    calories: 485,
    carbs: 28.5,
    protein: 35.2,
    fat: 16.8,
    ingredients: [
      { id: '1', name: 'Eggs', amount: '3 large', icon: '🥚' },
      { id: '2', name: 'Whole Wheat Bread', amount: '2 slices', icon: '🍞' },
      { id: '3', name: 'Cottage Cheese', amount: '50g', icon: '🥛' },
      { id: '4', name: 'Butter', amount: '1 tsp', icon: '🧈' },
      { id: '5', name: 'Salt', amount: '1 pinch', icon: '🧂' }
    ]
  },
  {
    id: '2',
    name: 'Tuna Salad',
    description: 'Lettuce + tuna + tomatoes + olives',
    icon: '🥗',
    calories: 320,
    carbs: 12.4,
    protein: 28.6,
    fat: 18.2,
    ingredients: [
      { id: '1', name: 'Mixed Lettuce', amount: '2 cups', icon: '🥬' },
      { id: '2', name: 'Tuna', amount: '1 can (150g)', icon: '🐟' },
      { id: '3', name: 'Cherry Tomatoes', amount: '1 cup', icon: '🍅' },
      { id: '4', name: 'Olives', amount: '10 pieces', icon: '🫒' },
      { id: '5', name: 'Olive Oil', amount: '1 tbsp', icon: '🫒' }
    ]
  },
  {
    id: '3',
    name: 'Protein Smoothie',
    description: 'Banana + protein powder + almond milk',
    icon: '🥤',
    calories: 280,
    carbs: 18.5,
    protein: 32.0,
    fat: 6.5,
    ingredients: [
      { id: '1', name: 'Banana', amount: '1 medium', icon: '🍌' },
      { id: '2', name: 'Protein Powder', amount: '1 scoop (30g)', icon: '🥄' },
      { id: '3', name: 'Almond Milk', amount: '1 cup (240ml)', icon: '🥛' },
      { id: '4', name: 'Peanut Butter', amount: '1 tbsp', icon: '🥜' }
    ]
  },
  {
    id: '4',
    name: 'Chicken Rice Bowl',
    description: 'Grilled chicken + brown rice + vegetables',
    icon: '🍚',
    calories: 520,
    carbs: 45.0,
    protein: 42.5,
    fat: 12.8,
    ingredients: [
      { id: '1', name: 'Chicken Breast', amount: '150g grilled', icon: '🍗' },
      { id: '2', name: 'Brown Rice', amount: '1 cup cooked', icon: '🍚' },
      { id: '3', name: 'Broccoli', amount: '1 cup steamed', icon: '🥦' },
      { id: '4', name: 'Carrots', amount: '1/2 cup diced', icon: '🥕' },
      { id: '5', name: 'Soy Sauce', amount: '1 tsp', icon: '🥢' }
    ]
  }
];

type Category = 'foods' | 'recipes';
type Filter = 'frequent' | 'recent' | 'created';

interface AddItemsScreenProps {
  onBack: () => void;
  onSave: (items: any[]) => void;
  onCreateMeal?: () => void;
  onEditMeal?: (recipeData: any) => void;
  onAddIngredient?: () => void;
}

interface AddedItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  type: Category;
  quantity?: number;
  amount?: number;
  unit?: string;
}

// Use the same EditableIngredient interface from IngredientEditModal

export function AddItemsScreen({ onBack, onSave, onCreateMeal, onEditMeal, onAddIngredient }: AddItemsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('foods');
  const [selectedFilter, setSelectedFilter] = useState<Filter>('frequent');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);
  const [addedItemIds, setAddedItemIds] = useState<Set<string>>(new Set());
  
  // Ingredient edit modal state
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<EditableIngredient | null>(null);
  
  // Recipe overview modal state
  const [isRecipeOverviewModalOpen, setIsRecipeOverviewModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  


  // Filter items based on search query
  const filterItems = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleAddItem = (item: any) => {
    const itemId = `${selectedCategory}-${item.id}`;
    
    if (addedItemIds.has(itemId)) {
      // Remove item
      setAddedItems(prev => prev.filter(addedItem => addedItem.id !== itemId));
      setAddedItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    } else {
      // Add item with default values
      const newItem: AddedItem = {
        id: itemId,
        name: item.name,
        description: item.description,
        calories: item.calories || 0,
        carbs: item.carbs || 0,
        protein: item.protein || 0,
        fat: item.fat || 0,
        type: selectedCategory,
        quantity: 1,
        amount: 1,
        unit: 'portion'
      };
      setAddedItems(prev => [...prev, newItem]);
      setAddedItemIds(prev => new Set([...prev, itemId]));
    }
  };

  const handleItemClick = (item: any) => {
    if (selectedCategory === 'foods') {
      // Convert food item to EditableIngredient format for modal
      const ingredient: EditableIngredient = {
        id: item.id,
        name: item.name,
        amount: '1 portion',
        unit: 'portion',
        icon: getDefaultIcon(item.category), // Add appropriate icon
        calories: item.calories || 0,
        carbs: item.carbs || 0,
        protein: item.protein || 0,
        fat: item.fat || 0
      };
      setSelectedIngredient(ingredient);
      setIsIngredientModalOpen(true);
    } else {
      // For recipes, open recipe overview modal
      setSelectedRecipe(item);
      setIsRecipeOverviewModalOpen(true);
    }
  };

  // Helper function to get default icons based on food category
  const getDefaultIcon = (category?: string) => {
    const iconMap: { [key: string]: string } = {
      'fruits': '🍎',
      'beverages': '☕',
      'protein': '🥚',
      'grains': '🌾',
      'dairy': '🥛',
      'nuts': '🥜',
      'vegetables': '🥬',
      'snacks': '🍪',
      'default': '🥄'
    };
    return iconMap[category || 'default'] || iconMap.default;
  };

  const handleIngredientAdd = (addedIngredient: EditableIngredient) => {
    // Add the customized ingredient to the added items list
    const itemId = `${selectedCategory}-${addedIngredient.id}`;
    const newItem: AddedItem = {
      id: itemId,
      name: addedIngredient.name,
      description: addedIngredient.amount,
      calories: addedIngredient.calories,
      carbs: addedIngredient.carbs,
      protein: addedIngredient.protein,
      fat: addedIngredient.fat,
      type: selectedCategory,
      quantity: 1,
      amount: parseFloat(addedIngredient.amount.split(' ')[0]) || 1, // Extract numeric amount
      unit: addedIngredient.unit || 'portion'
    };
    
    if (addedItemIds.has(itemId)) {
      // Update existing item
      setAddedItems(prev => prev.map(item => 
        item.id === itemId ? newItem : item
      ));
    } else {
      // Add new item
      setAddedItems(prev => [...prev, newItem]);
      setAddedItemIds(prev => new Set([...prev, itemId]));
    }
    
    setIsIngredientModalOpen(false);
    setSelectedIngredient(null);
  };

  const handleCloseIngredientModal = () => {
    setIsIngredientModalOpen(false);
    setSelectedIngredient(null);
  };

  const handleCloseRecipeOverviewModal = () => {
    setIsRecipeOverviewModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleEditRecipeFromOverview = (recipe: any) => {
    // Close the overview modal
    setIsRecipeOverviewModalOpen(false);
    setSelectedRecipe(null);
    
    // Navigate to recipe edit screen using the onEditMeal prop
    if (onEditMeal) {
      onEditMeal(recipe);
    } else {
      console.log('Navigate to recipe edit screen with:', recipe);
      alert(`Edit recipe: ${recipe.name}`);
    }
  };



  const handleSave = () => {
    onSave(addedItems);
  };

  const currentItems = selectedCategory === 'foods' ? SAMPLE_FOODS : SAMPLE_RECIPES;
  const filteredItems = filterItems(currentItems);

  return (
    <div 
      className="w-full h-screen overflow-hidden"
      style={{ 
        backgroundColor: '#FFFFFF',
        maxWidth: '375px',
        margin: '0 auto'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header with exact structure from other screens */}
        <div className="px-5 pt-12 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status Bar */}
            <div 
              className="flex justify-between items-center mb-8 text-sm"
              style={{ 
                color: 'var(--text-secondary)',
                height: '20px'
              }}
            >
              <span>8:00 AM</span>
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 500 }}>22°C</span>
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={onBack} 
                className="p-2 -ml-2 rounded-full transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ChevronLeft size={24} style={{ color: 'var(--icon-secondary)' }} />
              </button>
              
              <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Add Items
              </h1>
              
              <div className="w-10 h-10" /> {/* Spacer for alignment */}
            </div>
          </motion.div>
        </div>

        {/* Search Bar Section */}
        <div 
          className="px-4 py-4 flex-shrink-0"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#9CA3AF' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What did you have for breakfast?"
                className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-200"
                style={{
                  height: '48px',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: '#1F2937',
                  fontSize: '16px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3B82F6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-200"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => alert('Barcode scanning would be implemented here')}
              >
                <Camera size={18} style={{ color: '#6B7280' }} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Category Selection */}
        <div 
          className="px-4 py-4 flex-shrink-0"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <button
              onClick={() => setSelectedCategory('foods')}
              className={`flex-1 flex flex-col items-center p-4 rounded-2xl transition-all duration-200 ${
                selectedCategory === 'foods' ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: selectedCategory === 'foods' ? '#FFFFFF' : 'transparent',
                border: selectedCategory === 'foods' ? '1px solid #E5E7EB' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'foods') {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'foods') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="mb-2" style={{ fontSize: '48px' }}>🥕</div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: selectedCategory === 'foods' ? '#1F2937' : '#6B7280',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Foods
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('recipes')}
              className={`flex-1 flex flex-col items-center p-4 rounded-2xl transition-all duration-200 ${
                selectedCategory === 'recipes' ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: selectedCategory === 'recipes' ? '#FFFFFF' : 'transparent',
                border: selectedCategory === 'recipes' ? '1px solid #E5E7EB' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'recipes') {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'recipes') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div className="mb-2" style={{ fontSize: '48px' }}>🍱</div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500',
                color: selectedCategory === 'recipes' ? '#1F2937' : '#6B7280',
                fontFamily: 'SF Pro Display, system-ui, sans-serif'
              }}>
                Recipes
              </span>
            </button>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4 flex-shrink-0" style={{ backgroundColor: '#F8F9FA' }}>
          <motion.div
            className="flex rounded-full p-1"
            style={{ backgroundColor: '#F3F4F6' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {(['frequent', 'recent', 'created'] as Filter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex-1 py-2 px-4 rounded-full transition-all duration-200 ${
                  selectedFilter === filter ? 'shadow-sm' : ''
                }`}
                style={{
                  backgroundColor: selectedFilter === filter ? '#FFFFFF' : 'transparent',
                  color: selectedFilter === filter ? '#1F2937' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  height: '36px'
                }}
                onMouseEnter={(e) => {
                  if (selectedFilter !== filter) {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFilter !== filter) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-4 pb-32">
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {filteredItems.map((item, index) => {
                const itemId = `${selectedCategory}-${item.id}`;
                const isAdded = addedItemIds.has(itemId);
                
                return (
                  <motion.div
                    key={itemId}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: '#FFFFFF',
                      minHeight: '64px'
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: '#1F2937',
                          marginBottom: '2px',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif',
                          cursor: 'pointer'
                        }}>
                          {item.name}
                        </h3>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          fontFamily: 'SF Pro Display, system-ui, sans-serif'
                        }}>
                          {item.calories} kcal
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        fontFamily: 'SF Pro Display, system-ui, sans-serif'
                      }}>
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem(item);
                      }}
                      className="ml-4 flex items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: isAdded ? '#3B82F6' : 'transparent',
                        border: `2px solid ${isAdded ? '#3B82F6' : '#3B82F6'}`,
                        color: isAdded ? '#FFFFFF' : '#3B82F6'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'scale(0.95)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                    >
                      <motion.div
                        key={isAdded ? 'check' : 'plus'}
                        initial={{ rotate: -45, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 45, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isAdded ? <Check size={16} /> : <Plus size={16} />}
                      </motion.div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredItems.length === 0 && selectedFilter === 'created' && selectedCategory === 'foods' && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6" style={{ fontSize: '64px' }}>🍽️</div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  marginBottom: '8px'
                }}>
                  No custom ingredients yet
                </p>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Create your first custom ingredient
                </p>
                
                {onAddIngredient && (
                  <button
                    onClick={onAddIngredient}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 mx-auto"
                    style={{
                      backgroundColor: '#3B82F6',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '500',
                      fontFamily: 'SF Pro Display, system-ui, sans-serif',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3B82F6';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Plus size={16} />
                    Add New Ingredient
                  </button>
                )}
              </motion.div>
            )}

            {filteredItems.length === 0 && (selectedFilter !== 'created' || selectedCategory !== 'foods') && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  No items found
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  marginTop: '4px',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif'
                }}>
                  Try adjusting your search
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Fixed Save Button */}
        <AnimatePresence>
          {addedItems.length > 0 && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-200"
                style={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  height: '48px',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10B981';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
              >
                <Check size={16} />
                Save ({addedItems.length})
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create New Recipe Button - Only shown when on recipes tab */}
        <AnimatePresence>
          {selectedCategory === 'recipes' && onCreateMeal && addedItems.length === 0 && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={onCreateMeal}
                className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-200"
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  height: '48px',
                  minWidth: '160px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
              >
                <ChefHat size={16} />
                Create New Recipe
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add New Ingredient Button - For Foods tab in Created filter when no items selected */}
        <AnimatePresence>
          {selectedCategory === 'foods' && selectedFilter === 'created' && onAddIngredient && addedItems.length === 0 && filteredItems.length > 0 && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={onAddIngredient}
                className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-200"
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'SF Pro Display, system-ui, sans-serif',
                  height: '48px',
                  minWidth: '160px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
              >
                <Plus size={16} />
                Add New Ingredient
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AddItemIngredientEditModal
        isOpen={isIngredientModalOpen}
        onClose={handleCloseIngredientModal}
        ingredient={selectedIngredient}
        onAdd={handleIngredientAdd}
      />

      <RecipeOverviewModal
        isOpen={isRecipeOverviewModalOpen}
        onClose={handleCloseRecipeOverviewModal}
        meal={selectedRecipe}
        onEdit={handleEditRecipeFromOverview}
      />
    </div>
  );
}