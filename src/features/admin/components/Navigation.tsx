
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Building, BarChart3, Menu, X, CalendarCheck, Mail, UserCog, LogOut } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

const navigationItems = [
  { to: "/admin/dashboard", icon: Home, labelKey: "nav.dashboard" },
  { to: "/admin/users", icon: Users, labelKey: "nav.users" },
  { to: "/admin/properties", icon: Building, labelKey: "nav.properties" },
  { to: "/admin/bookings", icon: CalendarCheck, labelKey: "nav.bookings" },
  { to: "/admin/special-request", icon: Mail, labelKey: "nav.special_request" },
  { to: "/admin/agents", icon: UserCog, labelKey: "nav.agents" },
];

export const Navigation: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dircetion = localStorage.getItem("lang");

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <nav className="hidden lg:flex justify-between flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border p-fluid-md bg-white shadow-lg z-40 ">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors gap-2 mt-4 mb-4",
                  isActive
                    ? "bg-primary text-[#DDD4BA]"
                    : "text-primary text-base font-medium hover:bg-muted hover:text-foreground "
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>
        <Button variant="ghost" onClick={logout} className="text-destructive border border-red-100">
          <LogOut className="h-4 w-4 " />
          <span className='hidden md:block'> {t('auth.logout')}</span>
        </Button>
      </nav>

      {/* ===== Mobile Header Menu Button ===== */}
      <button
        onClick={toggleMenu}
        className={`lg:hidden fixed top-3 ${dircetion === "ar" ? "left-2" : "right-2"} z-50 bg-white border border-gray-200 rounded-sm p-2 shadow-sm`}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* ===== Mobile Sidebar Drawer ===== */}
      <div
        className={cn(
          "flex flex-col justify-between lg:hidden fixed top-0 h-full w-64 bg-white shadow-xl border-border transform transition-transform duration-300 z-40 p-4 pt-20",
          dircetion === "ar"
            ? isOpen
              ? "right-0"
              : "translate-x-full"
            : isOpen
              ? "left-0"
              : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold"></h2>
          <button onClick={toggleMenu} className="text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors gap-2",
                  isActive
                    ? "bg-primary text-[#DDD4BA]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex-1 flex items-end">
          <Button variant="ghost" onClick={logout} className="text-destructive border border-red-100 hover:bg-red-200 w-full">
            <LogOut className="h-4 w-4 " />
            <span className=''>تسجيل الخروج</span>
          </Button>
        </div>
        
      </div>

      {/* ===== Overlay when sidebar open ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};


