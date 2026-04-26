
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useRole } from '@/providers/RoleProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Bell, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NotificationsDropdown from '@/components/NotificationsDropdown';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getRoleDisplayName, getRoleColor } = useRole();
  const { t } = useLanguage();
  const direction = localStorage.getItem('lang');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card shadow-sm px-2 pl-12 md:px-6 flex items-center justify-between z-50 w-full">
      <div className="flex items-center space-x-4 ">
        {/* <h1 className="text-xl font-semibold text-primary"> */}
          {/* {t('header.adminPortal')} */}
        {/* </h1> */}
        <img 
              src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
              alt={t('meta.title')}
              loading="lazy"
              className="h-8 sm:h-10 lg:h-12 w-auto cursor-pointer 
                duration-300
                hover:scale-[3]
                hover:bg-[#ffffff]
                hover:mt-10
              "
            />
      </div>
      
      <div className="flex items-center space-x-1">
        <LanguageSwitcher />
        {user && (
          <div className="hidden sm:flex items-center space-x-2 gap-1">
            <div className={`${direction === 'ar' ? 'text-left' : 'text-right'} ml-1 sm:ml-0`}>
              <p className="text-sm font-medium">{user.user_type}</p>
              <p className={cn('text-xs rounded', getRoleColor(user.user_type || user.role))}>
                {getRoleDisplayName(user.user_type || user.role)}
              </p>
            </div>
            <Button variant="ghost" size="icon" className='hidden md:flex border border-gray-200 '>
              <User className="h-4 w-4 " />
            </Button>
          </div>
        )}

          {/* Notifications */}
          <NotificationsDropdown notificationsPageLink="/admin/admin-notifications"/>
        
        {/* <Button variant="ghost" onClick={logout} className="text-destructive">
          <LogOut className="h-4 w-4 " />
          <span className='hidden md:block'> {t('auth.logout')}</span>
        </Button> */}
      </div>
    </header>
  );
};
