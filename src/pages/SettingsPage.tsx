import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Globe, Palette, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { languages, getLanguageByCode } from '@/i18n/languages';
import { useLanguage } from '@/providers/LanguageProvider';
// 
const SettingsPage: React.FC = () => {
  const { i18n, t } = useTranslation();
  // const { t: providerLang } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState(getLanguageByCode(i18n.language) || languages[1]);
  
  // Handle language change
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
  // 
  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    dataSharing: false
  });
  
  const [theme, setTheme] = useState('light');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved settings from localStorage
  useEffect(() => {
    const savedPrivacy = localStorage.getItem('privacySettings');
    const savedTheme = localStorage.getItem('themeSettings');
    
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Sync current language with i18n changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = getLanguageByCode(i18n.language);
      if (newLanguage) {
        setCurrentLanguage(newLanguage);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  
  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('privacySettings', JSON.stringify(privacy));
      localStorage.setItem('themeSettings', theme);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('settings_saved_successfully'));
    } catch (error) {
      toast.error(t('settings_save_failed'));
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = () => {
    // Reset to default values
    setPrivacy({
      dataSharing: false
    });
    setTheme('light');
    toast.info(t('settings_reset'));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-md shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('settings')}</h1>
        <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">{t('customize_your_experience')}</p>
      </div>

      {/* Language Settings */}
      <Card >
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className="flex items-center text-xl sm:text-2xl font-bold">
            <Globe className="w-5 h-5 ml-2" />
              {t('language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div>
            <Label htmlFor="language">{t('select_language')}</Label>
            <Select value={currentLanguage.code} onValueChange={handleLanguageChange}>
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
        </CardContent>
      </Card>


      {/* Theme Settings */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 ml-2" />
            {t('theme')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">{t('theme_lable')}</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('light')}</SelectItem>
                <SelectItem value="dark">{t('dark')}</SelectItem>
                <SelectItem value="system">{t('system_default')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card> */}

      {/* Privacy Settings */}
      <Card>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className="flex items-center text-xl sm:text-2xl font-bold">
            <Shield className="w-5 h-5 ml-2" />
            {t('privacy_and_security')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <Label className="text-base font-medium">{t('data_sharing')}</Label>
                <p className="text-sm text-gray-500 mt-1">{t('allow_data_sharing')}</p>
              </div>
              <div className="flex items-center gap-2" dir='rtl'>
                <span className="text-xs text-gray-500">
                  {privacy.dataSharing ? t('enabled') : t('disabled')}
                </span>
                <Switch 
                  checked={privacy.dataSharing}
                  onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button 
          className="bg-primary  text-white"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
             {t}
            </>
          ) : (
            t('save_settings') 
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={handleReset}
          disabled={isSaving}
        >
         {t('reset')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
