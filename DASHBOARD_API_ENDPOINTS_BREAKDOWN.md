# Dashboard API Endpoints Breakdown

## 📊 Dashboard Overview

The dashboard is composed of several sections, each using specific API endpoints to fetch and display data. Here's a detailed breakdown of which endpoints each part uses:

## 🔗 Main API Endpoints Used

### 1. **Dashboard Data Hook** (`useDashboard`)
**File**: `src/hooks/useDashboard.ts`
**Primary Endpoint**: `dashboardApi.getDashboardData(userId)`

This hook orchestrates multiple API calls to fetch all dashboard data in parallel.

---

## 📈 Dashboard Sections & Their API Endpoints

### 1. **Top KPI Row** (4 Cards)

#### A. **إجمالي العقارات** (Total Properties) - 2 columns
- **Component**: `TotalAssetsCard`
- **Data Source**: `dashboardData.kpis.totalProperties`
- **API Endpoint**: `GET /residence/user/{user_id}`
- **Purpose**: Counts total number of user's residences
- **Code Location**: `dashboardApi.getDashboardKPIs()` → `api.get('/residence/user/${userId}')`

#### B. **الإيرادات الشهرية** (Monthly Revenue)
- **Component**: `KpiMiniCard`
- **Data Source**: `dashboardData.kpis.monthlyRevenue`
- **API Endpoint**: `GET /bookings/me/monthly-analytics`
- **Purpose**: Gets current month's revenue from approved bookings
- **Code Location**: `dashboardApi.getDashboardKPIs()` → `api.get('/bookings/me/monthly-analytics')`

#### C. **الحجوزات النشطة** (Active Bookings)
- **Component**: `KpiMiniCard`
- **Data Source**: `dashboardData.kpis.activeBookings`
- **API Endpoint**: `GET /bookings/by/user`
- **Purpose**: Counts bookings with status 'approved' or 'agent_assigned'
- **Code Location**: `dashboardApi.getDashboardKPIs()` → `api.get('/bookings/by/user')`

---

### 2. **Revenue Chart** (Bar Chart)

#### **إجمالي الإيرادات** (Total Revenue Chart)
- **Component**: Custom bar chart in `Dashboard.tsx`
- **Data Source**: `dashboardData.monthlyAnalytics`
- **API Endpoint**: `GET /bookings/me/monthly-analytics`
- **Purpose**: Shows monthly revenue trends for the past 12 months
- **Code Location**: `dashboardApi.getMonthlyAnalytics()` → `api.get('/bookings/me/monthly-analytics')`

**Chart Processing**:
```typescript
// Creates array for 12 months, filling with 0 for missing months
const monthlyData = new Array(12).fill(0);
dashboardData.monthlyAnalytics.forEach(analytics => {
  const monthIndex = parseInt(analytics.month_year.split('-')[1]) - 1;
  if (monthIndex >= 0 && monthIndex < 12) {
    monthlyData[monthIndex] = Math.min(100, (analytics.total_amount / 1000));
  }
});
```

---

### 3. **Recent Bookings Table**

#### **آخر الحجوزات** (Recent Bookings)
- **Component**: Table in `Dashboard.tsx`
- **Data Source**: `dashboardData.recentBookings`
- **API Endpoint**: `GET /bookings/by/user`
- **Purpose**: Shows last 8 bookings with pagination
- **Code Location**: `dashboardApi.getRecentBookings()` → `api.get('/bookings/by/user')`

**Table Data Processing**:
```typescript
const offersData = dashboardData.recentBookings.slice(0, 8).map((booking, index) => ({
  id: booking.id,
  property: dashboardData.userResidences.find(r => r.id === booking.residence_id)?.name || 'عقار غير محدد',
  clients: booking.bed_count,
  monthlyPrice: `ر.س ${booking.total_price_with_commission.toLocaleString()}`,
  status: getStatusText(booking.status),
  statusColor: getStatusColor(booking.status),
}));
```

**Status Mapping**:
- `pending_bc_approval` → `قيد المراجعة` (Orange)
- `agent_assigned` → `نشط` (Green)
- `approved` → `نشط` (Green)
- `rejected` → `مرفوض` (Red)

---

### 4. **Pie Chart** (Views)

#### **إجمالي المشاهدات** (Total Views)
- **Component**: Custom pie chart in `Dashboard.tsx`
- **Data Source**: **Static/Hardcoded** (62% - not from API)
- **API Endpoint**: **None** - This is mock data
- **Purpose**: Shows property views vs clicks (currently hardcoded)
- **Note**: This appears to be placeholder data and doesn't use any API endpoint

---

## 🔄 API Call Flow

