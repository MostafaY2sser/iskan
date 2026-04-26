import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { GuestRoute } from '@/shared/components/GuestRoute';
import { DashboardGuard } from '@/shared/components/DashboardGuard';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import SpecialRequest from '@/features/admin/pages/SpecialRequest';
import SpecialRequestDetails from '@/features/admin/pages/SpecialRequestDetails';
import Agents from '@/features/admin/pages/Agents';
import AgentDetails from '@/features/admin/pages/AgentDetails';
import ResidenceDetailsDialog from '@/components/dashboard/ResidenceDetailsDialog';
import BookingDetails from '@/features/admin/pages/BookingDetails';
import ResidentialManagement from '@/pages/ResidentialManagement';
import OwnerDetails from '@/features/admin/pages/OwnerDetails';
import CustomerDetails from '@/features/admin/pages/CustomerDetails';
import CustomerNotifications from '@/pages/CustomerNotifications';
import OwnerNotifications from '@/pages/OwnerNotifications';
import AdminNotifications from '@/features/admin/pages/AdminNotifications';

// Lazy-loaded layouts
const AdminLayout = React.lazy(() => import('@/features/admin/layouts/AdminLayout'));
const PropertyOwnerLayout = React.lazy(() => import('@/features/property-owner/layouts/PropertyOwnerLayout'));
const RecruitingLayout = React.lazy(() => import('@/features/recruiting/layouts/RecruitingLayout'));

// Lazy-loaded pages
const AppLayout = React.lazy(() => import('@/layouts/AppLayout'));
const DashboardLayout = React.lazy(() => import('@/layouts/DashboardLayout'));
const Index = React.lazy(() => import('@/pages/Index'));
const Messages = React.lazy(() => import('@/pages/Messages'));
const NewsListPage = React.lazy(() => import('@/pages/NewsListPage'));
const NewsDetailPage = React.lazy(() => import('@/pages/NewsDetailPage'));
const FAQPage = React.lazy(() => import('@/pages/FAQPage'));
const Contact = React.lazy(() => import('@/pages/Contact'));
// const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const DashboardRouter = React.lazy(() => import('@/components/DashboardRouter'));
const Bookings = React.lazy(() => import('@/pages/Bookings'));

