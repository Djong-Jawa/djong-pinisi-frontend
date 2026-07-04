# Dynamic Pricing System Implementation

## Overview

The tour package management system has been enhanced with a dynamic pricing structure that allows multiple price tiers based on different passenger group sizes. This provides more flexible pricing options for different group sizes.

## New Features

### 1. Multiple Pricing Tiers
- **Add Pricing Tier Button**: Allows adding multiple price ranges
- **Remove Pricing Tier**: Can remove individual pricing tiers (minimum 1 required)
- **Price per Group Size**: Each tier has its own price for a specific passenger range

### 2. Dynamic Pricing Structure

Each pricing tier contains:
- **Price per Pax (IDR)**: The price per person for this tier
- **Min Pax**: Minimum number of passengers for this pricing tier
- **Max Pax**: Maximum number of passengers for this pricing tier

### 3. Examples of Usage

**Example 1: Small Group Premium**
- Tier 1: 1-3 passengers = IDR 2,800,000 per person
- Tier 2: 4-8 passengers = IDR 2,500,000 per person  
- Tier 3: 9-15 passengers = IDR 2,200,000 per person

**Example 2: Business Tour**
- Tier 1: 1-5 passengers = IDR 2,000,000 per person
- Tier 2: 6-12 passengers = IDR 1,800,000 per person
- Tier 3: 13-20 passengers = IDR 1,600,000 per person

## Implementation Details

### Data Structure
```typescript
interface Rate {
  pricePerPax: string;
  maxPax: string;
  minPax: string;
}

interface TourPackage {
  // ... other fields
  rate: Rate[];
}
```

### Form Interface
- **Pricing Tiers Section**: Replaced single pricing fields with dynamic tier management
- **Add Button**: Blue "Add Pricing Tier" button to add new tiers
- **Remove Button**: Red "Remove" button for each tier (disabled if only one tier exists)
- **Validation**: All fields are required and include proper input types
- **Visual Feedback**: Shows applicable passenger range for each tier

### Display Components

#### Admin List View
- Shows "Starting Price" (lowest price across all tiers)
- Displays "Pricing Tiers" count instead of capacity range
- Maintains all other administrative functionality

#### Public Package Card
- Displays "Starting from" with the lowest available price
- Shows overall group size range (min to max across all tiers)
- Maintains existing design and functionality

#### Package Detail Modal
- **Pricing Tiers Section**: New dedicated section showing all pricing options
- **Tier Cards**: Each tier displayed in gray background card with passenger range and price
- **Footer Pricing**: Shows starting price (lowest available)
- **Group Size**: Shows overall range across all tiers

## Technical Implementation

### Form Management
```typescript
// Rate management functions
const addRateItem = () => {
  setFormData(prev => ({
    ...prev,
    rate: [...prev.rate, { pricePerPax: '', maxPax: '', minPax: '' }]
  }));
};

const removeRateItem = (index: number) => {
  if (formData.rate.length > 1) {
    setFormData(prev => ({
      ...prev,
      rate: prev.rate.filter((_, i) => i !== index)
    }));
  }
};

const updateRateItem = (index: number, field: 'pricePerPax' | 'maxPax' | 'minPax', value: string) => {
  setFormData(prev => ({
    ...prev,
    rate: prev.rate.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
  }));
};
```

### Price Calculation Utilities
```typescript
// Get the lowest price from all rate tiers
const getLowestPrice = () => {
  if (!tourPackage.rate || tourPackage.rate.length === 0) return 0;
  return Math.min(...tourPackage.rate.map(r => parseInt(r.pricePerPax)));
};

// Get the overall group size range
const getGroupSizeRange = () => {
  if (!tourPackage.rate || tourPackage.rate.length === 0) return "1-10";
  const minPax = Math.min(...tourPackage.rate.map(r => parseInt(r.minPax)));
  const maxPax = Math.max(...tourPackage.rate.map(r => parseInt(r.maxPax)));
  return `${minPax}-${maxPax}`;
};
```

## User Experience

### Admin Experience
1. **Create Package**: Click "Add Pricing Tier" to add multiple price ranges
2. **Edit Package**: Existing packages show all current pricing tiers
3. **Management**: Easy add/remove functionality with visual feedback
4. **Validation**: Form prevents submission with incomplete pricing information

### Customer Experience
1. **Browse**: See "Starting from" pricing on package cards
2. **Details**: View complete pricing table with all tier options
3. **Selection**: Clear understanding of pricing based on group size
4. **Booking**: Transparent pricing structure for different group sizes

## Sample Data

The system includes sample data with realistic pricing tiers:

- **Bali Cultural Heritage Tour**: 3 pricing tiers (1-3, 4-8, 9-15 pax)
- **Yogyakarta Historical Journey**: 3 pricing tiers (1-5, 6-12, 13-20 pax)  
- **Raja Ampat Diving Expedition**: 3 pricing tiers (1-2, 3-6, 7-12 pax)

## Benefits

1. **Flexible Pricing**: Accommodate different group sizes with appropriate pricing
2. **Scalable**: Easy to add or remove pricing tiers as needed
3. **Transparent**: Clear pricing structure for customers
4. **Business Logic**: Rewards larger groups with better per-person pricing
5. **Competitive**: Allows fine-tuned pricing strategies for different market segments