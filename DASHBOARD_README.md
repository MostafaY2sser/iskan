# Production-Ready React + TypeScript Dashboard

A comprehensive dashboard system built with Vite + React + TypeScript, featuring RTL/LTR support, Arabic/English i18n, and modern UI components.

## 🚀 Features

### Core Features
- **RTL/LTR Support**: Full bidirectional text support with dynamic switching
- **Arabic/English i18n**: Complete internationalization with react-i18next
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: shadcn/ui components with custom styling
- **Charts & Analytics**: Recharts integration for data visualization
- **Type Safety**: Full TypeScript implementation

### Dashboard Components
- **Sidebar**: Collapsible navigation with RTL-aware positioning
- **Topbar**: Search, notifications, and action buttons
- **KPI Cards**: Key performance indicators with icons and trends
- **Charts**: Revenue charts, spending analysis, and data visualization
- **Tables**: Properties, bookings, and data management
- **Forms**: Multi-step property creation with validation

### Pages & Routes
- `/dashboard-new` - Main dashboard (property owner view)
- `/dashboard-customer` - Customer dashboard view
- `/properties-new` - Properties management
- `/messages-new` - Messages and communications
- `/bookings-new` - Bookings management
- `/reports` - Analytics and reports
- `/account` - User profile and settings
- `/settings` - Application preferences
- `/properties/new` - Add new property form
- `/dashboard-test` - Test page for RTL/LTR switching

## 🛠️ Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom RTL support
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6
- **i18n**: react-i18next
- **State**: React Context + Hooks

## 🎨 Design System

### Colors
- **Brand**: #253559 (Navy for headers/cards/primary buttons)
- **Brand Contrast**: #ffffff (White)
- **Muted**: #f6f7fb (Light gray background)
- **Text**: #0f172a (Dark text)
- **Success**: #16a34a (Green)
- **Warning**: #f59e0b (Orange)
- **Danger**: #ef4444 (Red)

### Typography
- **Font**: IBM Plex Sans Arabic (Arabic), Inter (English)
- **Scale**: Fluid typography with responsive sizing
- **Hierarchy**: Clear heading structure with proper contrast

### Layout
- **Sidebar**: 280px expanded / 88px collapsed
- **Cards**: Rounded corners (rounded-2xl), soft shadows
- **Spacing**: Generous padding and margins
- **Grid**: Responsive grid system (1/2/3/4 columns)

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
The project uses environment variables for configuration. Create a `.env.local` file:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=GRH Dashboard
```

## 🌐 RTL/LTR Support

### How to Switch Directions
1. **Programmatically**: Use the `useDirection` hook
```tsx
import { useDirection } from '@/hooks/useDirection';

const { direction, toggleDirection, setDirection } = useDirection();

// Toggle between RTL and LTR
toggleDirection();

// Set specific direction
setDirection('ltr'); // or 'rtl'
```

2. **Via Settings Page**: Navigate to `/settings` and use the direction toggle

3. **Via Test Page**: Visit `/dashboard-test` to test RTL/LTR switching

### RTL Implementation Details
- **HTML Direction**: Automatically set via `DirectionContext`
- **CSS Classes**: RTL-aware spacing with `rtl:space-x-reverse`
- **Layout Positioning**: Sidebar moves from right (RTL) to left (LTR)
- **Text Alignment**: Automatic text alignment based on direction
- **Icon Positioning**: Icons flip position based on direction

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: 1024px - 1280px (3 columns)
- **Large**: > 1280px (4 columns)

### Mobile Features
- **Collapsible Sidebar**: Overlay on mobile, drawer on tablet
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Swipe to close mobile sidebar
- **Responsive Typography**: Fluid text sizing

## 🎯 Component Usage

### KPI Card
```tsx
import KpiCard from '@/components/dashboard/KpiCard';
import { Banknote } from 'lucide-react';

<KpiCard
  icon={Banknote}
  label="الإيرادات الشهرية"
  value="45,000 ر.س"
  note="هذا الشهر"
  trend="up"
  trendValue="+12%"
/>
```

### Revenue Chart
```tsx
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import revenueData from '@/mocks/revenueByMonth.json';

<RevenueBarChart data={revenueData} />
```

### Data Table
```tsx
import PropertiesTable from '@/components/dashboard/PropertiesTable';
import propertiesData from '@/mocks/properties.json';

<PropertiesTable data={propertiesData} />
```

## 📊 Mock Data

The dashboard includes comprehensive mock data:

- **Revenue Data**: Monthly revenue by month (Jan-Dec)
- **Monthly Spend**: Customer spending analysis (Jan-Jun)
- **Bookings**: Recent bookings with status and details
- **Properties**: Property listings with images and metadata

### Data Structure
```typescript
// Revenue data
interface RevenueData {
  month: string;
  value: number;
  monthCode: string;
}

// Property data
interface Property {
  id: string;
  name: string;
  city: string;
  capacity: number;
  status: string;
  lastUpdated: string;
  price: number;
  image: string;
}
```

## 🔐 Authentication & Routing

### Protected Routes
All dashboard routes are protected and require authentication:

```tsx
<ProtectedRoute>
  <DashboardLayout>
    <DashboardPage />
  </DashboardLayout>
</ProtectedRoute>
```

### Role-Based Access
The system supports different user roles:
- **Admin**: Full access to all features
- **Property Owner**: Property management and bookings
- **Customer**: Booking and account management

## 🧪 Testing

### Test Routes
- `/dashboard-test` - RTL/LTR switching test
- `/settings` - Direction and language settings

### Manual Testing
1. **RTL/LTR Switching**: Use the toggle button in the test page
2. **Responsive Design**: Test on different screen sizes
3. **Navigation**: Verify sidebar navigation works correctly
4. **Forms**: Test multi-step property creation form

## 🚀 Deployment

### Build Configuration
```bash
# Production build
npm run build

# Development build
npm run build:dev
```

### Environment Variables
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=GRH Dashboard
VITE_APP_VERSION=1.0.0
```

## 📝 Customization

### Colors
Update colors in `tailwind.config.ts`:
```typescript
colors: {
  brand: 'hsl(var(--brand))',
  'brand-contrast': 'hsl(var(--brand-contrast))',
  // ... other colors
}
```

### i18n Strings
Update translations in `src/locales/`:
- `ar/common.json` - Arabic translations
- `en/common.json` - English translations

### Components
All components are fully customizable with TypeScript props and Tailwind classes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test RTL/LTR functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the test page at `/dashboard-test`
- Review the settings page at `/settings`
- Test RTL/LTR switching functionality
- Verify responsive design on different devices

---

**Built with ❤️ for GRH Housing Platform**
