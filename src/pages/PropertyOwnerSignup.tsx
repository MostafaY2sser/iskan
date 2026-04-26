import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError, authApi } from '@/api';
import { useTranslation } from 'react-i18next';
// import { districtsByCity } from '@/data/districtsByCity';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';
import { useAuth } from '@/providers/AuthProvider';


const PropertyOwnerSignup: React.FC = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    // nationalId: '', 
    phone_number: '', 
    email: '', 
    guardianPhone: '', 
    city: '', 
    region: '', 
    password: '', 
    confirmPassword: '',
    // New required fields for owner registration
    valLicenseNumber: '',
    businessActivity: '',
    address: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Localization Cities :-----------------
  const districtsByCity = i18n.language === 'ar' ? districtsByCityAr : districtsByCityEn;
  
  const handleInputChange = (field: string, value: string) => { 
    setFormData(prev => ({ ...prev, [field]: value })); 
  };
  
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault();
    
    // Clear previous errors
    setFormError('');
    
    // Validation
    if (
        !formData.email || 
        !formData.password ||
        !formData.phone_number || 
        !formData.valLicenseNumber || 
        !formData.gender || 
        !formData.name || 
        !formData.businessActivity) {
      setFormError(t('please_fill_all_fields'));
      return;
    }

    // Phone validation
    if (!/^5\d{8}$/.test(formData.phone_number)) {
      setFormError(t('signupPage.invalid_phone_number'));
      return;                    
    }
    
    // val License validation
    if (formData.valLicenseNumber.length < 10) {
      setFormError(t('signupPage.invalid_val_license_number'));
      return;
    }
    
    // password validation
    if (formData.password !== formData.confirmPassword) {
      setFormError(t('passwords_do_not_match'));
      return;
    }

    // Build payload exactly as backend expects
    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      user_type: 'owner' as const,
      // registration_number: formData.nationalId,
      val_license_number: formData.valLicenseNumber,
      business_activity: formData.businessActivity,
      phone_number: `966${formData.phone_number}`,
      address: formData.address || '',
      region: formData.region || '',
      city: formData.city || '',
      name: formData.name || '',
      gender: formData.gender,
    };

    // try {
    //   setLoading(true);
    //   console.log('Registering property owner with payload:', payload);
      
    //   // Call the API
    //   const response = await authApi.registerOwner(payload);
    //   // ------------------
    //   console.log('Registration successful:', response);
      
    //   // Success → navigate to Upload Documents page
    //   // navigate('/login', { state: { message: t('account_created_successfully') } });
    //   navigate('/signup/company/step3', { state: { message: t('account_created_successfully') } });
    // }   
    // ____________________________________________________
    try {
    setLoading(true);

    // Register Owner
    await authApi.registerOwner(payload);

    // Login after Register
    const loginResponse = await api.post('/auth/login', {
      email: payload.email,
      password: payload.password,
    });

    // Savev Token to Upload Documents
    localStorage.setItem('access_token', loginResponse.access_token);
    localStorage.setItem('refresh_token', loginResponse.refresh_token);
    localStorage.setItem('user_id', loginResponse.user_id);
    localStorage.setItem('auth_user', JSON.stringify(loginResponse));

    // Update Auth Context
    if (refreshAuth) refreshAuth();

    // Success =>  navigate to Upload Documents page
    // navigate('/signup/company/step3');
    navigate('/signup/company/step3', { 
      state: { userId: loginResponse.user_id }
    });

  } 
  // ____________________________________________________
  
    catch (err: any) {
      let detailMessage = t('unexpected_account_creation_error');

      if (err instanceof ApiError && err.response?.detail) {
        const detail = err.response.detail;

        if (Array.isArray(detail)) {
          detailMessage = detail.map((d: any) => d.msg).join('\n');
        } else {
          detailMessage = detail;
        }
      } else if (err.message) {
        detailMessage = err.message;
      }
      setFormError(detailMessage);
    }
    finally {
      setLoading(false);
    }
  };







  return (
    <div 
      className="min-h-screen bg-background flex items-start bg-white " >
      {/* Container */}
      <div className="w-full h-screen flex"  >
      
        {/* Right - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2 sm:min-h-screen overflow-y-auto p-4 mt-6 sm:mt-0">
          <div className="flex flex-col justify-center items-center gap-6 w-full max-w-lg mx-auto min-h-screen py-4 sm:py-10" >
            {/* Header */}
            <div className="flex flex-col items-center p-0 gap-2 w-full flex-none order-0">
              <div className="not-italic font-semibold text-[24px] leading-[32px] text-center tracking-[0.005em] text-primary mb-2">
                {t('signupPage.createNewAccount')}
              </div>
              <div className="font-sans not-italic font-normal text-sm sm:text-base leading-[24px] text-center tracking-[0.005em] text-[#516180]">
               {t('signupPage.fillRequiredData')}
              </div>
            </div>

            {/* User Type Toggle */}
            <div className="w-full h-[56px] relative mb-4">
              <div className="absolute w-full h-[56px] left-0 top-0 bg-[#F8FAFD] rounded-[12px] border border-[#E8E8E9]"/>
              <div className="absolute w-[calc(50%-6px)] h-[44px] left-[6px] top-[6px] bg-primary rounded-[10px] shadow-[0_2px_8px_rgba(46,65,102,0.15)]"/>
              <div className="absolute w-[calc(50%-6px)] h-[44px] left-[6px] top-[6px] flex items-center justify-center not-italic font-semibold text-xs sm:text-sm leading-[20px] text-center tracking-[0.005em] text-[#DDD4BA] rounded-[10px]">
                {t('signupPage.ownerOrAgentLabel')}
              </div>
              <div className="absolute w-[calc(50%-6px)] h-[44px] left-[calc(50%+0px)] top-[6px] flex items-center justify-center not-italic font-semibold text-xs sm:text-base leading-[20px] text-center tracking-[0.005em] text-primary rounded-[10px]">
               {t('signupPage.companyOrInstitution')}
              </div>
            </div>

            {/* Form Content */}
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col items-center p-0 gap-5 w-full flex-none order-2 self-stretch"
            >
              
              {/* Step Title */}
              <div className="not-italic font-semibold text-[18px] leading-[24px] text-center text-primary mb-2">
               {t('signupPage.createPropertyOwnerAccount')}
              </div>

              {/* Step Indicator */}
              <div  
                className="flex items-center justify-center gap-3 mb-5 w-full"
                dir={`${isRTL ? 'rtl' : 'ltr' }`}
              >
                {/* Step 1 */}
                <div className='flex items-center gap-2'>
                  <div className="min-w-6 min-h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-semibold">
                    ✓
                  </div>
                  <div className='text-xs sm:text-sm text-[#516180] font-medium'>
                   {t('signupPage.accountType')}
                  </div>
                </div>

                {/* Line 1 */}
                <div className='hidden sm:block w-10 h-[2px] bg-primary'/>

                {/* Step 2 */}
                <div className='flex items-center gap-2'>
                  <div className="min-w-6 min-h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center text-[14px] font-semibold">
                    2
                  </div>
                  <div className='text-xs sm:text-sm text-primary font-medium'>
                   {t('signupPage.personalInformation')}
                  </div>
                </div>

                {/* Line 2 */}
                <div  className='hidden sm:block w-10 h-[2px] bg-[#E8E8E9]'/>

                {/* Step 3 */}
                <div className='flex items-center gap-2' >
                  <div className="min-w-6 min-h-6 sm:w-8 sm:h-8 rounded-full bg-[#E8E8E9] text-[#516180] flex items-center justify-center text-[14px] font-semibold">
                    3
                  </div>
                  <div className='text-xs sm:text-sm text-[#516180] font-medium'>
                   {t('signupPage.uploadDocuments')}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className='flex flex-col gap-4 w-full'>
                <div className="not-italic font-medium text-[16px] text-[#2E4166]  mb-2">
                 {t('signupPage.personalInformation')}
                </div>

                {/* Error Display */}
              {formError && (
                <div className="w-full p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] text-[#DC2626] text-[14px] text-center">
                  {formError}
                </div>
              )}

                {/* الاسم الكامل */}
                <div>
                  <label  className="not-italic font-normal text-[14px] text-[#516180]  block mb-2">
                   {t('signupPage.fullName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none`}
                    placeholder={t('signupPage.enterFullName')}
                  />
                </div>

                {/* رقم الجوال */}
                <div>
                  <label className="not-italic font-normal text-[14px] text-[#516180] block mb-2">
                    {t('signupPage.phoneNumber')}*
                  </label>

                  <div className={`flex ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                    <input
                      type="tel"
                      value={formData.phone_number}
                      maxLength={9}
                      inputMode="numeric"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');

                        if (value && value[0] !== '5') return;

                        handleInputChange('phone_number', value);
                      }}
                      // onBlur={() => {
                      //   if (formData.mobileNumber.length > 0 && formData.mobileNumber.length !== 9) {
                      //      setFormError('رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام');
                      //   }
                      // }}
                      placeholder="5xxxxxxxx"
                      className={`flex-1 h-[48px] bg-[#F8FAFD] border border-l-0 border-[#E8E8E9] rounded-r-[12px] px-4 text-[14px] outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {/*  Code */}
                    <span className="flex items-center px-3 bg-[#F8FAFD] border border-[#E8E8E9] rounded-l-[12px] text-sm">
                      {isRTL ? '966+' : '+966'}
                    </span>

                  </div>
                </div>


                {/* البريد الإلكتروني */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                   {t('signupPage.email')} *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none`}
                    placeholder={t('signupPage.enterFullName')}
                  />
                </div>

                {/* كلمة المرور */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                   {t('signupPage.password')} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 pr-12 text-[14px] text-black  outline-none`}
                      placeholder={t('signupPage.enterPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#516180]"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* تأكيد كلمة المرور */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                   {t('signupPage.confirmPassword')} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 pr-12 text-[14px] text-black  outline-none`}
                      placeholder={t('signupPage.reEnterPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#516180]"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* نوع المستخدم */}
                <div>
                  <label className="not-italic font-normal text-[14px] text-[#516180] block mb-2">
                    {t('signupPage.gender')} *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] 
                      ${isRTL ? 'text-right' : 'text-left'} 
                      rounded-[12px] px-4 text-[14px] text-black outline-none`}
                  >
                    <option value="">{t('signupPage.select_gender')}</option>
                    <option value="male">{t('signupPage.male')}</option>
                    <option value="female">{t('signupPage.female')}</option>
                  </select>
                </div>

                {/* Business Information Section */}
                <div className="not-italic font-medium text-[16px] text-[#2E4166]  mt-6 mb-2">
                 {t('signupPage.businessInformation')}
                </div>

                {/* رقم رخصة التقييم */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                    {t('signupPage.realEstateLicenseNumber')} *
                  </label>
                  <input
                    type="text"
                    value={formData.valLicenseNumber}
                    maxLength={10}
                    onChange={(e) => handleInputChange('valLicenseNumber', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none `}
                    placeholder={t('signupPage.enterRealEstateLicense')}
                  />
                </div>

                {/* النشاط التجاري */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                   {t('signupPage.businessActivity')} *
                  </label>
                  <select
                    value={formData.businessActivity}
                    onChange={(e) => handleInputChange('businessActivity', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none`}
                  >
                    <option value="">{t('signupPage.selectBusinessActivity')}</option>
                    {/* <option value="تطوير عقاري">{t('signupPage.realEstateDevelopment')}</option> */}
                    <option value="إدارة عقارية">{t('signupPage.propertyManagement')}</option>
                    <option value="وساطة عقارية"> {t('signupPage.realEstateBrokerage')}</option>
                    {/* <option value="تقييم عقاري">{t('signupPage.realEstateValuation')}</option> */}
                    {/* <option value="استثمار عقاري">{t('signupPage.realEstateInvestment')}</option> */}
                    <option value="أخرى">{t('signupPage.other')}</option>
                  </select>
                </div>

                {/* العنوان */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none`}
                    placeholder={t('enter_addesss')}
                  />
                </div>

                {/* المنطقة */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                    {t('signupPage.region')}
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none`}
                  >
                    <option value="">{t('signupPage.selectRegion')}</option>
                    
                      {Object.keys(districtsByCity).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                {/* المدينة */}
                <div>
                  <label 
                    className="not-italic font-normal text-[14px] text-[#516180]  block mb-2"
                  >
                    {t('signupPage.city')}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full h-[48px] bg-[#F8FAFD] border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none`}
                    placeholder={t('signupPage.enterCity')}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 w-full mt-6'>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="flex-1 h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] not-italic font-medium text-[14px] text-[#516180] cursor-pointer transition-all duration-300 ease-in-out"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 h-[48px] rounded-[12px] not-italic font-medium text-[14px] text-white transition-all duration-300 ease-in-out 
                    ${loading ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#2E4166] cursor-pointer opacity-100'}`}
                >
                  {loading ? t('signupPage.registering')  : t('signupPage.next')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Left - Logo Section - Fixed */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 p-4">
          <div className="w-full h-full border border-[#E8E8E9] rounded-3xl relative overflow-hidden">
          {/* Background */}
          <div className='absolute left-0 right-0 top-0 bottom-0 rounded-md bg-primary'/>
          
          {/* Decorative logo elements */}
          <img 
            src="/lovable-uploads/bd28609d-7d3d-4a9c-841f-aa2ac0cac4b2.png"
            alt="Decorative logo"
            loading="lazy"
            className="absolute object-contain opacity-10 left-[40%] right-[13%] top-[45%] bottom-[-20%]"
            style={{
              opacity: 0.1
            }}
          />
          <img 
            src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png"
            alt="Decorative logo"
            loading="lazy"
            className="absolute object-contain opacity-10 left-[40%] right-[13%] top-[45%] bottom-[-20%]"
            style={{
              opacity: 0.1
            }}
          />
          
          {/* Logo Container */}
          <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto">
            <img 
              src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
              alt="GRH Logo" 
              loading="lazy"
              className="max-w-[300px] max-h-[150px] w-auto h-auto brightness-0 invert"
            />
          </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyOwnerSignup;