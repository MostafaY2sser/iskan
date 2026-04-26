import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CheckIcon from '@/components/ui/check-icon';
import { Building2, Users, Shield, TrendingUp, MapPin, Phone, Mail, Star, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { HomeNewsSection } from '@/components/news/HomeNewsSection';
import PopularQuestionsSection from '@/components/PopularQuestionsSection';
import { PartnersCarousel } from '@/components/PartnersCarousel';
import { TestimonialsSection } from "@/components/Testimonials-section";
const Index = () => {
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [active, setActive] = React.useState<'owners' | 'companies' | 'brokers'>('owners');
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');


  const stepsByTab = t('targetAudience.stepsByTab', { returnObjects: true }) as Record<
  'owners' | 'companies' | 'brokers',
  { title: string; lead?: string; desc?: string }[]
>;
  
  
  const partners = [
    { name: 'Al Hokair Group', url: 'https://logo.clearbit.com/alhokair.com' },
    { name: 'AQUAT', url: 'https://logo.clearbit.com/aquat.com.sa' },
    { name: 'Almarai', url: 'https://logo.clearbit.com/almarai.com' },
    { name: 'Al Othaim', url: 'https://logo.clearbit.com/alothaimgroup.com' },
    { name: 'Al Rabie', url: 'https://logo.clearbit.com/alrabie.com' },
    { name: 'stc', url: 'https://logo.clearbit.com/stc.com.sa' },
  ];
  // Tip: change/add domains as needed; the image host returns the brand logo by domain.



  return <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>

    {/* Hero Section */}
    <section
      id="hero"
      className="gradient-hero text-white relative overflow-hidden min-h-[450px] sm:min-h-[600px] lg:min-h-[100px] anchor-offset"
    >
      {/* remove bottom padding from the container */}
      <div className="responsive-container h-full relative flex items-center pt-20 pb-0 sm:pt-16 sm:pb-0 lg:pt-0">
        {/* Content */}
        <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-right">
          {/* add 20px bottom padding to the text block */}
          <div className="flex flex-col space-y-6 sm:space-y-8 max-w-2xl mx-auto lg:mx-0 lg:pt-20 pb-20">
            <p className={`font-ibm-plex-arabic font-normal opacity-90  ${isRTL ? 'lg:text-right' : 'lg:text-left'}  text-sm sm:text-base`}>
             {t('hero.subtitle')}
            </p>
            <h1
              className={`
                font-ibm-plex-arabic font-bold text-white text-center
                ${isRTL ? 'lg:text-right lg:text-5xl' : 'lg:text-left lg:text-[43px]'}
                text-2xl sm:text-3xl md:text-4xl
                leading-[30px] lg:leading-[50px]
                text-wrap
              `}
            >
              {t('hero.title')}
            </h1>

            <p className={`font-ibm-plex-arabic font-normal text-white/90 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} text-base sm:text-lg lg:text-xl leading-relaxed text-wrap`}>
            {t('hero.description')}
           </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="touch-target bg-white text-primary hover:bg-white/90 transition-all duration-300 font-ibm-plex-arabic">
               <a href="/signup">
                  {t('hero.propertyOwnerBtn')}
               </a>
              </Button>
              <Button variant="outline" size="lg" className="touch-target border-white text-white bg-transparent hover:bg-white hover:text-primary transition-all duration-300 font-ibm-plex-arabic">
                <a href="/signup/company/step2">
                  {t('hero.companyBtn')}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Building Image */}
        <div className={`hidden lg:block absolute ${isRTL ? 'left-0' : 'right-0' } bottom-0 w-1/2 h-full`}>
          <img
            src="/lovable-uploads/e1e89307-5268-44c4-ae3f-d78800e5523e.png"
            alt="Building Architecture"
            className={`w-full h-full object-contain object-bottom opacity-80  ${isRTL ? '' : 'scale-x-[-1]'} `}
            loading="lazy"
          />
        </div>
      </div>
    </section>


    {/* About Platform Section */}
    <section id="about" className="bg-white py-12 sm:py-16 lg:py-20 anchor-offset"  dir={isRTL ? 'ltr' : 'rtl'}    >  
      <div className="responsive-container">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
          {/* Isometric Illustration */}
          <div className="relative order-2 lg:order-1">
            <img
              src="/lovable-uploads/7306aed7-94ef-4bd9-9536-dce7f04d8387.png"
              alt={t('meta.title')}
              className="w-full h-auto object-contain max-w-lg mx-auto lg:max-w-none"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Header */}
            <div className={`text-center lg:text-right  ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
              <p className={`text-section-subtitle font-medium mb-4 font-ibm-plex-arabic text-base leading-6 tracking-normal  ${isRTL ? 'text-right' : 'text-left'}`}> {t('about.subtitle')}</p>
              <h2 className={`font-ibm-plex-arabic text-[#2E4166] text-[18px] md:text-[34px] leading-[32px] md:leading-[52px] tracking-[0] font-bold ${isRTL ? 'text-right' : 'text-left'} leading-tight mb-6`} >
                {t('about.title')} 
                <span>!</span>
              </h2>
              <p className={`font-ibm-plex-arabic ${isRTL ? 'text-right' : 'text-left'}  mb-8`} style={{
                color: '#2E4166',
                fontWeight: '500',
                fontSize: '15px',
                lineHeight: '27px',
                letterSpacing: '0%'
              }}>
                {t('about.description')}
              </p>
            </div>

            {/* Tab Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end relative w-full">
              {/* Track (full width underline) */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted"></div>

              {/* Tabs */}
              <div className=" ">
            
                {/* Mission Tab */}
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`relative px-2 pt-2 pb-5 font-ibm-plex-arabic font-semibold
                    ${activeTab === 'mission'
                      ? 'text-[#2e4166]'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                  style={{
                    fontSize: '16px',
                    lineHeight: '22.5px',
                    letterSpacing: '0%',
                  }}
                >
                  {t('about.mission')}
                  {activeTab === 'mission' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
                  )}
                </button>

                {/* Vision Tab */}
                <button
                  onClick={() => setActiveTab('vision')}
                  className={`relative px-2 pt-2 pb-5 font-ibm-plex-arabic font-semibold
                    ${activeTab === 'vision'
                      ? 'text-[#2e4166]'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                  style={{
                    fontSize: '16px',
                    lineHeight: '22.5px',
                    letterSpacing: '0%',
                  }}
                >
                  {t('about.vision')}
                  {activeTab === 'vision' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>
                  )}
                </button>

              </div>
            </div>



            {/* Features List */}
            {activeTab === 'vision' && (
              <div className="space-y-4 mt-8">
                <p
                  className={`text-foreground font-ibm-plex-arabic font-bold mb-6 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                  style={{
                    fontSize: '16px',
                    lineHeight: '28.8px',
                    fontWeight: '700',
                  }}
                >
                  {t('about.visionText')}
                </p>

                <div className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t('about.features', { returnObjects: true }).map(
                    (feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                          <CheckIcon className="w-4 h-4" />
                        </div>
                        <p
                          className="text-muted-foreground font-ibm-plex-arabic"
                          style={{
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          {feature}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-4 mt-8">
                <p
                  className={`text-foreground font-ibm-plex-arabic font-bold mb-6 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                  style={{
                    fontSize: '16px',
                    lineHeight: '28.8px',
                    fontWeight: '700',
                  }}
                >
                  {t('about.missionText')}
                </p>

                <div className="space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
                  {t('about.missionFeatures', { returnObjects: true }).map(
                    (item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                          <CheckIcon className="w-4 h-4" />
                        </div>
                        <p
                          className="text-muted-foreground font-ibm-plex-arabic"
                          style={{
                            fontSize: '16px',
                            lineHeight: '24px',
                          }}
                        >
                          {item}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          

        </div>
      </div>
    </section>

    {/* Explore Properties Section */}
    {/* Explore by Property Type (Figma match) */}
    <section className="relative overflow-hidden py-14 sm:py-16 lg:py-20 bg-[#2E4166] anchor-offset"  dir={isRTL ? 'ltr' : 'rtl'}  >
      <div className="responsive-container">
        {/* decorative edge stripe */}
        <div
          aria-hidden
          className="
      pointer-events-none select-none
      absolute inset-y-0 ltr:left-0 rtl:right-0
      w-[120px] sm:w-[60px] lg:w-[20]
      z-0
    "
        >
          <img
            src="/lovable-uploads/stripe.svg"
            alt={t('meta.title')}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-35" />
        </div>
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-12">

          {/* Heading block (right side in RTL) */}
          <div className={`sm:hidden lg:col-span-4  ${isRTL ? 'text-right' : 'text-left'} `}  >
            <h2 className="text-white font-bold leading-tight mb-4 text-2xl md:text-3xl flex gap-2 justify-end  ">
              <span className="pb-2 border-b-4   border-b-[#E5DFC7]">
                {t('explore.propertyType')}
              </span>
              <span className="block">{t('explore.title')}</span>
            </h2>
            <p className="text-white/90 font-ibm-plex-arabic text-base leading-8 max-w-[42ch]">
             {t('explore.description')}
            </p>
          </div>

          {/* Cards (left side in RTL) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <img src="/lovable-uploads/property-icon-2.svg" alt={t('villa')} className="w-12 h-12" loading="lazy" />
                </div>
                <h3 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-lg mb-1">{t('explore.types.rest')}</h3>
                {/* <p className="font-ibm-plex-arabic text-gray-600 text-sm">40 {t('explore.types.rest')}</p> */}
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <img src="/lovable-uploads/property-icon-3.svg" alt={t('apartment')} className="w-12 h-12" loading="lazy" />
                </div>
                <h3 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-lg mb-1">{t('explore.types.villa')}</h3>
                {/* <p className="font-ibm-plex-arabic text-gray-600 text-sm">28 {t('explore.types.villa')}</p> */}
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <img src="/lovable-uploads/property-icon-4.svg" alt={t('apartment')} className="w-12 h-12" loading="lazy" />
                </div>
                <h3 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-lg mb-1">{t('explore.types.apartment')}</h3>
                {/* <p className="font-ibm-plex-arabic text-gray-600 text-sm">135 {t('explore.types.apartment')}</p> */}
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg width="61" height="61" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_171_11134)">
                    <g clip-path="url(#clip1_171_11134)">
                    <g clip-path="url(#clip2_171_11134)">
                    <path d="M22.5996 46.1001V58.6001H30.5997H38.5996V46.1001V33.6001H30.5997H22.5996V46.1001Z" fill="#DDD4BA"/>
                    <path d="M29.3594 0.664719C28.9492 0.758671 28.3047 1.00529 27.9297 1.21668C27.0273 1.72167 1.02344 23.4362 0.800781 23.8707C0.707031 24.0469 0.625 24.4814 0.625 24.822C0.625 25.9611 1.33984 26.6775 2.47656 26.6775C2.81641 26.6775 3.21484 26.6188 3.35547 26.5366C3.70703 26.3604 5.62891 24.7515 6.07422 24.2817C6.27344 24.0704 11.6523 19.5372 18.0391 14.2055C25.7148 7.79328 29.8047 4.458 30.0859 4.36406C30.6484 4.1879 31.1758 4.28185 31.7617 4.69288C32.0195 4.86904 36.9297 8.93244 42.6836 13.7357L53.125 22.4732V38.9147C53.125 57.1178 53.1836 55.8494 52.375 56.4249C52.0117 56.6832 51.9766 56.6832 46.9492 56.7185L41.875 56.7537V46.5012C41.875 40.6763 41.8164 35.873 41.7578 35.368C41.4414 32.9253 39.4492 30.9053 37.0117 30.553C36.5664 30.4943 33.6836 30.4356 30.625 30.4356C27.5664 30.4356 24.6953 30.4943 24.2383 30.553C21.8008 30.9053 19.8086 32.9253 19.4922 35.368C19.4336 35.873 19.375 40.6763 19.375 46.5012V56.7537L14.3125 56.7185C9.27344 56.6832 9.23828 56.6832 8.875 56.4249C8.07812 55.8612 8.125 56.5775 8.125 43.8589C8.125 37.2588 8.07812 32.1737 8.00781 31.9036C7.84375 31.1754 7.15234 30.6 6.33203 30.4943C5.55859 30.4003 5.06641 30.6117 4.63281 31.2576L4.375 31.6452L4.39844 43.988L4.43359 56.3309L4.85547 57.2117C5.59375 58.7384 6.70703 59.7484 8.21875 60.2534C8.93359 60.5 9.05078 60.5 30.625 60.5C52.2695 60.5 52.3164 60.5 53.0312 60.2534C54.7773 59.6662 56.1836 58.2217 56.6992 56.4718C56.8516 55.9551 56.875 53.8764 56.875 40.8642C56.875 32.6082 56.8984 25.8554 56.9336 25.8554C56.9688 25.8554 57.2266 26.0433 57.5312 26.2665C58 26.6305 58.1523 26.6775 58.7266 26.6775C59.9219 26.6775 60.625 25.9846 60.625 24.822C60.625 24.4814 60.5547 24.0586 60.4609 23.8825C60.3672 23.7063 58.0469 21.6863 55.3047 19.3963L50.3125 15.2272V11.704C50.3125 8.40396 50.3008 8.15734 50.0781 7.79328C49.7266 7.22957 49.1992 6.94772 48.4375 6.94772C47.6758 6.94772 47.1484 7.22957 46.7969 7.79328C46.5859 8.13385 46.5625 8.39222 46.5625 10.0951C46.5625 11.152 46.5156 11.9976 46.4688 11.9741C46.4102 11.9506 43.5859 9.61359 40.1992 6.77156C36.8008 3.92953 33.7188 1.42807 33.332 1.21668C32.6055 0.81739 31.3516 0.48856 30.5664 0.500305C30.3086 0.500305 29.7695 0.582512 29.3594 0.664719ZM37.375 34.5107C38.1602 35.0744 38.125 34.4637 38.125 46.1607V56.7419H30.625H23.125L23.1484 46.0197L23.1836 35.3093L23.4414 34.9452C23.9922 34.1701 23.8047 34.1936 30.7422 34.2288L37.0117 34.2523L37.375 34.5107Z" fill="#2E4166"/>
                    </g>
                    </g>
                    </g>
                    <defs>
                    <clipPath id="clip0_171_11134">
                    <rect width="61" height="61" fill="white"/>
                    </clipPath>
                    <clipPath id="clip1_171_11134">
                    <rect width="61" height="61" fill="white"/>
                    </clipPath>
                    <clipPath id="clip2_171_11134">
                    <rect width="61" height="61" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                </div>
                <h3 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-lg mb-1">{t('explore.types.house')}</h3>
                {/* <p className="font-ibm-plex-arabic text-gray-600 text-sm">30 {t('explore.types.house')}</p> */}
              </div>
            </div>
          </div>

          {/* Heading block (right side in RTL) */}
          <div className={`hidden sm:block lg:col-span-4  ${isRTL ? 'text-right' : 'text-left'} `}  >
            <h2 className="text-white font-bold leading-tight mb-4 text-2xl md:text-3xl flex gap-2 justify-end  ">
              <span className="pb-2 border-b-4   border-b-[#E5DFC7]">
                {t('explore.propertyType')}
              </span>
              <span className="block">{t('explore.title')}</span>
            </h2>
            <p className="text-white/90 font-ibm-plex-arabic text-base leading-8 max-w-[42ch]">
             {t('explore.description')}
            </p>
          </div>

        </div>
      </div>
    </section>


    {/* How It Works Section */}
    <section id="how-it-works" className="py-14 sm:py-16 lg:py-20 bg-white anchor-offset" >
      <div className="responsive-container">
        {/* Heading + underline accent */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-2xl sm:text-3xl lg:text-4xl inline-block leading-tight">
           {t('howItWorks.title')}
            <span
              className="block mx-auto mt-3 h-1 w-20 rounded-full"
              style={{
                backgroundImage: `linear-gradient(${!isRTL ? 'to left' : 'to right'}, #E5DFC7 0 50%, #2E4166 50% 100%)`,
              }}
            />
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280] font-ibm-plex-arabic">
           {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
          {t('howItWorks.steps', { returnObjects: true }).map((step: any, index: number) => {
            const icons = [MapPin, Building2, Shield];
            const Icon = icons[index] || MapPin;

            return (
              <div
                key={index}
                className="
                  relative rounded-[22px] bg-[#F6F7F9] p-6 sm:p-7 lg:p-8 text-center
                  shadow-[0_14px_40px_rgba(46,65,102,0.18)]
                  ring-1 ring-white/60
                "
              >
                {/* top icon in navy circle */}
                <div className="mx-auto -mt-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2E4166] text-white shadow-[0_6px_18px_rgba(46,65,102,0.35)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>

                {/* numbered title */}
                <h3 className="font-ibm-plex-arabic font-extrabold text-[#2E4166] text-lg sm:text-xl">
                  <span className="ms-1">{(index + 1).toString().padStart(2, '0')}.</span> {step.title}
                </h3>

                <p className="mt-3 text-[#6B7280] text-sm sm:text-base leading-7 font-ibm-plex-arabic">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>


    {/* Target Audience Section */}
    {/* Target Audiences (Figma match) */}
    <section className="py-14 sm:py-16 lg:py-20 bg-[#F6F7F9]">
      <div className="responsive-container">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-14">
          <h2 className="font-ibm-plex-arabic font-bold text-[#2E4166] text-2xl sm:text-3xl lg:text-4xl inline-block leading-tight">
            {t('targetAudience.title')}
          </h2>
          <span
            className="block mx-auto mt-3 h-1 w-20 rounded-full"
            style={{
              backgroundImage: `linear-gradient(${!isRTL ? 'to left' : 'to right'}, #E5DFC7 0 50%, #2E4166 50% 100%)`,
            }}
          />
          <p className="mt-3 text-sm sm:text-base text-[#6B7280] font-ibm-plex-arabic">
            {t('targetAudience.subtitle')}
          </p>
        </div>

        <div className={`lg:flex lg:items-center lg:gap-12`}>
          {/* Content + tabs + timeline */}
          <div className="lg:w-1/2">
            {/* Tabs */}
            <div className="relative w-full mb-6">
              <div className="absolute bottom-0 right-0 left-100 h-px bg-[#E5E7EB]" aria-hidden />

              <div role="tablist" aria-orientation="horizontal" className={`flex gap-6`}>
                {['owners', 'companies'].map((id) => {
                  const activeTab = active === id;
                  return (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={activeTab}
                      onClick={() => setActive(id as any)}
                      className={`relative pt-1 pb-3 text-sm font-ibm-plex-arabic transition-colors
                        ${activeTab ? 'text-[#2E4166] font-semibold' : 'text-[#2E4166]/70 hover:text-[#2E4166]'}`}
                    >
                      {t(`targetAudience.tabs.${id}`)}
                      {activeTab && (
                        <span
                          className="absolute -bottom-[1px] inset-x-0 h-[2px] rounded-full"
                          style={{ backgroundColor: '#E5DFC7' }}
                          aria-hidden
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative max-w-[560px] ms-auto">
              <div aria-hidden className="absolute inset-y-0 w-px bg-[#D1D5DB] ltr:left-8 rtl:right-8" />

              <div className="space-y-6">
                {stepsByTab[active].map((step, idx) => (
                  <div key={idx} className={`relative ${isRTL ? 'pr-16' : 'pl-16'}`}>
                    <div
                      className={`
                        absolute top-0 h-10 w-10 rounded-full bg-[#2E4166] text-white
                        flex items-center justify-center shadow z-10
                        ltr:left-8 ltr:-translate-x-1/2
                        rtl:right-8 rtl:translate-x-1/2
                      `}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <h3 className="font-ibm-plex-arabic font-extrabold text-[#2E4166] text-base sm:text-lg mb-1 text-start">
                      {step.title}
                    </h3>
                    {step.lead && <p className="text-[#111827] text-sm sm:text-base text-start">{step.lead}</p>}
                    {step.desc && <p className="text-[#6B7280] text-sm sm:text-base leading-7 text-start">{step.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="lg:w-1/2 mb-8 lg:mb-0 mt-10 md:mt-0">
            <img
              src="/lovable-uploads/target_audiance.svg"
              alt={t('meta.title')}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>



    {/* Partner Logos Section */}
    <section className="py-16 bg-white" >
      <div className="responsive-container">
        <div className="text-center mb-10">
          <h2 className="font-ibm-plex-arabic font-extrabold text-src\pages\Index.tsx:542:18xl md:text-4xl text-[#2E4166]">
            {t('partners.title')}
          </h2>
          <span
            className="block mx-auto mt-3 h-1 w-20 rounded-full"
            style={{
              backgroundImage: `linear-gradient(${!isRTL ? 'to left' : 'to right'},rgb(241, 241, 241) 0 50%, #2E4166 50% 100%)`,
            }}
          />      
          <p className="mt-3 text-[#6B7280] text-sm sm:text-base">
            {t('partners.subtitle')}
          </p>
        </div>

        <PartnersCarousel items={partners} isRTL={isRTL} fullBleed sidePaddingPx={100} />

      </div>
    </section>




    {/* Testimonials Section */}
    <TestimonialsSection />

    {/* Popular Questions Section */}
    <PopularQuestionsSection />


    {/* News Section */}
    <HomeNewsSection />



    {/* Footer moved to global SiteFooter */}

  </div>;
};
export default Index;