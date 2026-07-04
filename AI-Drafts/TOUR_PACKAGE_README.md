# Tour Package Management System

This application now includes a comprehensive tour package management system with both admin and public interfaces.

## Features

### Admin Area (`/admin-area`)
- **Dashboard Overview**: Statistics showing total packages, available packages, and average price
- **Tour Package CRUD Operations**:
  - Create new tour packages
  - Edit existing packages
  - Delete packages with confirmation
  - Toggle package availability
  - Search and filter packages

### Public Product Page (`/product`)
- **Tour Package Display**: Shows only available packages to the public
- **Package Cards**: Display key information including:
  - Package image
  - Title and description
  - Destination and duration
  - Group size (min/max pax)
  - Price per person
- **Detailed Modal View**: Click "View Details" to see:
  - Full package description
  - Complete itinerary
  - What's included/excluded
  - Pricing information

### Dashboard (`/`)
- **Analytics Dashboard**: Pie charts and line charts for sales pipeline and booking analysis
- **Data Visualization**: Interactive charts showing business metrics

## Technology Stack

- **Frontend**: Next.js 15.3.3 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: React Icons (FaUserCircle, FaSignOutAlt, FaCog)
- **Charts**: Custom SVG-based components

## Component Structure

### Admin Components
- `AdminDashboard.tsx` - Main admin interface with tabs
- `TourPackageList.tsx` - CRUD list with search/filter
- `TourPackageForm.tsx` - Create/edit modal form
- `DeleteConfirmationModal.tsx` - Delete confirmation dialog

### Public Components
- `PublicTourPackageList.tsx` - Public tour package display
- `TourPackageCard.tsx` - Individual package card
- `TourPackageDetailModal.tsx` - Detailed package view modal

### Dashboard Components
- `Dashboard.tsx` - Main analytics dashboard
- `PieChart.tsx` - SVG pie chart component
- `LineChart.tsx` - SVG line chart component

## Redux State Management

### Tour Package Slice
- **State**: Packages array, filters, modals, loading states
- **Actions**: CRUD operations, filtering, modal management
- **Sample Data**: Pre-loaded with demo tour packages

## Navigation

- **Admin Access**: Click user dropdown → "Admin Area" (admin users only)
- **Public Access**: Navigation bar → "Product"
- **Dashboard**: Navigation bar → "Dashboard"

## Usage

1. **Access Admin Area**: Log in as admin and navigate to `/admin-area`
2. **Manage Packages**: Use the "Package Management" tab to create, edit, or delete tour packages
3. **View Public Display**: Navigate to `/product` to see how packages appear to customers
4. **Monitor Analytics**: Use the dashboard at `/` for business insights

## Data Structure

Each tour package includes:
- Basic info (title, description, price)
- Travel details (destination, duration, group size)
- Itinerary (day-by-day activities)
- Inclusions and exclusions
- Availability status
- Image URL

The system maintains consistency between admin management and public display, ensuring only available packages are shown to customers.