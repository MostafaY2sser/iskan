import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Building2, 
  Home, 
  Plus, 
  Calendar, 
  User, 
  Settings, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  ChevronsRight,
  ChevronsLeft
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed = false, 
  onToggle,
  className 
}) => {
  const { direction } = useDirection();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Enhanced active state detection
  const isActiveRoute = (href: string) => {
    const currentPath = location.pathname;
    
    // Special handling for dashboard - should be active for dashboard and root
    if (href === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    
    // For other routes, check exact match or if it starts with the href
    return currentPath === href || currentPath.startsWith(href + '/');
  };

  const menuItems = [
    {
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
      href: '/dashboard',
      active: isActiveRoute('/dashboard')
    },
    {
      label: 'الرسائل',
      icon: MessageSquare,
      href: '/messages',
      badge: 3,
      active: isActiveRoute('/messages')
    },
    {
      label: 'إدارة قائمة العقارات',
      icon: Building2,
      href: '/properties',
      active: isActiveRoute('/properties')
    },
    {
      label: 'العقارات',
      icon: Home,
      href: '/properties',
      active: isActiveRoute('/properties')
    },
    {
      label: 'إضافة عقار جديد',
      icon: Plus,
      href: '/properties/new',
      active: isActiveRoute('/properties/new')
    },
    {
      label: 'الحجوزات',
      icon: Calendar,
      href: '/bookings',
      active: isActiveRoute('/bookings')
    },
    {
      label: 'إدارة الحساب',
      icon: User,
      href: '/account',
      active: isActiveRoute('/account')
    },
    {
      label: 'حسابي',
      icon: User,
      href: '/account',
      active: isActiveRoute('/account')
    },
    {
      label: 'إعدادات الحساب',
      icon: Settings,
      href: '/settings',
      active: isActiveRoute('/settings')
    },
    {
      label: 'تقارير المساكن',
      icon: BarChart3,
      href: '/reports',
      active: isActiveRoute('/reports')
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GRH</span>
            </div>
            <span className="font-semibold text-gray-900">لوحة التحكم</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2 hover:bg-gray-100"
        >
          {collapsed ? (
            direction === 'rtl' ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />
          ) : (
            direction === 'rtl' ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                isActive
                  ? "bg-blue-600 text-white shadow-md transform scale-[1.02] border-r-4 border-blue-800"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:transform hover:scale-[1.01]"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"
                  )} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActive ? "secondary" : "destructive"} 
                          className={cn(
                            "text-xs font-bold",
                            isActive 
                              ? "bg-white text-blue-600 border-blue-200" 
                              : "bg-red-500 text-white"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {/* Active indicator - vertical bar on the left edge for RTL */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Progress Widget */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">نسبة اكتمال الملف الشخصي</span>
              <span className="text-sm font-bold text-blue-600">82%</span>
            </div>
            <Progress value={82} className="h-2 mb-3" />
            <div className="text-xs text-gray-600">
              أكمل ملفك الشخصي للحصول على أفضل تجربة
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 right-4 z-50 rtl:right-auto rtl:left-4"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block fixed top-0 h-full z-40 transition-all duration-300",
        direction === 'rtl' ? 'right-0' : 'left-0',
        collapsed ? 'w-20' : 'w-72',
        className
      )}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className={cn(
            "fixed top-0 h-full w-72 bg-white shadow-xl",
            direction === 'rtl' ? 'right-0' : 'left-0'
          )}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
