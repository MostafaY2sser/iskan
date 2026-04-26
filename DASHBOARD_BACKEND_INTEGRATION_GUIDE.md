# Dashboard Backend Integration Guide

## 🎯 **How to Replace Static Data with Real Backend Data**

This guide shows you how to integrate real API endpoints to replace the static data in your dashboard.

---

## 📊 **Current Static Data Issues & Solutions**

### 1. **👤 User Name Issue**

#### **Current Problem:**
```typescript
// Static hardcoded name
<DashboardLayout title="لوحة التحكم" subtitle="مرحباً، أحمد محمد">
```

#### **Available API Endpoints:**
- `GET /customers/me` - Get current customer details
- `GET /admin/users` - Get user information (admin only)

#### **Solution:**
```typescript
// 1. Create a new hook to fetch user details
const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // For customers
        if (user?.role === 'property-owner') {
          const response = await api.get('/customers/me');
          setUserDetails(response);
        }
        // For other user types, you might need different endpoints
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  return userDetails;
};

// 2. Update Dashboard component
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userDetails = useUserDetails();
  
  // Get display name
  const displayName = userDetails?.responsible_person || 
                     userDetails?.company_name || 
                     user?.email || 
                     'مستخدم';

  return (
    <DashboardLayout 
      title="لوحة التحكم" 
      subtitle={`مرحباً، ${displayName}`}
    >
      {/* ... rest of dashboard */}
    </DashboardLayout>
  );
};
```

---

### 2. **🥧 Pie Chart Data Issue**

#### **Current Problem:**
```typescript
// Static hardcoded 62%
<p className="text-3xl font-bold text-foreground">62%</p>
style={{ background: `conic-gradient(${SECONDARY} 0 62%, ${PRIMARY} 62% 100%)` }}
```

#### **Available API Endpoints:**
- `GET /bookings/me/monthly-analytics` - Already used for revenue
- `GET /residence/approved_residences` - Get approved residences
- `GET /bookings/by/user` - Get user bookings

#### **Solution:**
```typescript
// 1. Create analytics hook
const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get user's residences
        const residences = await api.get(`/residence/user/${user.id}`);
        
        // Get user's bookings
        const bookings = await api.get('/bookings/by/user');
        
        // Calculate views percentage (mock calculation)
        const totalResidences = residences?.length || 0;
        const viewedResidences = bookings?.length || 0;
        const viewsPercentage = totalResidences > 0 ? 
          Math.round((viewedResidences / totalResidences) * 100) : 0;

        setAnalytics({
          viewsPercentage,
          totalResidences,
          viewedResidences
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    if (user?.id) {
      fetchAnalytics();
    }
  }, [user?.id]);

  return analytics;
};

// 2. Update Dashboard component
const Dashboard: React.FC = () => {
  const analytics = useAnalytics();
  
  // Use real data or fallback
  const viewsPercentage = analytics?.viewsPercentage || 0;
  const gradientEnd = viewsPercentage;

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-border">
      <CardContent className="pt-2">
        <div className="flex items-center justify-center">
          <div className="relative w-56 h-56">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${SECONDARY} 0 ${gradientEnd}%, ${PRIMARY} ${gradientEnd}% 100%)`,
                boxShadow: '0 0 0 8px rgba(46,65,102,0.08)',
              }}
            />
            <div className="absolute inset-[22%] rounded-full bg-white" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{viewsPercentage}%</p>
                <p className="text-xs text-muted-foreground">مشاهدات</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

### 3. **📊 Percentage Calculation Issue**

#### **Current Problem:**
```typescript
// Static hardcoded denominator of 200
percent={(dashboardData.kpis.totalProperties / 200) * 100}
```

#### **Solution:**
```typescript
// 1. Add total capacity to API response or calculate it
const useCapacityData = () => {
  const [capacityData, setCapacityData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCapacityData = async () => {
      try {
        // Get user's residences
        const residences = await api.get(`/residence/user/${user.id}`);
        
        // Calculate total capacity (sum of all bed counts)
        const totalCapacity = residences?.reduce((sum, residence) => 
          sum + (residence.bed_count || 0), 0) || 0;
        
        // Calculate total properties
        const totalProperties = residences?.length || 0;
        
        setCapacityData({
          totalCapacity,
          totalProperties,
          percentage: totalCapacity > 0 ? 
            Math.min(100, (totalProperties / totalCapacity) * 100) : 0
        });
      } catch (error) {
        console.error('Failed to fetch capacity data:', error);
      }
    };

    if (user?.id) {
      fetchCapacityData();
    }
  }, [user?.id]);

  return capacityData;
};

// 2. Update Dashboard component
const Dashboard: React.FC = () => {
  const capacityData = useCapacityData();
  
  return (
    <TotalAssetsCard 
      count={capacityData?.totalProperties || 0} 
      percent={capacityData?.percentage || 0} 
      className="h-full p-0" 
    />
  );
};
```

---

### 4. **📈 Chart Fallback Data Issue**

#### **Current Problem:**
```typescript
// Static fallback data
if (!dashboardData?.monthlyAnalytics) return [18, 42, 24, 33, 50, 28, 41, 22, 16, 44, 52, 35];
```

