import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import { useTranslation } from 'react-i18next';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';
// import { districtsByCity } from '@/data/districtsByCity';

const BrokerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyType: '',
    companyName: '',
    // commercialRegNumber: '',
    companyPhone: '',
    personalPhone: '',
    officeAddress: '',
    city: '',
    region: '',
    mobilePhone: '',
    email: '',
    password: '',
    confirmPassword: '',
    val_license_number: ''
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
    if (!formData.email || !formData.password || !formData.mobilePhone) {
      setFormError(t('please_fill_all_fields'));
      return;
    }

    // Phone validation
    if (!/^5\d{8}$/.test(formData.mobilePhone)) {
      setFormError(t('signupPage.invalid_phone_number')); 
      return;
    }

    // val License validation
    if (formData.val_license_number.length < 10) {
      setFormError(t('signupPage.invalid_val_license_number'));
      return;
    }

    
    // password validation
    if (formData.password !== formData.confirmPassword) {
      setFormError(t('passwords_do_not_match'));
      return;
    }

    // Build payload for residence company registration (brokers are treated as residence companies)
    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      user_type: 'residence_company' as const,
      company_name: formData.companyName,
      // registration_number: formData.commercialRegNumber,
      val_license_number: formData.val_license_number || '', 
      business_activity: formData.companyType,
      responsible_person: '', // This might need to be added to the form
      phone_number: `966${formData.mobilePhone}`,
      address: formData.officeAddress || '',
      region: formData.region || '',
      city: formData.city || '',
    };

    try {
      setLoading(true);
      console.log('Registering broker with payload:', payload);
      
      // Call the API
      const response = await authApi.registerResidenceCompany(payload);
      console.log('Registration successful:', response);
      
      // Success → navigate to documents step
      navigate('/signup/broker/documents', { state: { email: payload.email, userId: response.user_id } });
    } catch (err: any) {
      console.error('Registration error:', err);
      setFormError(err?.message ?? 'حدث خطأ غير متوقع أثناء إنشاء الحساب.');
    } finally {
      setLoading(false);
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
      <div className="w-full h-screen flex">

        {/* Right - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto p-4 py-8 sm:py-4">
          <div className="flex flex-col justify-center items-center gap-6 w-full max-w-lg mx-auto min-h-screen" >
            {/* Header */}
            <div 
              className="flex flex-col items-center p-0 gap-2 w-full flex-none order-0"
            >
              <div 
                className="not-italic font-semibold text-[24px] leading-[32px] text-center tracking-[0.005em] text-[#2E4166] mb-2"
              >
               {t('signupPage.createNewAccount')}
              </div>
              <div 
                className=" not-italic font-normal text-base leading-[24px] text-center tracking-[0.005em] text-[#516180]"
              >
               {t('signupPage.fillRequiredData')}
              </div>
            </div>

            {/* User Type Toggle */}
            <div className="w-full h-[56px] relative mb-4">
              <div className="absolute w-full h-[56px] left-0 top-0 bg-[#F8FAFD] rounded-[12px] border border-[#E8E8E9]"/>
              <div 
                className="absolute w-[calc(50%-6px)] h-[44px] left-[6px] top-[6px] bg-[#2E4166] rounded-[10px] shadow-[0_2px_8px_rgba(46,65,102,0.15)]"                
              />
              <div
                className="absolute w-[calc(50%-6px)] h-[44px] left-[6px] top-[6px] flex items-center justify-center not-italic font-semibold text-sm leading-[20px] text-center tracking-[0.005em] text-[#DDD4BA] rounded-[10px]"
              >
                {t('signupPage.ownerOrAgentLabel')}
              </div>
              <div
                className="absolute w-[calc(50%-6px)] h-[44px] left-[calc(50%+0px)] top-[6px] flex items-center justify-center not-italic font-semibold text-sm leading-[20px] text-center tracking-[0.005em] text-[#2E4166] rounded-[10px]"
              >
               {t('signupPage.companyOrInstitution')}
              </div>
            </div>

            {/* Form Content */}
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col items-center p-0 gap-5 w-full flex-none order-2 self-stretch"
            >
              {/* Error Display */}
              {formError && (
                <div 
                  className="w-full p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[8px] text-[#DC2626] text-sm text-center"
                >
                  {formError}
                </div>
              )}
              
              {/* Step Title */}
              <div 
                className="not-italic font-semibold text-[18px] leading-[24px] text-center text-[#2E4166] mb-2"
              >
               {t('signupPage.createAgentAccount')}
              </div>

              {/* Step Indicator */}
              <div 
                className="flex items-center justify-center gap-3 mb-5 w-full"
              >
                {/* Step 1 */}
                <div className='flex items-center gap-2'>
                  <div 
                    className="min-h-6 min-w-6 sm:w-8 sm:h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center text-[12px] font-semibold"
                  >
                    ✓
                  </div>
                  <div className='text-sm text-[#516180] font-medium'>
                   {t('signupPage.accountType')}
                  </div>
                </div>

                {/* Line 1 */}
                <div className='hidden sm:block w-10 h-[2px] bg-primary'/>

                {/* Step 2 */}
                <div className='flex items-center gap-2'>
                  <div 
                    className="min-h-6 min-w-6 sm:w-8 sm:h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className='text-sm text-primary font-medium'>
                   {t('signupPage.basicInformation')}
                  </div>
                </div>

                {/* Line 2 */}
                <div className='hidden sm:block w-10 h-[2px] bg-[#E8E8E9]'/>

                {/* Step 3 */}
                <div className='flex items-center gap-2'>
                  <div className="min-h-6 min-w-6 sm:w-8 sm:h-8 rounded-full bg-[#E8E8E9] text-[#516180] flex items-center justify-center text-sm font-semibold" >
                    3
                  </div>
                  <div className='text-sm texxt-[#516180] font-medium'>
                    {t('signupPage.uploadDocuments')}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4 w-full">
                <div className="not-italic font-medium text-base text-[#2E4166]  mb-2">
                 {t('signupPage.basicData')}
                </div>

                {/* نوع الشركة/المؤسسة */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.companyType')}  *
                  </label>
                  <select
                    value={formData.companyType}
                    onChange={(e) => handleInputChange('companyType', e.target.value)}
                    className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 px-4 text-sm text-[#2E4166]  box-border outline-none appearance-none"
                  >
                    <option value="">{t('signupPage.selectCompanyType')} </option>
                    <option value="individual">{t('signupPage.individual')}</option>
                    <option value="company">{t('signupPage.company')}</option>
                    <option value="institution">{t('signupPage.organization')}</option>
                  </select>
                </div>

                {/* اسم الشركة أو المؤسسة */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.companyName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder={t('signupPage.enterCompanyName')}
                    className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 px-4 text-sm text-black  box-border outline-none"
                  />
                </div>

                {/* رقم رخصة التقييم */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                    {t('signupPage.realEstateLicenseNumber')} *
                  </label>
                  <input
                    type="text"
                    value={formData.val_license_number}
                    maxLength={10}
                    onChange={(e) => handleInputChange('val_license_number', e.target.value)}
                    className={`w-full h-[48px]  border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] px-4 text-[14px] text-black  outline-none `}
                    placeholder={t('signupPage.enterRealEstateLicense')}
                  />
                </div>


                {/* عنوان المكتب */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.officeAddress')}  *
                  </label>
                  <input
                    type="text"
                    value={formData.officeAddress}
                    onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                    placeholder={t('signupPage.enterOfficeAddress')}
                      className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 px-4 text-sm text-black  box-border outline-none"
                  />
                </div>

                {/* المدينة */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                    {t('signupPage.city')} *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 px-4 text-sm text-black  box-border outline-none appearance-none"
                  >
                     <option value="">{t('signupPage.selectCity')}</option>

                      {Object.keys(districtsByCity).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                {/* _____________________________________________________________________ */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.region')}
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    placeholder={t('signupPage.region')}
                    className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 px-4 text-sm text-black  box-border outline-none"
                  />
                </div>
                {/* _____________________________________________________________________ */}


                {/* رقم الهاتف المحمول */}
                <div>
                  <label className="not-italic font-normal text-sm text-[#516180] block mb-2">
                    {t('signupPage.mobileNumber')} *
                  </label>

                  <div className={`flex ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                    <input
                      type="tel"
                      value={formData.mobilePhone}
                      maxLength={9} // 5xxxxxxxx
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '') // Only Number 

                        // Must be start 5
                        if (value && value[0] !== '5') return

                        handleInputChange('mobilePhone', value)
                      }}
                      placeholder="5xxxxxxxx"
                      className={`flex-1 h-[48px] bg-white border border-l-0 border-[#E8E8E9] rounded-r-[12px] px-4 text-sm outline-none ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />

                    {/*  Code */}
                    <span className="flex items-center px-3 bg-white border border-[#E8E8E9] rounded-l-[12px] text-sm">
                      {isRTL ? '966+' : '+966'}
                    </span>
                  </div>
                </div>




                {/* البريد الإلكتروني */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.email')}*
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className={`w-full h-[48px] bg-white border border-[#E8E8E9] ${isRTL ? 'text-right' : 'text-left' } rounded-[12px] p-3 px-4 text-sm text-black text-left box-border outline-none`}
                  />
                </div>

                {/* Password */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.password')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('signupPage.password')}
                      className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 pr-10 pl-4 text-sm text-black  box-border outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-1"
                    >
                      👁️
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label 
                    className="not-italic font-normal text-sm text-[#516180]  block mb-2"
                  >
                   {t('signupPage.confirmPassword')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder={t('signupPage.confirmPassword')}
                      className="w-full h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] p-3 pr-10 pl-4 text-sm text-black  box-border outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-1"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 w-full mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="flex-1 h-[48px] bg-white border border-[#E8E8E9] rounded-[12px] not-italic font-medium text-sm text-[#516180] cursor-pointer transition-all duration-300 ease-linear"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 h-[48px] rounded-[12px] not-italic font-medium text-sm text-white transition-all duration-300 ease-linear
                  ${loading ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-[#2E4166] cursor-pointer'}`}
                >
                  {loading ? t('signupPage.registering') : t('signupPage.next')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Left - Logo Section - Fixed */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 p-4">
          <div className="w-full h-full border border-[#E8E8E9] rounded-3xl relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(106.59%_153.23%_at_66.62%_0%,_#41567F_0%,_#2E4166_100%)]"/>
          
          {/* Decorative logo elements */}
          <img 
            src="/lovable-uploads/bd28609d-7d3d-4a9c-841f-aa2ac0cac4b2.png"
            alt="Decorative logo"
            className="absolute object-contain opacity-10  left-[40.35%] right-[13.83%] top-[45.78%] bottom-[-20.21%] "
            loading="lazy"
          />
          <img 
            src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png"
            alt="Decorative logo"
            className="absolute object-contain opacity-10 left-[13.67%] right-[40.51%] top-[65.15%] bottom-[-39.58%] "
            loading="lazy"
          />
          
          {/* Logo Container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-auto h-auto">
            <img 
              src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
              alt="GRH Logo" 
              className="max-w-[300px] max-h-[150px] w-auto h-auto brightness-0 invert"
              loading="lazy"
            />
          </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrokerSignup;