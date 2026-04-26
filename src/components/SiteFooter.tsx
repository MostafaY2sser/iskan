import React from 'react';
import Logo from '@/components/Logo';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SiteFooter: React.FC = () => {

   const { i18n , t } = useTranslation();
    const isRTL = i18n.language === 'ar';

     // Delete Footer site in Residence Details :------
      const locationFooter = useLocation();
      const hideFooter = 
        locationFooter.pathname.startsWith('/residence/') || 
        locationFooter.pathname.startsWith('/booking/')||
        locationFooter.pathname.startsWith('/residential-management')||
        locationFooter.pathname.startsWith('/customer-notifications')||
        locationFooter.pathname.startsWith('/notifications');
    

  return (
    <footer  className={`bg-[#2E4166] py-12 px-[20px] md:px[100px] pb-0  footerHidden ${ hideFooter ? 'hidden' : '' } `}>
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-[70px] mb-16 sm:mb-8 " >
          {/* Contact Section - Right */}
          <div className="order-2 lg:order-1  ">
            <h3 className="text-white font-bold text-xl leading-[26px] pb-3 border-b border-[#DDD4BA] mb-6">
             {t('footer.contact')}
            </h3>
            <div className="space-y-3" >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.0767 3.33301H3.74333C2.82285 3.33301 2.07666 4.0792 2.07666 4.99967V14.9997C2.07666 15.9201 2.82285 16.6663 3.74333 16.6663H17.0767C17.9971 16.6663 18.7433 15.9201 18.7433 14.9997V4.99967C18.7433 4.0792 17.9971 3.33301 17.0767 3.33301Z" stroke="#DDD4BA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.7433 5.83301L11.2683 10.583C11.0111 10.7442 10.7136 10.8297 10.41 10.8297C10.1064 10.8297 9.80893 10.7442 9.55166 10.583L2.07666 5.83301" stroke="#DDD4BA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white text-base font-normal">info@grh.sa</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7433 14.1004V16.6004C18.7443 16.8325 18.6967 17.0622 18.6037 17.2749C18.5108 17.4875 18.3744 17.6784 18.2034 17.8353C18.0324 17.9922 17.8305 18.1116 17.6106 18.186C17.3908 18.2603 17.1578 18.288 16.9267 18.2671C14.3623 17.9884 11.8992 17.1122 9.73499 15.7087C7.72151 14.4293 6.01444 12.7222 4.73499 10.7087C3.32664 8.53474 2.45019 6.05957 2.17666 3.48374C2.15583 3.2533 2.18322 3.02104 2.25707 2.80176C2.33093 2.58248 2.44963 2.38098 2.60563 2.21009C2.76162 2.0392 2.95149 1.90266 3.16315 1.80917C3.3748 1.71569 3.60361 1.66729 3.83499 1.66707H6.33499C6.73941 1.66309 7.13148 1.80631 7.43812 2.07002C7.74476 2.33373 7.94505 2.69995 8.00165 3.10041C8.10717 3.90046 8.30286 4.68601 8.58499 5.44207C8.69711 5.74034 8.72137 6.0645 8.65491 6.37614C8.58845 6.68778 8.43404 6.97383 8.20999 7.20041L7.15166 8.25874C8.33795 10.345 10.0654 12.0724 12.1517 13.2587L13.21 12.2004C13.4366 11.9764 13.7226 11.8219 14.0343 11.7555C14.3459 11.689 14.6701 11.7133 14.9683 11.8254C15.7244 12.1075 16.5099 12.3032 17.31 12.4087C17.7148 12.4658 18.0845 12.6697 18.3488 12.9817C18.613 13.2936 18.7535 13.6917 18.7433 14.1004Z" stroke="#DDD4BA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white text-base font-normal ltr-content">+966 50 123 4567</span>
              </div> */}
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.0767 8.33366C17.0767 12.4945 12.4608 16.8278 10.9108 18.1662C10.7665 18.2747 10.5907 18.3335 10.41 18.3335C10.2293 18.3335 10.0536 18.2747 9.90918 18.1662C8.35918 16.8278 3.74335 12.4945 3.74335 8.33366C3.74335 6.56555 4.44573 4.86986 5.69597 3.61961C6.94621 2.36937 8.6419 1.66699 10.41 1.66699C12.1781 1.66699 13.8738 2.36937 15.1241 3.61961C16.3743 4.86986 17.0767 6.56555 17.0767 8.33366Z" stroke="#DDD4BA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.41 10.833C11.7907 10.833 12.91 9.71372 12.91 8.33301C12.91 6.9523 11.7907 5.83301 10.41 5.83301C9.02932 5.83301 7.91003 6.9523 7.91003 8.33301C7.91003 9.71372 9.02932 10.833 10.41 10.833Z" stroke="#DDD4BA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white text-base font-normal">{t('riyadhLocation')}</span>
              </div>
            </div>
            <div className="flex justify-end gap-[9.3px] flex-row-reverse mt-6">
              <a href='#' className="w-[35px] h-[35px] border border-[#DDD4BA] rounded-full flex items-center justify-center">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.04939 3.67754C6.04939 4.11296 5.89184 4.48822 5.57673 4.80332C5.26163 5.11842 4.88637 5.27598 4.45095 5.27598C4.00408 5.27598 3.62309 5.11842 3.30798 4.80332C2.99288 4.48822 2.83533 4.11296 2.83533 3.67754C2.83533 3.23066 2.99288 2.84967 3.30798 2.53457C3.62309 2.21947 4.00408 2.06191 4.45095 2.06191C4.88637 2.06191 5.26163 2.21947 5.57673 2.53457C5.89184 2.84967 6.04939 3.23066 6.04939 3.67754ZM6.04939 7.51504V15.2713H2.83533V7.51504H6.04939ZM10.1737 7.51504V15.2713H7.0168V7.51504H10.1737ZM14.298 7.51504V15.2713H11.1411V7.51504H14.298ZM16.4315 7.51504H19V15.2713H16.4315V7.51504Z" fill="#DDD4BA" />
                </svg>
              </a>
              <a href='#' className="w-[35px] h-[35px] border border-[#DDD4BA] rounded-full flex items-center justify-center">
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.8931 5.86016C14.8931 5.92891 14.8931 5.99479 14.8931 6.05781C14.8931 6.12083 14.8931 6.18672 14.8931 6.25547C14.8931 7.22943 14.7098 8.21484 14.3431 9.21172C13.9764 10.2086 13.4379 11.1109 12.7275 11.9188C12.0171 12.7266 11.1405 13.3826 10.0978 13.8867C9.05509 14.4023 7.85197 14.6602 6.48843 14.6602C5.65197 14.6602 4.84989 14.5427 4.08218 14.3078C3.31447 14.0729 2.60405 13.7435 1.95093 13.3195C2.07697 13.3424 2.19728 13.3539 2.31187 13.3539C2.42645 13.3539 2.54676 13.3539 2.6728 13.3539C3.3603 13.3539 4.01629 13.2451 4.64077 13.0273C5.26525 12.8096 5.82957 12.5003 6.33374 12.0992C5.69207 12.0878 5.11916 11.8901 4.61499 11.5062C4.11082 11.1224 3.76134 10.6383 3.56655 10.0539C3.65822 10.0654 3.75275 10.0768 3.85015 10.0883C3.94754 10.0997 4.04207 10.1055 4.13374 10.1055C4.27124 10.1055 4.40301 10.094 4.52905 10.0711C4.65509 10.0482 4.78114 10.0253 4.90718 10.0023C4.23114 9.86484 3.66681 9.52682 3.21421 8.98828C2.7616 8.44974 2.5353 7.81953 2.5353 7.09766V7.06328C2.74155 7.16641 2.9564 7.25234 3.17983 7.32109C3.40327 7.38984 3.6353 7.42995 3.87593 7.44141C3.47489 7.17786 3.15405 6.82839 2.91343 6.39297C2.6728 5.95755 2.55249 5.48776 2.55249 4.98359C2.55249 4.70859 2.58973 4.44505 2.66421 4.19297C2.73869 3.94089 2.83895 3.70599 2.96499 3.48828C3.33166 3.93516 3.73843 4.34193 4.1853 4.70859C4.63218 5.07526 5.11343 5.39036 5.62905 5.65391C6.14468 5.91745 6.69468 6.12943 7.27905 6.28984C7.85197 6.45026 8.44207 6.54766 9.04937 6.58203C9.02645 6.46745 9.00926 6.35286 8.9978 6.23828C8.98634 6.1237 8.98062 6.00911 8.98062 5.89453C8.98062 5.08099 9.26707 4.3849 9.83999 3.80625C10.4129 3.2276 11.1119 2.93828 11.9369 2.93828C12.3608 2.93828 12.759 3.02422 13.1314 3.19609C13.5038 3.36797 13.8218 3.59714 14.0853 3.88359C14.4291 3.81484 14.7585 3.72031 15.0736 3.6C15.3887 3.47969 15.6837 3.33359 15.9587 3.16172C15.8556 3.50547 15.6923 3.81771 15.4689 4.09844C15.2455 4.37917 14.9791 4.6112 14.6697 4.79453C14.9676 4.76016 15.2598 4.70286 15.5462 4.62266C15.8327 4.54245 16.1077 4.44505 16.3712 4.33047C16.165 4.62839 15.9387 4.90625 15.6923 5.16406Z" fill="#DDD4BA" />
                </svg>
              </a>
              <a href='#' className="w-[35px] h-[35px] border border-[#DDD4BA] rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.0213 15.3994V9.38379H12.0494L12.3416 7.0291H10.0213V5.53379C10.0213 5.19004 10.0929 4.91217 10.2361 4.7002C10.3793 4.48822 10.6916 4.38223 11.1728 4.38223H12.4103V2.28535C12.1124 2.26243 11.8116 2.24238 11.508 2.22519C11.2043 2.20801 10.9036 2.19941 10.6056 2.19941C9.71189 2.19941 8.98429 2.46582 8.42283 2.99863C7.86137 3.53145 7.58064 4.30202 7.58064 5.31035V7.0291H5.5697V9.38379H7.58064V15.3994H10.0213Z" fill="#DDD4BA" />
                </svg>
              </a>
            </div>
          </div>

          {/* Important Links Section - Center */}
          <div className="order-1 lg:order-2 ">
            <h3 className="text-white font-bold text-xl leading-[26px] pb-3 border-b border-[#DDD4BA] mb-6">
             {t('footer.quickLinks')}
            </h3>
            <div className="grid grid-cols-2 gap-x-4" >
              {/* First Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='/' className="text-white text-base font-normal">{t('footer.links.home')}</a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='#about' className="text-white text-base font-normal">{t('footer.links.about')}</a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='#how-it-works' className="text-white text-base font-normal">{t('nav.howItWorks')}</a>
                </div>
                {/* <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='#' className="text-white text-base font-normal">{t('footer.links.owners')} </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='#' className="text-white text-base font-normal">{t('footer.links.companies')}</a>
                </div> */}
              </div>
              {/* Second Column */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='/contact' className="text-white text-base font-normal">{t('footer.contact')}</a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='#popular-questions' className="text-white text-base font-normal">{t('customer_footer_FAQ')} </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] bg-[#DDD4BA]"></div>
                  <a href='#news' className="text-white text-base font-normal">{t('footer.links.news')}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Description Section - Left */}
          <div className="">
            {/* Logo */}
            <div className="mb-6 flex justify-start">
              <Logo className="h-12 w-auto" />
            </div>
            
            <div className="mb-8">
              <p className={`text-white text-base font-normal leading-[28.8px] ${isRTL ? "text-right" : "text-left"} `}>
                {t('footer.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[#DDD4BA] pt-8 pb-8">
          <div className="flex justify-between items-center flex-col md:flex-row">

            <div className="text-left">
              <p className="text-white font-ibm-plex-arabic mb-6 md:m-0 font-normal text-sm sm:text-base leading-[24px] tracking-[0%] text-center md:text-right">
                © 2025 {t('all_rights_reserved')}
              </p>
            </div>

            <div className="flex gap-4 md:gap-8">
              <a href='#' className={`text-white font-ibm-plex-arabic font-normal ${isRTL? ' text-sm' : ' text-xs'} sm:text-base leading-[24px] tracking-[0%] text-right`}>{t('privacy_policy')}</a>
              <a href='#' className={`text-white font-ibm-plex-arabic font-normal ${isRTL? ' text-sm' : ' text-xs'} sm:text-base leading-[24px] tracking-[0%] text-right`}>{t('terms_and_conditions')}</a>
              <a href='#' className={`text-white font-ibm-plex-arabic font-normal ${isRTL? ' text-sm' : ' text-xs'} sm:text-base leading-[24px] tracking-[0%] text-right`}>{t('support')}</a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default SiteFooter;


