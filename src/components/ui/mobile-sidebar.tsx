import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getLanguageByCode, languages } from '@/i18n/languages';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Plus,
  Mail,
  Home,
  Calendar,
  LayoutDashboard,
  Settings,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
// import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface MobileSidebarProps {
  className?: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // const { analytics, loading: analyticsLoading } = useAnalytics();
  const [isOpen, setIsOpen] = React.useState(false);
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Special handling for dashboard - should be active for dashboard and root
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    
    // For other routes, check exact match or if it starts with the path
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Determine if user is a customer
  const isCustomer = user?.user_type === 'customer';


  // _________________________________________________________________________________
    const [currentLanguage, setCurrentLanguage] = useState(
      getLanguageByCode(i18n.language) || languages[0]
    );
  
    const handleLanguageChange = async (languageCode: string) => {
      try {
        await i18n.changeLanguage(languageCode);
        const newLanguage = getLanguageByCode(languageCode);
        if (newLanguage) {
          setCurrentLanguage(newLanguage);
          toast.success(t('language_changed_successfully', 'تم تغيير اللغة بنجاح'));
        }
      } catch (error) {
        console.error('Error changing language:', error);
        toast.error(t('language_change_error', 'حدث خطأ في تغيير اللغة'));
      }
    };
    // _________________________________________________________________________________

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className={` absolute top-2  ${isRTL ? 'left-0' : 'right-0'}`}> 
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("lg:hidden touch-target" , className)}
          aria-label="فتح القائمة"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0" dir="rtl" aria-describedby="mobile-sidebar-description">
        <div className="sr-only" id="mobile-sidebar-description">
          Dashboard navigation sidebar for mobile devices
        </div>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-fluid-md border-b border-border">
            <div className="text-primary font-bold text-xl">GRH</div>
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="touch-target"
            >
              <X className="h-5 w-5" />
            </Button> */}
          </div>


          {/* Navigation */}
          <nav className="flex-1 px-fluid-md space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => cn(
                "flex items-center justify-normal w-full px-3 py-2 mt-4 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                isActive
                  ? "bg-primary text-white shadow-md transform scale-[1.02]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-gray-600"
                  )} />
                  <span className="mr-3 ">{t('customer_sidebar_dashboard')}</span>
                </>
              )}
            </NavLink>
            
            
            <div className="py-2">
              <div className="border-b border-border" />
            </div>
            
            {isCustomer ? (
              // Customer-specific menu
              <>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right px-3 py-2">
                  إدارة قائمة العقارات
                </p>
                
                <NavLink
                  to="/properties"
                  className={({ isActive }) => cn(
                    "flex items-center justify-end w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                    isActive
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <span className="mr-3">البحث عن العقارات</span>
                      <Home className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-gray-600"
                      )} />
                    </>
                  )}
                </NavLink>
                
                <NavLink
                  to="/bookings"
                  className={({ isActive }) => cn(
                    "flex items-center justify-end w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                    isActive
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <span className="mr-3">حجوزاتي</span>
                      <Calendar className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-gray-600"
                      )} />
                    </>
                  )}
                </NavLink>
                
                <div className="py-2">
                  <div className="border-b border-border" />
                </div>
                
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right px-3 py-2">
                  إدارة المساكن
                </p>
                
                <Button 
                  variant={location.pathname === '/residence-reports' ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-end touch-target",
                    location.pathname === '/residence-reports' && 'bg-primary text-white hover:bg-primary/90'
                  )}
                  onClick={() => {
                    navigate('/residence-reports');
                    setIsOpen(false);
                  }}
                >
                  <span className="mr-3">تقارير المساكن</span>
                  <User className="w-5 h-5" />
                </Button>
              </>
            ) : (
              // Property owner/residence company menu
              <>
                <p className="text-xs font-semibold text-muted-foreground  tracking-wide text-right px-3 py-2">
                  {t('customer_manage_property')}
                </p>
                
                <NavLink
                  to="/properties"
                  className={({ isActive }) => cn(
                    "flex items-center justify-normal w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                    isActive
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Home className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-gray-600"
                      )} />
                      <span className="mr-3">{t('properties')}</span>
                    </>
                  )}
                </NavLink>
                
                <NavLink
                  to="/add-residence"
                  className={({ isActive }) => cn(
                    "flex items-center justify-normal w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                    isActive
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Plus className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-gray-600"
                      )} />
                      <span className="mr-3">{t('add_new_property')}</span>
                    </>
                  )}
                </NavLink>
                
                
                <NavLink
                  to="/bookings"
                  className={({ isActive }) => cn(
                    "flex items-center justify-normal w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                    isActive
                      ? "bg-primary text-white shadow-md transform scale-[1.02]"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <Calendar className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-gray-600"
                      )} />
                      <span className="mr-3">{t('bookings')}</span>
                    </>
                  )}
                </NavLink>
              </>
            )}
            
            <div className="py-2">
              <div className="border-b border-border" />
            </div>
            
            <p className="text-xs font-semibold text-muted-foreground  tracking-wide text-right px-3 py-2">
             {t('customer_manage_account')}
            </p>
            
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "flex items-center justify-normal w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                isActive
                  ? "bg-primary text-white shadow-md transform scale-[1.02]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <User className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-gray-600"
                  )} />
                  <span className="mr-3">{t('customer_myAccount')}</span>
                </>
              )}
            </NavLink>
            
            <NavLink
              to="/settings"
              className={({ isActive }) => cn(
                "flex items-center justify-normal w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-target",
                isActive
                  ? "bg-primary text-white shadow-md transform scale-[1.02]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Settings className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-gray-600"
                  )} />
                  <span className="mr-3"> {t('customer_setting_account')}</span>
                </>
              )}
            </NavLink>
          </nav>

          {/* Profile Completion */}
          <div className="p-fluid-md border-t border-border">
            
            <Select value={currentLanguage.code} onValueChange={handleLanguageChange}  >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center sm:gap-2 ">
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="w-full touch-target mt-4"
              onClick={handleLogout}
            >
             {t('logout')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;