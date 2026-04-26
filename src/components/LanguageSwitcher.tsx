import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Languages, Check } from 'lucide-react';
import { languages, getLanguageByCode } from '@/i18n/languages';
import { useLanguage } from '@/providers/LanguageProvider';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showFlag?: boolean;
  showLabel?: boolean;
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'outline',
  size = 'default',
  showFlag = true,
  showLabel = false,
  className,
}) => {
  const { language, setLanguage } = useLanguage();
  // const { i18n, t } = useTranslation();

  const currentLanguage = getLanguageByCode(language);

  const handleLanguageChange = async (languageCode: string) => {
    await setLanguage(languageCode as any);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`text-muted-foreground hover:text-foreground transition-colors text-sm lg:text-base bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent ${className || ''}`}
        >
          {showFlag && currentLanguage?.flag && (
            <span className="text-base">{currentLanguage.flag}</span>
          )}
          {showLabel ? (
            currentLanguage?.label || 'English'
          ) : (
            <Languages className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px] bg-white border border-gray-200 shadow-lg z-50"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 px-4 py-2"
          >
            <div className="flex items-center gap-2">
              {lang.flag && (
                <span className="text-base">{lang.flag}</span>
              )}
              <span className="font-medium">{lang.label}</span>
              {lang.dir === 'rtl' && (
                <Badge variant="secondary" className="text-xs">
                  RTL
                </Badge>
              )}
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
