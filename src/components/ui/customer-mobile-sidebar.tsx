import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Calendar,
  LayoutDashboard,
  Settings,
  User,
  Search as SearchIcon,
  
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';

interface CustomerMobileSidebarProps {
  className?: string;
}

const CustomerMobileSidebar: React.FC<CustomerMobileSidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const { t , i18n } = useTranslation();
  const isLang = i18n.language === 'ar';

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Special handling for dashboard - should be active for dashboard-customer and root dashboard
    if (path === '/dashboard-customer') {
      return currentPath === '/dashboard-customer' || 
             currentPath === '/customer-dashboard-test' ||
             currentPath === '/dashboard' ||
             currentPath === '/';
    }
    
    // For other routes, check exact match or if it starts with the path
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };


  // Language detection (you can replace this with your i18n system)
  const isRTL = i18n.language === 'ar'; // For now, defaulting to RTL for Arabic
  const direction = isRTL ? 'rtl' : 'ltr';
  const side = isRTL ? 'right' : 'left';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "lg:hidden touch-target absolute top-[14%]",
            isRTL ? "left-0" : "right-0",
            className
          )}
          // className={cn("lg:hidden touch-target absolute top-[14%]", isLang ? "left-0" : "right-0" ,  className)}
          aria-label="فتح القائمة"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side={side}  className="w-80 p-0 bg-white" aria-describedby="customer-mobile-sidebar-description" >
        <div className="sr-only" id="customer-mobile-sidebar-description">
          Customer dashboard navigation sidebar for mobile devices
        </div>
        <div className="flex flex-col h-full bg-white" >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="touch-target"
            >
              <X className="h-5 w-5" />
            </Button> */}
          </div>

          {/* scrollable body */}
          <div className="flex grow flex-col overflow-y-auto pb-6 "  >
            {/* ===== Main nav ===== */}
            <nav className="flex flex-col gap-2 px-4 mt-2" >
              {/* لوحة التحكم */}
              <NavLink
                to="/dashboard-customer"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  isActive
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166] hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_sidebar_dashboard')}</span>
              </NavLink>
            </nav>

            {/* divider */}
            <div className="my-5 border-b border-border" />

            {/* ===== إدارة الحجوزات (header aligned with items) ===== */}
            <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2">
              {t('customer_sidebar_mangeBooking')}
            </p>

            <div className="flex flex-col gap-2 px-4">
              <NavLink
                to="/customer-properties"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  isActive
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166] hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                <SearchIcon className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate"> {t('customer_Properties_search')} </span>
              </NavLink>

              <NavLink
                to="/customer-bookings"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  isActive
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166] hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_sidebar_booking')}</span>
              </NavLink>
            </div>

            {/* ______________________________________ */}
            {/* <div className="my-5 border-b border-[#E9E9E9]" />
            <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2 ">
                {t('residential_management')}
            </p>

            <Link
                to="/residential-management"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition mx-4 ${
                  isActive('/residential-management')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <ClipboardMinusIcon className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('residential_reports')}</span>
              </Link> */}
            {/* ______________________________________ */}    



            {/* divider */}
            <div className="my-5 border-b border-border" />

            {/* ===== إدارة الحساب (header aligned with items) ===== */}
            <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2 ">
               {t('customer_manage_account')}
            </p>

            <div className="flex flex-col gap-2 px-4">
              <NavLink
                to="/account"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  isActive
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166] hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_myAccount')}</span>
              </NavLink>

              <NavLink
                to="/settings-customer"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                  isActive
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166] hover:bg-muted'
                )}
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_setting_account')} </span>
              </NavLink>
            </div>

            {/* ===== Profile completion ===== */}
            {/* <div className="mt-6 px-4">
              <div className="flex items-center justify-start mb-2">
                <span className="text-[#2E4166] font-semibold">82%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-2 rounded-full bg-[#D9C690]" style={{ width: '82%' }} />
              </div>
              <p className="text-xs text-[#2E4166]/70 mt-2 ">{t('complete_account_Percentage')}</p>
            </div> */}

            {/* push footer to bottom */}
            <div className="mt-auto" />

            {/* ===== Logout (non-overlapping, bottom) ===== */}
            <div className="px-4 pt-6">
              <div 
                className="flex items-center gap-3"
                onClick={handleLogout}
              >
                <button
                  className="w-12 h-12 rounded-full bg-[#2E4166] text-white flex items-center justify-center shadow-md hover:opacity-90 transition"
                  aria-label="تسجيل الخروج"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                </button>
                <span className="text-[#2E4166] font-medium">{t('logout')}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerMobileSidebar;
