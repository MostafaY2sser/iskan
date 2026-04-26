

import React, { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Lock, User, Building2, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { getLanguageByCode, languages } from "@/i18n/languages";
import { toast } from "sonner";

interface MobileMenuProps {
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const isRTL = i18n.language === "ar";

  const { isAuthenticated, user, logout } = useAuth();

  const [currentLanguage, setCurrentLanguage] = useState(
    getLanguageByCode(i18n.language) || languages[0]
  );


  //  Smooth Scroll (same as Navigation) :-------------------------------------
  const scrollToSection = useCallback(
    (id: string) => {
      setIsOpen(false);

      if (location.pathname === "/") {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(`/#${id}`);
      }
    },
    [location.pathname, navigate]
  );
  //  Smooth Scroll (same as Navigation) :-------------------------------------


  // Language :--------------------------------------
  const handleLanguageChange = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      const lang = getLanguageByCode(code);
      if (lang) setCurrentLanguage(lang);

      toast.success(t("language_changed_successfully"));
    } catch {
      toast.error(t("language_change_error"));
    }
  };
  // Language // Language :--------------------------------------


  //  Navigation Items (clean) // Language :--------------------------------------
  const navItems = [
    { id: "hero", label: t("nav.home") },
    { id: "about", label: t("nav.about") },
    { id: "how-it-works", label: t("nav.howItWorks") },
    { id: "news", type: "page", path: "/news", label: t("nav.news") },
    { id: "popular-questions", label: t("nav.faq") },
    { id: "contact", type: "page", path: "/contact", label: t("nav.contact") },
  ];
  //  Navigation Items (clean) // Language :--------------------------------------


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden border", className)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Content */}
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="w-80 p-0"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <img src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" className="h-8" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            {navItems.map((item) => {
              // Page navigation
              if (item.type === "page") {
                return (
                  <Link
                    key={item.label}
                    to={item.path!}
                    onClick={() => setIsOpen(false)}
                    className="mobile-nav-item"
                  >
                    {item.label}
                  </Link>
                );
              }

              // Section navigation
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="mobile-nav-item w-full text-start"
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="p-4 border-t space-y-3">
            {isAuthenticated ? (
              <>
                {/* User */}
                <div className="flex items-center justify-center gap-2 bg-muted/50 p-2 rounded">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>

                {/* Dashboard */}
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
                    <Building2 className="w-4 h-4 mr-2" />
                    {t("nav.dashboard")}
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full mb-2">
                    <Lock className="w-4 h-4 mr-2" />
                    {t("nav.login")}
                  </Button>
                </Link>

                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
                    {t("nav.joinNow")}
                  </Button>
                </Link>
              </>
            )}

            {/* Language */}
            <Select
              value={currentLanguage.code}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;