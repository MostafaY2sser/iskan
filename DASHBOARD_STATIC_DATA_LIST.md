# Dashboard Static Data List

## 📊 **Static/Hardcoded Data in Dashboard**

Here's a comprehensive list of all the static data that's currently hardcoded in the dashboard instead of using real API data:

---

## 🎯 **1. User Information (Static)**

### **Dashboard Header**
- **File**: `src/pages/Dashboard.tsx`
- **Lines**: 127, 141, 153
- **Static Data**: `"مرحباً، أحمد محمد"` (Welcome, Ahmed Mohammed)
- **Issue**: Hardcoded user name instead of using actual logged-in user data
- **Should Use**: `user?.name` or `user?.email` from AuthProvider

```typescript
// Current (Static)
<DashboardLayout title="لوحة التحكم" subtitle="مرحباً، أحمد محمد">

// Should Be (Dynamic)
<DashboardLayout title="لوحة التحكم" subtitle={`مرحباً، ${user?.name || user?.email}`}>
```

---

## 📈 **2. Revenue Chart Fallback Data (Static)**

### **Monthly Analytics Fallback**
- **File**: `src/pages/Dashboard.tsx`
- **Line**: 57
- **Static Data**: `[18, 42, 24, 33, 50, 28, 41, 22, 16, 44, 52, 35]`
- **Issue**: When API data is not available, shows hardcoded bar chart values
- **Purpose**: Fallback data for 12 months of revenue chart

```typescript
// Current (Static Fallback)
if (!dashboardData?.monthlyAnalytics) return [18, 42, 24, 33, 50, 28, 41, 22, 16, 44, 52, 35];
```

---

## 🥧 **3. Pie Chart Data (Completely Static)**

### **Views Pie Chart**
- **File**: `src/pages/Dashboard.tsx`
- **Lines**: 353, 362
- **Static Data**: 
  - **Percentage**: `62%` (hardcoded)
  - **Gradient**: `conic-gradient(${SECONDARY} 0 62%, ${PRIMARY} 62% 100%)`
  - **Labels**: "مشاهدات العقارات" and "نقرات الممتلكات"
- **Issue**: No API endpoint for views/analytics data
- **Should Use**: Real analytics API endpoint

```typescript
// Current (Static)
style={{
  background: `conic-gradient(${SECONDARY} 0 62%, ${PRIMARY} 62% 100%)`,
}}
<p className="text-3xl font-bold text-foreground">62%</p>
```

---

## 🏠 **4. TotalAssetsCard Percentage Calculation (Static Logic)**

### **Percentage Calculation**
- **File**: `src/pages/Dashboard.tsx`
- **Line**: 162
- **Static Logic**: `(dashboardData.kpis.totalProperties / 200) * 100`
- **Issue**: Hardcoded denominator of 200 for percentage calculation
- **Should Use**: Dynamic total capacity or target from API

```typescript
// Current (Static Logic)
percent={dashboardData?.kpis.totalProperties ? Math.min(100, (dashboardData.kpis.totalProperties / 200) * 100) : 0}

// Should Be (Dynamic)
percent={dashboardData?.kpis.totalProperties ? Math.min(100, (dashboardData.kpis.totalProperties / dashboardData.kpis.totalCapacity) * 100) : 0}
```

---

## 📅 **5. Month Names (Static Array)**

### **Arabic Month Names**
- **File**: `src/pages/Dashboard.tsx`
- **Line**: 53
- **Static Data**: `['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']`
- **Issue**: Hardcoded Arabic month names
- **Note**: This is acceptable as it's localization data

```typescript
// Current (Static - Acceptable)
const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
```

---

## 🎨 **6. Color Constants (Static)**

### **Design Colors**
- **File**: `src/pages/Dashboard.tsx`
- **Lines**: 20-21
- **Static Data**: 
  - `PRIMARY = '#2E4166'`
  - `SECONDARY = '#D9C690'`
- **Issue**: Hardcoded brand colors
- **Note**: This is acceptable as it's design system constants

```typescript
// Current (Static - Acceptable)
const PRIMARY = '#2E4166';
const SECONDARY = '#D9C690';
```

---

## 🏷️ **7. Status Mapping (Static)**

### **Booking Status Translation**
- **File**: `src/pages/Dashboard.tsx`
- **Lines**: 90-96, 100-106
- **Static Data**: Status text and color mappings
- **Issue**: Hardcoded status translations and colors
- **Note**: This is acceptable as it's localization/UI mapping

```typescript
// Current (Static - Acceptable)
const statusMap: Record<string, string> = {
  'pending_bc_approval': 'قيد المراجعة',
  'agent_assigned': 'نشط',
  'approved': 'نشط',
  'rejected': 'مرفوض',
};
```

---

## 📊 **8. Chart Styling (Static)**

### **Bar Chart Styling**
- **File**: `src/pages/Dashboard.tsx`
- **Lines**: 214-218
- **Static Data**: 
  - Bar cap color: `'#1f2f4c'`
  - Bar cap height: `'8px'`
  - Bar height calculation: `Math.round((v / maxVal) * 140)`
- **Issue**: Hardcoded chart styling values
- **Note**: This is acceptable as it's UI styling

---

## 🔧 **9. Pagination Settings (Static)**

### **Table Pagination**
- **File**: `src/pages/Dashboard.tsx`
- **Line**: 110
- **Static Data**: `PAGE_SIZE = 5`
- **Issue**: Hardcoded page size
- **Note**: This is acceptable as it's UI configuration

---

## 📋 **Summary of Static Data Issues**

### ❌ **Critical Issues (Need API Integration):**

1. **User Name**: `"مرحباً، أحمد محمد"` - Should use real user data
2. **Pie Chart Data**: `62%` - Should use real analytics API
3. **Percentage Calculation**: `/200` - Should use dynamic capacity
4. **Chart Fallback**: `[18, 42, 24, ...]` - Should handle empty state better

### ✅ **Acceptable Static Data:**

1. **Month Names**: Arabic localization
2. **Color Constants**: Design system
3. **Status Mapping**: UI translations
4. **Chart Styling**: Visual design
5. **Pagination Size**: UI configuration

---

## 🚀 **Recommended Fixes**

### **1. Fix User Name**
```typescript
// In Dashboard.tsx
const { user } = useAuth();
const userName = user?.name || user?.email || 'مستخدم';

<DashboardLayout title="لوحة التحكم" subtitle={`مرحباً، ${userName}`}>
```

### **2. Fix Pie Chart**
```typescript
// Add new API endpoint for analytics
const { data: analyticsData } = useAnalytics();

// Use real data
const viewsPercentage = analyticsData?.viewsPercentage || 0;
```

### **3. Fix Percentage Calculation**
```typescript
// Add total capacity to API response
percent={dashboardData?.kpis.totalProperties ? 
  Math.min(100, (dashboardData.kpis.totalProperties / dashboardData.kpis.totalCapacity) * 100) : 0}
```

### **4. Improve Chart Fallback**
```typescript
// Better fallback handling
if (!dashboardData?.monthlyAnalytics) {
  return new Array(12).fill(0); // Show empty chart instead of fake data
}
```

---

## 📊 **Static Data Count**

- **Total Static Data Items**: 9
- **Critical Issues**: 4
- **Acceptable Static**: 5
- **API Endpoints Needed**: 2 (User info, Analytics)

The dashboard has **4 critical static data issues** that should be replaced with real API data for a production-ready application.

