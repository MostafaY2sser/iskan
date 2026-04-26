

import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Building2, LogOut } from "lucide-react";
import MobileMenu from "@/components/ui/mobile-menu";
import { useAuth } from "@/providers/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getLanguageByCode, languages } from "@/i18n/languages";
import { toast } from "sonner";

const sections = [
  "hero",
  "about",
  "how-it-works",
  "news",
  "popular-questions",
  "contact",
];

const Navigation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("hero");
  const isRTL = i18n.language === "ar";

  const { isAuthenticated, logout } = useAuth();

  const hideHeader =
    location.pathname.startsWith("/residence/") ||
    location.pathname.startsWith("/residential-management") ||
    location.pathname.startsWith("/customer-notifications") ||
    location.pathname.startsWith("/notifications");

  const [currentLanguage, setCurrentLanguage] = useState(
    getLanguageByCode(i18n.language) || languages[0]
  );


  //  Smooth Scroll Handler :-----------------------------------------
  const scrollToSection = useCallback(
    (id: string) => {
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


  // Handle Hash after navigation :-----------------------------------------
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);


  // Active Section on Scroll :-----------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;

        if (
          scrollPosition >= el.offsetTop &&
          scrollPosition < el.offsetTop + el.offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (section: string) => activeSection === section;

  
  
  // Language Change  :-----------------------------------------
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


  // Nav Item Component  :-----------------------------------------
  const NavItem = ({id, label, }: { id: string; label: string; }) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`text-sm lg:text-base pb-1 transition ${
        isActive(id)
          ? ""
          : " hover:border-[#DDD4BA]"
      }`}
      style={{ color: "#2E4166", fontFamily: "IBM Plex Sans Arabic" }}
    >
      {label}
    </button>
  );

  return (
    <nav 
       className={` navHeader ${hideHeader ? 'hidden' : ''}   bg-white border-b border-border py-2 sm:py-3 lg:py-4 px-0 sm:px-6 lg:px-8 sticky top-0 z-50`}
       dir={isRTL ? 'rtl' : 'ltr'}
     >
       <div className="flex items-center justify-between responsive-container">
         <div className={`flex items-center md:hidden ${isRTL ? 'order-3' : 'order-1'}`}>
           <MobileMenu />
         </div>

        {/* Logo */}
        <div className={`flex items-center gap-3 `}>
           <Link to="/home" className="flex items-center gap-2 ">
             <img 
               src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
               alt="GRH"
               className="h-8 sm:h-10 lg:h-12 w-auto cursor-pointer 
                 duration-300
                 hover:scale-[2]
                 hover:bg-[#ffffff]
               "
             />
           </Link>
         </div>


        {/* Desktop Nav */}
        <div className={`hidden md:flex   gap-4 ${ !isRTL ? 'lg:gap-4 xl:gap-6'  :'lg:gap-6 xl:gap-8' }`}>
          {/* <NavItem id="hero" label={t("nav.home")} /> */}
          <Link to="/home">
            <span
              className={`text-sm lg:text-base border-b-2 pb-1   transition ${
                location.pathname === "/home"
                  ? "border-[#DDD4BA]"
                  : "border-transparent "
              }`}
            >
              {t("nav.home")}
            </span>
          </Link>
          <NavItem id="about" label={t("nav.about")} />
          <NavItem id="how-it-works" label={t("nav.howItWorks")} />

          <Link to="/news">
            <span
              className={`text-sm lg:text-base border-b-2 pb-1   transition ${
                location.pathname === "/news"
                  ? "border-[#DDD4BA]"
                  : "border-transparent "
              }`}
            >
              {t("nav.news")}
            </span>
          </Link>
          <Link to="/faq">
            <span
              className={`text-sm lg:text-base border-b-2 pb-1   transition ${
                location.pathname === "/faq"
                  ? "border-[#DDD4BA]"
                  : "border-transparent "
              }`}
            >
              {t("nav.faq")}
            </span>
          </Link>
          <Link to="/contact">
            <span
              className={`text-sm lg:text-base border-b-2 pb-1   transition ${
                location.pathname === "/contact"
                  ? "border-[#DDD4BA]"
                  : "border-transparent "
              }`}
            >
              {t("nav.contact")}
            </span>
          </Link>
        </div>


         {/* Actions - Right side on LTR, Left on RTL */}
        <div className={`hidden md:flex items-center gap-3 ${isRTL ? 'order-2' : 'order-3'}`}>
          
           {/* HandlecLanguage Change   */}
           <div className='w-[100px]'>
            <Select value={currentLanguage.code} onValueChange={handleLanguageChange} >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      {/* {lang.flag && <span>{lang.flag}</span>} */}
                      <span>{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Conditional rendering based on authentication state */}
          {isAuthenticated ? (
            <>
              {/* User Info */}
              {/* <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium font-ibm-plex-arabic">
                  {user?.firstName} {user?.lastName}
                </span>
              </div> */}
              
              {/* Go to Dashboard Button */}
              <Link to="/dashboard">
                <Button 
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary-hover touch-target font-ibm-plex-arabic"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden lg:inline">{t('nav.go_dashboard')}</span>
                  <span className="lg:hidden">{t('nav.dashboard')}</span>
                </Button>
              </Link>
              
              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm"
                className="touch-target font-ibm-plex-arabic"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline"> {t('nav.logout')}</span>
                <span className="lg:hidden">{t('nav.out')}</span>
              </Button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link to="/login">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="touch-target font-ibm-plex-arabic"
                >
                  <img src="/lovable-uploads/26f431a4-7d66-4365-aabe-d33949437654.png" alt={t('meta.title')} className="w-4 h-4" loading="lazy" />
                  <span className="hidden lg:inline">{t('nav.login')}</span>
                  <span className="lg:hidden">{t('nav.loginShort')}</span>
                </Button>
              </Link>
              
              {/* Join Now Button */}
              <Link to="/signup">
                <Button 
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary-hover touch-target font-ibm-plex-arabic"
                >
                  <img src="/lovable-uploads/ba6ca422-3c64-4420-8576-29c33f9ac891.png" alt={t('meta.ltitle')} className="w-4 h-4" loading="lazy" />
                  <span className="hidden lg:inline">{t('nav.joinNow')}</span>
                  <span className="lg:hidden">{t('nav.join')}</span>
                </Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navigation;