#### **Solution:**
```typescript
// 1. Update the barValues calculation
const barValues = useMemo(() => {
  if (!dashboardData?.monthlyAnalytics) {
    // Return empty array instead of fake data
    return new Array(12).fill(0);
  }
  
  // Create array for 12 months, filling with 0 for missing months
  const monthlyData = new Array(12).fill(0);
  
  dashboardData.monthlyAnalytics.forEach(analytics => {
    const monthIndex = parseInt(analytics.month_year.split('-')[1]) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyData[monthIndex] = Math.min(100, (analytics.total_amount / 1000));
    }
  });
  
  return monthlyData;
}, [dashboardData?.monthlyAnalytics]);

// 2. Handle empty state in UI
const maxVal = useMemo(() => {
  const max = Math.max(...barValues);
  return max > 0 ? max : 100; // Use 100 as default if no data
}, [barValues]);
```

---

## 🔧 **Complete Implementation Example**

### **Updated Dashboard Component:**

```typescript
import React, { useMemo, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useDashboard } from '@/hooks/useDashboard';
import { api } from '@/api/api';

// Custom hooks for additional data
const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (user?.role === 'property-owner') {
          const response = await api.get('/customers/me');
          setUserDetails(response);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  return userDetails;
};

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const residences = await api.get(`/residence/user/${user.id}`);
        const bookings = await api.get('/bookings/by/user');
        
        const totalResidences = residences?.length || 0;
        const viewedResidences = bookings?.length || 0;
        const viewsPercentage = totalResidences > 0 ? 
          Math.round((viewedResidences / totalResidences) * 100) : 0;

        setAnalytics({
          viewsPercentage,
          totalResidences,
          viewedResidences
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    if (user?.id) {
      fetchAnalytics();
    }
  }, [user?.id]);

  return analytics;
};

const Dashboard: React.FC = () => {
  const { data: dashboardData, loading, error } = useDashboard();
  const { user } = useAuth();
  const userDetails = useUserDetails();
  const analytics = useAnalytics();
  
  // Get display name
  const displayName = userDetails?.responsible_person || 
                     userDetails?.company_name || 
                     user?.email || 
                     'مستخدم';

  // Use real analytics data
  const viewsPercentage = analytics?.viewsPercentage || 0;
  const gradientEnd = viewsPercentage;

  // Updated bar values (no fake fallback)
  const barValues = useMemo(() => {
    if (!dashboardData?.monthlyAnalytics) {
      return new Array(12).fill(0);
    }
    
    const monthlyData = new Array(12).fill(0);
    dashboardData.monthlyAnalytics.forEach(analytics => {
      const monthIndex = parseInt(analytics.month_year.split('-')[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex] = Math.min(100, (analytics.total_amount / 1000));
      }
    });
    
    return monthlyData;
  }, [dashboardData?.monthlyAnalytics]);

  const maxVal = useMemo(() => {
    const max = Math.max(...barValues);
    return max > 0 ? max : 100;
  }, [barValues]);

  return (
    <DashboardLayout 
      title="لوحة التحكم" 
      subtitle={`مرحباً، ${displayName}`}
    >
      <div dir="rtl" className="space-y-8">
        {/* KPI Cards with real data */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <TotalAssetsCard 
              count={dashboardData?.kpis.totalProperties || 0} 
              percent={analytics?.percentage || 0} 
              className="h-full p-0" 
            />
          </div>
          
          <KpiMiniCard
            value={`ر.س ${(dashboardData?.kpis.monthlyRevenue || 0).toLocaleString()}`}
            label="الإيرادات الشهرية"
            icon={<Banknote className="w-7 h-7" />}
          />
          
          <KpiMiniCard
            value={dashboardData?.kpis.activeBookings?.toString() || "0"}
            label="الحجوزات النشطة"
            icon={<Calendar className="w-7 h-7" />}
          />
        </div>

        {/* Revenue Chart with real data */}
        <Card className="bg-white rounded-2xl shadow-sm border border-border">
          <CardContent className="p-6">
            {/* ... existing chart code ... */}
          </CardContent>
        </Card>

        {/* Pie Chart with real data */}
        <Card className="bg-white rounded-2xl shadow-sm border border-border">
          <CardContent className="pt-2">
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${SECONDARY} 0 ${gradientEnd}%, ${PRIMARY} ${gradientEnd}% 100%)`,
                    boxShadow: '0 0 0 8px rgba(46,65,102,0.08)',
                  }}
                />
                <div className="absolute inset-[22%] rounded-full bg-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{viewsPercentage}%</p>
                    <p className="text-xs text-muted-foreground">مشاهدات</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
```

---

## 📋 **API Endpoints Summary**

### **Available Endpoints for Dashboard Data:**

| Data Type | Endpoint | Method | Purpose |
|-----------|----------|---------|---------|
| **User Details** | `/customers/me` | GET | Get current user information |
| **User Residences** | `/residence/user/{user_id}` | GET | Get user's properties |
| **User Bookings** | `/bookings/by/user` | GET | Get user's bookings |
| **Monthly Analytics** | `/bookings/me/monthly-analytics` | GET | Get revenue analytics |
| **All Residences** | `/residence/approved_residences` | GET | Get all approved residences |

### **Missing Endpoints (Need Backend Implementation):**

| Data Type | Suggested Endpoint | Purpose |
|-----------|-------------------|---------|
| **User Profile** | `/users/me` | Get complete user profile |
| **Analytics** | `/analytics/views` | Get views/engagement data |
| **Capacity** | `/residence/capacity` | Get total capacity data |

---

## 🚀 **Implementation Steps**

1. **Create custom hooks** for each data type
2. **Update Dashboard component** to use real data
3. **Handle loading states** properly
4. **Add error handling** for failed API calls
5. **Test with real data** from your backend
6. **Remove all static fallback data**

This approach will give you a fully dynamic dashboard that displays real data from your backend! 🎯