// New Dashboard Pages
const PropertiesPage = React.lazy(() => import('@/pages/PropertiesPage'));
const MessagesPage = React.lazy(() => import('@/pages/MessagesPage'));
const BookingsPage = React.lazy(() => import('@/pages/BookingsPage'));
const BookingDetailsPage = React.lazy(() => import('@/pages/BookingDetailsPage'));
const AccountPage = React.lazy(() => import('@/pages/AccountPage'));
const CustomerAccountPage = React.lazy(() => import('@/pages/CustomerAccountPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const CustomerDashboardLayoutNew = React.lazy(() => import('@/layouts/CustomerDashboardLayoutNew'));
const CustomerBookingsPage = React.lazy(() => import('@/pages/CustomerBookingsPage'));
const CustomerPropertiesPage = React.lazy(() => import('@/pages/CustomerPropertiesPage'));
const CustomerDashboardNew = React.lazy(() => import('@/pages/CustomerDashboardNew'));
const ResidenceDetailsPage = React.lazy(() => import('@/pages/ResidenceDetailsPage'));
const Login = React.lazy(() => import('@/pages/Login'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const PropertyOwnerSignup = React.lazy(() => import('@/pages/PropertyOwnerSignup'));
const PropertyOwnerDocuments = React.lazy(() => import('@/pages/PropertyOwnerDocuments'));
const PropertyOwnerSuccess = React.lazy(() => import('@/pages/PropertyOwnerSuccess'));
const BrokerSignup = React.lazy(() => import('@/pages/BrokerSignup'));
const BrokerDocuments = React.lazy(() => import('@/pages/BrokerDocuments'));
const BrokerSuccess = React.lazy(() => import('@/pages/BrokerSuccess'));
const CompanySignupStep2 = React.lazy(() => import('@/pages/CompanySignupStep2'));
const CompanySignupStep3 = React.lazy(() => import('@/pages/CompanySignupStep3'));
const CompanySuccess = React.lazy(() => import('@/pages/CompanySuccess'));
const UploadDocuments = React.lazy(() => import('@/pages/UploadDocuments'));
const AdminDashboard = React.lazy(() => import('@/features/admin/pages/Dashboard'));
const AdminUsers = React.lazy(() => import('@/features/admin/pages/Users'));
const AdminProperties = React.lazy(() => import('@/features/admin/pages/Properties'));
const AdminBookings = React.lazy(() => import('@/features/admin/pages/Bookings'));
const PropertyDetail = React.lazy(() => import('@/features/admin/pages/PropertyDetail'));
const PropertyOwnerDashboard = React.lazy(() => import('@/features/property-owner/pages/Dashboard'));
const PropertyOwnerProperties = React.lazy(() => import('@/features/property-owner/pages/Properties'));
const RecruitingDashboard = React.lazy(() => import('@/features/recruiting/pages/Dashboard'));
const RecruitingPlacements = React.lazy(() => import('@/features/recruiting/pages/Placements'));
const AddResidence = React.lazy(() => import('@/pages/AddResidence'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Navigate to="/home" replace />
          </Suspense>
        ),
      },
      {
        path: 'home',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Index />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestRoute>
              <Login />
            </GuestRoute>
          </Suspense>
        ),
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GuestRoute>
              <Signup />
            </GuestRoute>
          </Suspense>
        ),
      },
      {
        path: 'signup/property-owner',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PropertyOwnerSignup />
          </Suspense>
        ),
      },
      {
        path: 'signup/property-owner/documents',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PropertyOwnerDocuments />
          </Suspense>
        ),
      },
      {
        path: 'signup/property-owner/success',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PropertyOwnerSuccess />
          </Suspense>
        ),
      },
      {
        path: 'signup/broker',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BrokerSignup />
          </Suspense>
        ),
      },
      {
        path: 'signup/broker/documents',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BrokerDocuments />
          </Suspense>
        ),
      },
      {
        path: 'signup/broker/success',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BrokerSuccess />
          </Suspense>
        ),
      },
      {
        path: 'signup/company/step2',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CompanySignupStep2 />
          </Suspense>
        ),
      },
      {
        path: 'signup/company/step3',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            {/* <ProtectedRoute> */}
              <CompanySignupStep3 />
            {/* </ProtectedRoute> */}
          </Suspense>
        ),
      },
      {
        path: 'signup/company/success',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CompanySuccess />
          </Suspense>
        ),
      },
      {
        path: 'upload-documents',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <UploadDocuments />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'news',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NewsListPage />
          </Suspense>
        ),
      },
      {
        path: 'news/:slug',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NewsDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <FAQPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardGuard>
                <DashboardRouter />
              </DashboardGuard>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'dashboard-customer',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardNew />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'properties',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="العقارات" subtitle="إدارة العقارات">
                <PropertiesPage />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'properties/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="تفاصيل العقار">
                <ResidenceDetailsDialog />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="الرسائل" subtitle="إدارة الرسائل والمحادثات">
                <MessagesPage />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'bookings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="الحجوزات" subtitle="إدارة حجوزاتك">
                <BookingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'booking/:bookingId',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              {/* <CustomerDashboardLayoutNew title="تفاصيل الحجز" subtitle="إدارة حجوزاتك"> */}
                <BookingDetailsPage />
              {/* </CustomerDashboardLayoutNew> */}
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'customer-notifications',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="الاشعارات" subtitle="عرض جميع الاشعارات لديك">
                <CustomerNotifications />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'account',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="حسابي" subtitle="إدارة معلومات الحساب">
                {/* <AccountPage /> */}
                <CustomerAccountPage />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="حسابي" subtitle="إدارة معلومات الحساب">
                <AccountPage />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'customer-account',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="حساب العميل" subtitle="إدارة حساب العميل">
                <CustomerAccountPage />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="إعدادات الحساب" subtitle="إعدادات الحساب والمنصة">
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardLayout title="الاشعارات" subtitle="عرض جميع الاشعارات لديك">
                <OwnerNotifications />
              </DashboardLayout>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'settings-customer',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="الإعدادات" subtitle="إعدادات الحساب والمنصة">
                <SettingsPage />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'customer-bookings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="حجوزاتي" subtitle="إدارة حجوزاتك">
                <CustomerBookingsPage />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'residential-management',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="تقارير المساكن" subtitle="إدارة المساكن">
                <ResidentialManagement />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'customer-properties',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CustomerDashboardLayoutNew title="البحث عن العقارات" subtitle="تصفح واختيار العقارات">
                <CustomerPropertiesPage />
              </CustomerDashboardLayoutNew>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'residence/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <ResidenceDetailsPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'add-residence',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashboardGuard>
                <AddResidence />
              </DashboardGuard>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      
      {
        path: 'bookings',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'properties/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <PropertyDetail />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { 
            path: 'dashboard', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            ) 
          },
          { 
            path: 'users', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminUsers />
              </Suspense>
            ) 
          },
          { 
            path: 'owner-details/:id', 
            element: (
               <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute allowedRoles={['admin']}>
                  <OwnerDetails />
                </ProtectedRoute>
              </Suspense>
            ) 
          },
          { 
            path: 'customer-details/:id', 
            element: (
               <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute allowedRoles={['admin']}>
                  <CustomerDetails />
                </ProtectedRoute>
              </Suspense>
            ) 
          },
          { 
            path: 'properties', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminProperties />
              </Suspense>
            ) 
          },
          {
            path: 'properties/:id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute allowedRoles={['admin']}>
                  <PropertyDetail />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          { 
            path: 'bookings', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminBookings />
              </Suspense>
            ) 
          },
          { 
            path: 'bookings/:id', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <BookingDetails />
              </Suspense>
            ) 
          },
          { 
            path: 'special-request', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <SpecialRequest />
              </Suspense>
            ) 
          },
          {
            path: 'special-request/:id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute allowedRoles={['admin']}>
                  <SpecialRequestDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: 'admin-notifications',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminNotifications  />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          { 
            path: 'agents', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Agents />
              </Suspense>
            ) 
          },
          {
            path: 'agents/:id',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute allowedRoles={['admin']}>
                  <AgentDetails />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'property-owner',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute allowedRoles={['property-owner']}>
              <PropertyOwnerLayout />
            </ProtectedRoute>
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="/property-owner/dashboard" replace /> },
          { 
            path: 'dashboard', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PropertyOwnerDashboard />
              </Suspense>
            ) 
          },
          { 
            path: 'properties', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <PropertyOwnerProperties />
              </Suspense>
            ) 
          },
        ],
      },
      {
        path: 'recruiting',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute allowedRoles={['recruiting-company']}>
              <RecruitingLayout />
            </ProtectedRoute>
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="/recruiting/dashboard" replace /> },
          { 
            path: 'dashboard', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <RecruitingDashboard />
              </Suspense>
            ) 
          },
          { 
            path: 'placements', 
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <RecruitingPlacements />
              </Suspense>
            ) 
          },
        ],
      },
      {
        path: 'unauthorized',
        element: (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
              <p className="text-muted-foreground">You don't have permission to access this resource.</p>
            </div>
          </div>
        ),
      },
      {
        path: '*',
        element: (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
            </div>
          </div>
        ),
      },
    ],
  },
]);