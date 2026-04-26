import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHero from '@/components/shared/AuthHero';
import { SignUpType, SignUpState } from '@/types/signup';
import { useTranslation } from 'react-i18next';
// import { districtsByCity } from '@/data/districtsByCity';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Localization Cities :-----------------
  const districtsByCity = i18n.language === 'ar' ? districtsByCityAr : districtsByCityEn;
  
  // New state structure
  const [signUpState, setSignUpState] = useState<SignUpState>({
    activeTabIndex: 0, // 0 = left, 1 = right
    selectedType: SignUpType.owner, // Default to owner
    stepIndex: 0,
    agreedToTerms: false,
    companyData: {
      companyName: '',
      commercialRegNumber: '',
      companyType: '',
      representativeName: '',
      representativePosition: '',
      representativeIdNumber: '',
      officeAddress: '',
      city: '',
      companyPhone: '',
      mobilePhone: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Helper functions for state updates
  const updateSignUpState = (updates: Partial<SignUpState>) => {
    setSignUpState(prev => ({ ...prev, ...updates }));
  };

  const updateCompanyData = (updates: Partial<SignUpState['companyData']>) => {
    setSignUpState(prev => ({
      ...prev,
      companyData: { ...prev.companyData, ...updates }
    }));
  };

  // Tab change handler
  const onTabChanged = (index: number) => {
    if (index === 1) {
      // Right tab - always set to customer
      updateSignUpState({ 
        activeTabIndex: index, 
        selectedType: SignUpType.customer 
      });
    } else if (index === 0) {
      // Left tab - keep current sub-choice, default to owner
      updateSignUpState({ 
        activeTabIndex: index,
        selectedType: signUpState.selectedType === SignUpType.customer ? SignUpType.owner : signUpState.selectedType
      });
    }
  };

  // Left sub-type selection handler
  const onLeftSubTypeSelected = (isOwner: boolean) => {
    const newType = isOwner ? SignUpType.owner : SignUpType.companyResidence;
    updateSignUpState({ selectedType: newType });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that user has agreed to terms
    if (!signUpState.agreedToTerms) {
      alert(t('accept_terms_to_continue'));
      return;
    }

    // Navigate based on selectedType
    switch (signUpState.selectedType) {
      case SignUpType.customer:
        console.log('Customer signup data:', signUpState.companyData);
        navigate('/signup/company/step2', { state: { userType: SignUpType.customer, agreedToTerms: signUpState.agreedToTerms } });
        break;
      case SignUpType.owner:
        navigate('/signup/property-owner');
        break;
      case SignUpType.companyResidence:
        // navigate('/signup/property-owner', { state: { userType: SignUpType.companyResidence, agreedToTerms: signUpState.agreedToTerms } });
        navigate('/signup/broker', { state: { userType: SignUpType.companyResidence, agreedToTerms: signUpState.agreedToTerms } });
        break;
      default:
        console.error('Unknown signup type:', signUpState.selectedType);
    }
  };



  return (
    <div 
      className="min-h-screen bg-background flex items-start"
      style={{
        
        background: '#FFFFFF'
      }}
    >
      {/* Container */}
      <div className="w-full h-screen flex" 
      >
        {/* Left - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2  sm:min-h-screen overflow-y-auto p-4 mt-8 md:mt-4"
        >
          <div className={`mt-0 md:mt-4 flex flex-col ${signUpState.activeTabIndex === 1 ? 'justify-start' : 'justify-center'} items-center gap-6 w-full max-w-[38rem] mx-auto ${signUpState.activeTabIndex === 1 ? 'min-h-full py-8' : 'min-h-screen'}`}
          >
            {/* Header */}
            <div 
              className='flex flex-col items-center p-0 gap-1 w-full flex-none flex-grow-0'
              style={{
                order: 0,
              }}
            >
              <div className='text-xl sm:3xl font-semibold text-primary text-center leading-8'>
                {signUpState.selectedType === SignUpType.customer ? t('signupPage.createCompanyAccount') :  t('signupPage.ownerOrAgent')}
              </div>
              <div className='font-normal text-sm sm:text-base leading-6 text-center text-[#516180]'>
                {t('signupPage.fillDataNotice')}
              </div>
            </div>

            {/* User Type Toggle */}
            <div className='w-full h-[56px] relative mb-4'>
              <div  className='absolute w-full h-[56px] left-0 top-0 bg-[#F8FAFD] rounded-md border border-[#E8E8E9]'/>
              <div className='absolute h-[44px] top-[6px] bg-[#2E4166] rounded-md'
                style={{
                  width: 'calc(50% - 6px)',
                  left: signUpState.activeTabIndex === 0 ? '6px' : 'calc(50% + 0px)',
                  transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(46, 65, 102, 0.15)'
                }}
              />
              <button
                type="button"
                onClick={() => onTabChanged(0)}
                className='absolute h-[44px] left-[6px] top-[6px] font-semibold text-xs sm:text-sm leading-5 text-center bg-transparent border-none cursor-pointer rounded-md flex items-center justify-center'
                style={{
                  width: 'calc(50% - 6px)',
                  color: signUpState.activeTabIndex === 0 ? '#DDD4BA' : '#2E4166',
                  transition: 'color 0.3s ease',
                }}
              >
                {t('signupPage.ownerOrAgentLabel')}
              </button>
              <button
                type="button"
                onClick={() => onTabChanged(1)}
                className='absolute h-[44px] top-[6px] font-semibold text-xs sm:text-sm leading-5 text-center bg-transparent border-none rounded-md cursor-pointer flex items-center justify-center'
                style={{
                  width: 'calc(50% - 6px)',
                  left: 'calc(50% + 0px)',
                  color: signUpState.activeTabIndex === 1 ? '#DDD4BA' : '#2E4166',
                  transition: 'color 0.3s ease',
                }}
              >
                {t('signupPage.companyOrInstitution')}
              </button>
            </div>

            {/* Form Content */}
            <form 
              className="flex flex-col items-center p-0 gap-6 w-full flex-none order-2 self-stretch grow-0 rtl mb-24"
              onSubmit={handleSubmit}
            >
              {signUpState.activeTabIndex === 0 ? (
                <>
                   {/* Step Title */}
                   <div className='text-base sm:text-xlnot-italic font-semibold leading-6 text-center text-[#2E4166] mb-2'>
                    {t('signupPage.createOwnerOrCompanyAccount')}
                   </div>

                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-3 mb-6 w-full" >
                     {/* Step 1 */}
                     <div className='flex items-center gap-2'>
                       <div className='w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] text-xs sm:text-sm text-white bg-primary rounded-full flex items-center justify-center font-semibold'>
                         1
                       </div>
                     </div>
                     <div  className='text-xs sm:text-sm text-primary font-medium mt-2'>
                       {t('signupPage.accountType')}
                      </div>

                    {/* Line 1 */}
                    <div 
                      className='hidden sm:block w-10 h-[2px] bg-[#E8E8E9]'/>

                     {/* Step 2 */}
                     <div className='flex items-center gap-2'>
                       <div className='w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] text-xs sm:text-sm text-white bg-primary rounded-full flex items-center justify-center font-semibold'>
                         2
                       </div>
                     </div>
                     <div 
                      className='text-xs sm:text-sm text-[#516180] font-medium mt-2'>
                       {t('signupPage.basicData')}
                      </div>

                    {/* Line 2 */}
                    <div 
                      className='hidden sm:block w-10 h-[2px] bg-[#E8E8E9]'/>

                     {/* Step 3 */}
                     <div className='flex items-center gap-2'>
                       <div className='w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] text-xs sm:text-sm text-white bg-primary rounded-full flex items-center justify-center font-semibold'>
                         3
                       </div>
                     </div>
                     <div 
                        className='text-xs sm:text-sm text-[#516180] font-medium mt-2'>
                        {t('signupPage.uploadDocuments')}
                     </div>
                  </div>

                  {/* Inline Selector for Left Tab */}
                  <div 
                    className='flex flex-row gap-3 mb-6 w-full' >
                    <button
                      type="button"
                      onClick={() => onLeftSubTypeSelected(true)}
                      className='flex-1 py-3 px-4 rounded-md text-sm font-semibold cursor-pointer '
                      style={{
                        background: signUpState.selectedType === SignUpType.owner ? '#2E4166' : '#F8FAFD',
                        border: signUpState.selectedType === SignUpType.owner ? '2px solid #2E4166' : '1px solid #E8E8E9',
                        color: signUpState.selectedType === SignUpType.owner ? '#DDD4BA' : '#2E4166',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('signupPage.owner')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onLeftSubTypeSelected(false)}
                      className='flex-1 py-3 px-4 rounded-md text-sm font-semibold cursor-pointer '
                      style={{
                        background: signUpState.selectedType === SignUpType.companyResidence ? '#2E4166' : '#F8FAFD',
                        border: signUpState.selectedType === SignUpType.companyResidence ? '2px solid #2E4166' : '1px solid #E8E8E9',
                        color: signUpState.selectedType === SignUpType.companyResidence ? '#DDD4BA' : '#2E4166',
                        transition: 'all 0.3s ease'
                      }}
                    >
                     {t('signupPage.realEstateBroker')}
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className='flex flex-col gap-4 w-full'>
                    <div  className='font-medium text-base text-[#2E4166]  mb-2' >
                     {t('signupPage.accountType')}
                    </div>

                    {/* Account Type Display */}
                    <div  className='flex flex-row justify-center items-center p-4 mb-6 bg-[#F8FAFD] border border-[#E8E8E9] rounded-md' >
                      <div className='text-base text-primary text-center font-semibold' >
                        {signUpState.selectedType === SignUpType.owner ? t('signupPage.owner') : t('signupPage.realEstateBroker')}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                   {/* Step Title */}
                   <div  className='font-semibold text-xl leading-6 text-center text-primary mb-2'>
                      {t('signupPage.createCompanyAccount')}
                   </div>

                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-3 mb-5 w-full">
                     {/* Step 1 */}
                     <div className='flex items-center gap-1 sm:gap-2'>
                       <div  className="min-w-6 min-h-6 sm:w-8 sm:h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center text-xs sm:text-sm font-normal sm:font-semibold">
                         1
                       </div>
                       <div className='text-xs sm:text-sm text-primary font-normal sm:font-medium '>
                         {t('signupPage.accountType')}
                       </div>
                     </div>

                     {/* Line 1 */}
                     <div className='hidden sm:block w-10 h-[2px] bg-[#E8E8E9]'/>

                     {/* Step 2 */}
                     <div className='flex items-center gap-1 sm:gap-2'>
                       <div className="min-w-6 min-h-6 sm:w-8 sm:h-8 rounded-full bg-[#E8E8E9] text-[#516180] flex items-center justify-center text-sm font-semibold">
                         2
                       </div>
                       <div className='text-[#516180] text-xs sm:text-sm font-normal sm:font-medium'>
                         {/* {t('signupPage.residentialRecruitmentInfo')} */}
                         {t('signupPage.basicCompanyInfo')}
                       </div>
                     </div>

                    {/* Line 2 */}
                    <div className='hidden sm:block w-10 h-[2px] bg-[#E8E8E9]'/>

                    {/* Step 3 */}
                    <div className='flex items-center gap-1 sm:gap-2'>
                      <div className="min-w-6 min-h-6 sm:w-8 sm:h-8 rounded-full bg-[#E8E8E9] text-[#516180] flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div className='text-[#516180] text-xs sm:text-sm font-normal sm:font-medium'>
                         {t('signupPage.uploadDocuments')}
                      </div>
                     </div>
                   </div>

                  {/* Form Fields */}
                  <div className='flex flex-col gap-4 w-full'  >
                    {/* <div  className='font-medium text-base text-primary  mb-2'>
                      {t('signupPage.basicData')}
                    </div> */}

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">                    

                    {/* Commercial Registration Number */}
                    {/* <div>
                      <div className='text-sm text-primary  mbb-2' >
                          {t('signupPage.commercialRegNumber')} *
                      </div>
                      <input
                        type="text"
                        value={signUpState.companyData.commercialRegNumber}
                        onChange={(e) => updateCompanyData({commercialRegNumber: e.target.value})}
                        placeholder="7XXXXXXXXX"
                        maxLength={10}
                        className="w-full p-3.5 px-4 border border-[#E8E8E9] rounded-md text-sm  text-black" />
                    </div> */}


                    {/* Representative Name */}
                    {/* <div>
                      <div  className='text-sm text-primary  mb-2'>
                       {t('signupPage.authorizedRepresentativeName')} *
                      </div>
                      <input
                        type="text"
                        value={signUpState.companyData.representativeName}
                        onChange={(e) => updateCompanyData({representativeName: e.target.value})}
                        placeholder={t('signupPage.authorizedRepresentativeFullName')}
                        className="w-full px-4 py-3 border border-[#E8E8E9] rounded-md text-sm  text-black" 
                      />
                    </div> */}

                    {/* Representative Position */}
                    {/* <div>
                      <div className='text-sm text-primary  mb-2' >
                      {t('signupPage.position')} *
                      </div>
                      <input
                        type="text"
                        value={signUpState.companyData.representativePosition}
                        onChange={(e) => updateCompanyData({representativePosition: e.target.value})}
                        placeholder={t('signupPage.positionsExamples')}
                        className="w-full px-4 py-3 border border-[#E8E8E9] rounded-md text-sm text-black " 
                      />
                    </div> */}


                    {/* Representative ID Number */}
                    {/* <div>
                      <div className='text-sm text-primary mb-2'>
                        {t('signupPage.representativeIdNumber')} *
                      </div>
                      <input
                        type="text"
                        value={signUpState.companyData.representativeIdNumber}
                        maxLength={10} 
                        placeholder="ْXXXXXXXXX"
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '') 

                          updateCompanyData({ representativeIdNumber: value })
                        }}
                        className="w-full px-4 py-3 border border-[#E8E8E9] rounded-md text-sm text-black"
                      />
                    </div> */}


                    {/* Office Address */}
                    {/* <div>
                      <div className='text-sm text-primary  mb-2'>
                         {t('signupPage.officeAddress')} *
                      </div>
                      <input
                        type="text"
                        value={signUpState.companyData.officeAddress}
                        onChange={(e) => updateCompanyData({officeAddress: e.target.value})}
                        placeholder={t('signupPage.officeAddressDetailed')}
                        className="w-full px-4 py-3 border border-[#E8E8E9] rounded-md text-sm text-black " 
                      />
                    </div> */}

                    {/* City */}
                    {/* <div>
                      <div className='text-sm text-primary  mb-2' >
                        {t('signupPage.city')} *
                      </div>
                      <select
                        value={signUpState.companyData.city}
                        onChange={(e) => updateCompanyData({city: e.target.value})}
                        className="w-full px-4 py-3 border border-[#E8E8E9] bg-white rounded-md text-sm text-black " >
                        <option value="">{t('signupPage.selectCity')}</option>

                        {Object.keys(districtsByCity).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* Company Phone */}
                    {/* <div>
                      <div className='text-sm text-primary  mb-2' >
                        {t('signupPage.companyPhone')} *
                      </div>
                      <input
                        type="tel"
                        value={signUpState.companyData.companyPhone}
                        onChange={(e) => updateCompanyData({companyPhone: e.target.value})}
                        placeholder="05X XXX XXXX"
                        maxLength={10}
                        className="w-full px-4 py-3 border border-[#E8E8E9] bg-white rounded-md text-sm text-black " 
                      />
                    </div> */}

                    {/* Mobile Phone */}
                    {/* <div>
                      <div className='text-sm text-primary  mb-2'>
                       {t('signupPage.responsibleMobile')} *
                      </div>
                      <input
                        type="tel"
                        value={signUpState.companyData.mobilePhone}
                        onChange={(e) => updateCompanyData({mobilePhone: e.target.value})}
                        placeholder="05X XXX XXXX"
                        maxLength={10}
                        className="w-full px-4 py-3 border border-[#E8E8E9] bg-white rounded-md text-sm text-black " 
                      />
                    </div> */}
                    
                  </div>
                  </div>
                  
                </>
              )}

               {/* Terms Agreement */}
               {(
                 <div className='flex flex-row items-start gap-3 w-full mb-6'>
                   <div 
                     onClick={() => updateSignUpState({agreedToTerms: !signUpState.agreedToTerms})}
                     className='w-5 h-5 border border-primary cursor-pointer flex items-center justify-center mt-[2px]'
                    >
                     {signUpState.agreedToTerms && (
                       <div className='text-primary  text-base' >✓</div>
                     )}
                   </div>
                   <div className='font-normal text-[13px] leading-5 text-primary  flex-1'>
                    {t('signupPage.agreeTerms')}
                   </div>
                 </div>
               )}

              {/* Submit Button */}
              <button
                type="submit"
                className='flex flex-row justify-center items-center py-4 px-8 w-full bg-primary rounded-md border-none cursor-pointer mb-6'
               >
                <div className='font-semibold text-base leading-5 text-[#DDD4BA]'>
                  {t('signupPage.next')}
                </div>
              </button>

              {/* Footer Link */}
              <div className='flex flex-row justify-center items-center gap-2'>
                <Link
                  to="/login"
                  className='font-bold text-sm leading-5 text-primary no-underline'>
                 {t('login')}
                </Link>
                <div className='font-normal text-sm leading-5 text-primary'>
                 {t('signupPage.alreadyHaveAccount')}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right - Logo Section - Fixed */}
        <AuthHero />
      </div>
    </div>
  );
};

export default Signup;