### **Parallel API Calls** (in `getDashboardData`):
```typescript
const [kpis, monthlyAnalytics, recentBookings, userResidences] = await Promise.all([
  dashboardApi.getDashboardKPIs(userId),        // Calls 3 endpoints internally
  dashboardApi.getMonthlyAnalytics(),           // GET /bookings/me/monthly-analytics
  dashboardApi.getRecentBookings(),             // GET /bookings/by/user
  dashboardApi.getUserResidences(userId),       // GET /residence/user/{user_id}
]);
```

### **KPI Calculation** (in `getDashboardKPIs`):
```typescript
// 1. Get user residences
const residences = await api.get(`/residence/user/${userId}`);

// 2. Get monthly analytics
const monthlyAnalytics = await api.get('/bookings/me/monthly-analytics');

// 3. Get user bookings
const bookings = await api.get('/bookings/by/user');

// 4. Calculate KPIs
const totalProperties = residences?.length || 0;
const activeBookings = bookings?.filter(booking => 
  booking.status === 'approved' || booking.status === 'agent_assigned'
).length || 0;
```

---

## 📋 Complete API Endpoints Summary

| Dashboard Section | API Endpoint | Method | Purpose |
|------------------|--------------|---------|---------|
| **Total Properties** | `/residence/user/{user_id}` | GET | Get user's residences count |
| **Monthly Revenue** | `/bookings/me/monthly-analytics` | GET | Get current month revenue |
| **Active Bookings** | `/bookings/by/user` | GET | Get user's bookings count |
| **Total Revenue** | `/bookings/me/monthly-analytics` | GET | Get all months revenue |
| **Revenue Chart** | `/bookings/me/monthly-analytics` | GET | Get 12 months data for chart |
| **Recent Bookings** | `/bookings/by/user` | GET | Get user's bookings list |
| **Property Names** | `/residence/user/{user_id}` | GET | Get residence names for table |
| **Views Pie Chart** | **None** | - | Static/hardcoded data |

---

## 🎯 Key API Endpoints Used

### **Primary Endpoints** (4 total):

1. **`GET /residence/user/{user_id}`**
   - Used for: Total properties count, Property names in table
   - Returns: `ResidenceOwnerResponse[]`

2. **`GET /bookings/me/monthly-analytics`**
   - Used for: Monthly revenue, Total revenue, Revenue chart
   - Returns: `MonthlyAnalyticsResponse[]`

3. **`GET /bookings/by/user`**
   - Used for: Active bookings count, Recent bookings table
   - Returns: `BookingResponse[]`

4. **Static Data**
   - Used for: Pie chart (views percentage)
   - Returns: Hardcoded 62%

---

## 🔧 Data Processing

### **KPI Calculations**:
```typescript
// Total Properties
const totalProperties = residences?.length || 0;

// Active Bookings
const activeBookings = bookings?.filter(booking => 
  booking.status === 'approved' || booking.status === 'agent_assigned'
).length || 0;

// Monthly Revenue (current month)
const currentMonth = new Date().toISOString().slice(0, 7);
const currentMonthData = monthlyAnalytics.find(analytics => 
  analytics.month_year.startsWith(currentMonth)
);
const monthlyRevenue = currentMonthData?.total_amount || 0;

// Total Revenue
const totalRevenue = monthlyAnalytics?.reduce((sum, analytics) => 
  sum + analytics.total_amount, 0) || 0;
```

### **Chart Data Processing**:
```typescript
// Monthly chart data
const monthlyData = new Array(12).fill(0);
dashboardData.monthlyAnalytics.forEach(analytics => {
  const monthIndex = parseInt(analytics.month_year.split('-')[1]) - 1;
  if (monthIndex >= 0 && monthIndex < 12) {
    monthlyData[monthIndex] = Math.min(100, (analytics.total_amount / 1000));
  }
});
```

---

## 🚨 Error Handling

Each API call has error handling that returns default values:
- **Total Properties**: 0
- **Monthly Revenue**: 0
- **Active Bookings**: 0
- **Total Revenue**: 0
- **Recent Bookings**: []
- **Monthly Analytics**: []

---

## 📝 Notes

1. **Pie Chart**: The views pie chart (62%) appears to be placeholder data and doesn't use any API endpoint
2. **Parallel Loading**: All API calls are made in parallel using `Promise.all()` for better performance
3. **Data Relationships**: Property names in the bookings table are resolved by matching `residence_id` with the user's residences
4. **Status Filtering**: Only bookings with status 'approved' or 'agent_assigned' are counted as active
5. **Month Processing**: Monthly analytics data is processed to create a 12-month array for the chart

This breakdown shows that the dashboard primarily uses 3 main API endpoints, with most data coming from bookings and residence-related endpoints.
