import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth';
import { SignUpType } from '@/types/signup';
import { useTranslation } from 'react-i18next';
// import { districtsByCity } from '@/data/districtsByCity';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';
import { ApiError } from '@/api';

const CompanySignupStep2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSecondResponsible, setShowSecondResponsible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t , i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Localization Cities :-----------------
  const districtsByCity = i18n.language === 'ar' ? districtsByCityAr : districtsByCityEn;

  // Get user type and terms agreement from location state
  const locationState = location.state as { userType?: SignUpType; agreedToTerms?: boolean };
  const userType = locationState?.userType || SignUpType.customer;
  const termsAgreedFromStep1 = locationState?.agreedToTerms || false;
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    approxEmployeeCount: '',
    businessActivity: '',
    responsiblePerson: '',
    responsiblePosition: '',
    firstPhoneNumber: '',
    secondResponsiblePerson: '',
    secondPhoneNumber: '',
    favoriteArea: '',
    // Residence company specific fields
    valLicenseNumber: '',
    address: '',
    region: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    let requiredFields: string[] = [];
    
    if (userType === SignUpType.customer) {
      requiredFields = ['companyName', 'registrationNumber', 'approxEmployeeCount', 'businessActivity', 'responsiblePerson', 'responsiblePosition', 'firstPhoneNumber', 'favoriteArea', 'email', 'password', 'confirmPassword'];
    } else if (userType === SignUpType.companyResidence) {
      requiredFields = ['companyName', 'registrationNumber', 'valLicenseNumber', 'businessActivity', 'responsiblePerson', 'firstPhoneNumber', 'address', 'region', 'city', 'email', 'password', 'confirmPassword'];
    }
    
    // Field name mapping for better error messages
    const fieldNames: Record<string, string> = {
      companyName: 'اسم الشركة',
      registrationNumber: 'رقم السجل التجاري',
      approxEmployeeCount: 'عدد الموظفين التقريبي',
      businessActivity: 'النشاط التجاري',
      responsiblePerson: 'الشخص المسؤول',
      responsiblePosition: 'منصب الشخص المسؤول',
      firstPhoneNumber: 'رقم الهاتف',
      secondResponsiblePerson: 'الشخص المسؤول الثاني',
      secondPhoneNumber: 'رقم الهاتف الثاني',
      favoriteArea: 'المنطقة المفضلة',
      valLicenseNumber: 'رقم رخصة التقييم',
      address: 'العنوان',
      region: 'المنطقة',
      city: 'المدينة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور'
    };

    for (const field of requiredFields) {
      const fieldValue = formData[field as keyof typeof formData];
      console.log(`Validating field: ${field}, value: "${fieldValue}", isEmpty: ${!fieldValue}`);
      
      if (!fieldValue) {
        const fieldDisplayName = fieldNames[field] || field;
        console.error(`Validation failed for field: ${field} (${fieldDisplayName})`);
        setError(`حقل ${fieldDisplayName} مطلوب`);
        return false;
      }
    }

    // First Phone Number validation
    if (!/^5\d{8}$/.test(formData.firstPhoneNumber)) {
      setError(t('signupPage.invalid_phone_number'));
      return;
    }

    // Second Phone Number validation
    if (!/^5\d{8}$/.test(formData.secondPhoneNumber)) {
      setError(t('signupPage.invalid_phone_number'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwords_do_not_match'));
      return false;
    }
    if (formData.registrationNumber.length !== 10) {
      setError(t('signupPage.invalid_registration_number')); 
      return;
    }

    if (!termsAgreedFromStep1) {
      setError(t('signupPage.you_must_agree'));
      return false;
    }

    return true;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     let registrationData;                  

  //     if (userType === SignUpType.customer) {
  //       registrationData = {
  //         email: formData.email,
  //         password: formData.password,
  //         user_type: 'customer' as const,
  //         company_name: formData.companyName,
  //         registration_number: formData.registrationNumber,
  //         approx_employee_count: parseInt(formData.approxEmployeeCount) || 0,
  //         business_activity: formData.businessActivity,
  //         responsible_person: formData.responsiblePerson,
  //         first_phone_number: `966${formData.firstPhoneNumber}`,
  //         responsible_position: formData.responsiblePosition,
  //         second_responsible_person: formData.secondResponsiblePerson || null,
  //         second_phone_number: `966${formData.secondPhoneNumber}` || null,
  //         favorite_area: formData.favoriteArea,
  //       };
  //     } else if (userType === SignUpType.companyResidence) {
  //       registrationData = {
  //         email: formData.email,
  //         password: formData.password,
  //         user_type: 'residence_company' as const,
  //         company_name: formData.companyName,
  //         registration_number: formData.registrationNumber,
  //         val_license_number: formData.valLicenseNumber,
  //         business_activity: formData.businessActivity,
  //         responsible_person: formData.responsiblePerson,
  //         phone_number: formData.firstPhoneNumber, // Using firstPhoneNumber for residence company
  //         address: formData.address,
  //         region: formData.region,
  //         city: formData.city,
  //       };
  //     } else {
  //       throw new Error('نوع المستخدم غير مدعوم');
  //     }

  //     // Call the appropriate registration endpoint
  //     let response;
  //     if (userType === SignUpType.customer) {
  //       response = await authApi.registerCustomer(registrationData);
  //     } else if (userType === SignUpType.companyResidence) {
  //       response = await authApi.registerResidenceCompany(registrationData);
  //     }

  //     console.log('Registration successful:', response);
      
  //     // Navigate to step 3 (document upload)
  //     navigate('/signup/company/step3', { 
  //       state: { 
  //         userType,
  //         userId: response.user_id,
  //         email: formData.email
  //       } 
  //     });      

  //   } catch (err) {
  //     console.error('Registration error:', err);
  //     setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التسجيل');
  //   } finally {
  //     setLoading(false);
  //   }
  // };





  // _____________________________________________________________________________________________________________
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      let registrationData;                  

      if (userType === SignUpType.customer) {
        registrationData = {
          email: formData.email,
          password: formData.password,
          user_type: 'customer' as const,
          company_name: formData.companyName,
          registration_number: formData.registrationNumber,
          approx_employee_count: parseInt(formData.approxEmployeeCount) || 0,
          business_activity: formData.businessActivity,
          responsible_person: formData.responsiblePerson,
          first_phone_number: `966${formData.firstPhoneNumber}`,
          responsible_position: formData.responsiblePosition,
          second_responsible_person: formData.secondResponsiblePerson || null,
          second_phone_number: `966${formData.secondPhoneNumber}` || null,
          favorite_area: formData.favoriteArea,
        };
      } else if (userType === SignUpType.companyResidence) {
        registrationData = {
          email: formData.email,
          password: formData.password,
          user_type: 'residence_company' as const,
          company_name: formData.companyName,
          registration_number: formData.registrationNumber,
          val_license_number: formData.valLicenseNumber,
          business_activity: formData.businessActivity,
          responsible_person: formData.responsiblePerson,
          phone_number: formData.firstPhoneNumber,
          address: formData.address,
          region: formData.region,
          city: formData.city,
        };
      } else {
        throw new Error('نوع المستخدم غير مدعوم');
      }

      // التسجيل
      let registrationResponse;
      if (userType === SignUpType.customer) {
        registrationResponse = await authApi.registerCustomer(registrationData);
      } else if (userType === SignUpType.companyResidence) {
        registrationResponse = await authApi.registerResidenceCompany(registrationData);
      }

      console.log('Registration successful:', registrationResponse);

      // تسجيل الدخول مباشرة للحصول على التوكن
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful:', loginResponse);

      const token = loginResponse.token; // تأكد من اسم الحقل حسب الـ API

      // الانتقال للخطوة 3 مع التوكن
      navigate('/signup/company/step3', { 
        state: { 
          userType,
          userId: registrationResponse.user_id,
          email: formData.email,
          token // تمرير التوكن للخطوة التالية
        } 
      });

    } catch (err) {
      console.error('Registration/Login error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التسجيل أو تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };
  // _____________________________________________________________________________________________________________


  const handlePrevious = () => {
    navigate('/signup');
  };

  return (
    <div 
      className="min-h-screen bg-background flex items-start"
      style={{
        fontFamily: "'IBM Plex Sans Arabic'",
        background: '#FFFFFF'
      }}
    >
      {/* Container */}
      <div className="w-full h-screen flex">

        {/* Right - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto p-4">
          <div className="flex flex-col justify-start items-center gap-6 w-full max-w-lg mx-auto min-h-full py-8">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="not-italic font-semibold text-[24px] leading-[32px] text-center tracking-[0.005em] text-[#2E4166] mb-2">
               {t('signupPage.createCompanyAccount')} 
              </div>
              <div className="not-italic font-normal text-sm sm:text-base leading-[24px] text-center tracking-[0.005em] text-[#516180]">
                {t('signupPage.fillDataNotice')}
              </div>
            </div>

            {/* User Type Toggle */}
            <div className="w-full h-14 relative mb-4">
              <div className="absolute w-full h-14 left-0 top-0 bg-[#F8FAFD] rounded-xl border border-[#E8E8E9]" />
              <div className="absolute w-[calc(50%-6px)] h-11 left-[calc(50%+0px)] top-1.5 bg-[#2E4166] rounded-[10px] shadow-[0_2px_8px_rgba(46,65,102,0.15)]" />
              <div className="absolute w-[calc(50%-6px)] h-11 left-1.5 top-1.5  font-semibold text-xs sm:text-sm  text-center text-[#2E4166] rounded-[10px] flex items-center justify-center">
               {t('signupPage.ownerOrAgentLabel')}
              </div>
              <div className="absolute w-[calc(50%-6px)] h-11 left-[calc(50%+0px)] top-1.5  font-semibold text-xs sm:text-sm  text-center text-[#DDD4BA] rounded-[10px] flex items-center justify-center">
               {t('signupPage.companyOrInstitution')}
              </div>
            </div>

            {/* Step Header */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-12 h-12 bg-[#2E4166] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V7L12 2Z" stroke="#DDD4BA" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className=" font-semibold text-lg text-[#2E4166] text-center">
                {t('signupPage.createCompanyAccount')} 
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6 w-full" >
              {/* Step 1 */}
              <div className="flex items-center gap-2  ">
                <div className="min-h-6 min-w-6 sm:w-8 sm:h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center  text-xs font-semibold">
                  ✓
                </div>
                <div className=" text-xs text-[#516180] " style={{ marginTop: '8px' }}>
                  {t('signupPage.accountType')} 
                </div>
              </div>

              <div className="hidden sm:block w-8 h-0.5 bg-[#2E4166]" />

              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div className="min-h-6 min-w-6 sm:w-8 sm:h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center  text-sm font-semibold">
                  2
                </div>
                <div className=" text-xs text-[#2E4166] " style={{ marginTop: '8px' }}>
                 {/* {t('signupPage.residentialRecruitmentInfo')}  */}
                 {t('signupPage.basicCompanyInfo')} 
                </div>
              </div>

              <div className="hidden sm:block w-8 h-0.5 bg-[#E8E8E9]" />

              {/* Step 3 */}
              <div className="flex items-center gap-2">
                <div className="min-h-6 min-w-6 sm:w-8 sm:h-8 rounded-full bg-[#E8E8E9] text-[#516180] flex items-center justify-center  text-sm font-semibold">
                  3
                </div>
                <div className=" text-xs text-[#516180] " style={{ marginTop: '8px' }}>
                 {t('signupPage.uploadDocuments')} 
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 font-['IBM Plex Sans Arabic'] text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {/* Company Name */}
              <div>
                <label className=" text-sm text-[#2E4166]  block mb-2">
                  {t('signupPage.companyName')} *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                  
                />
              </div>

              {/* Registration Number and Employee Count / License Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Registration Number */}
                <div>
                  <label className=" text-sm text-[#2E4166]  block mb-2">
                    {t('signupPage.commercialRegNumber')} *
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('registrationNumber', value);
                    }}
                    placeholder={`${t('signupPage.example')} : 1010123456`}
                    maxLength={10} 
                    className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm text-black"
                  />
                </div>

                {/* Employee Count (for customer) or License Number (for residence company) */}
                {userType === SignUpType.customer ? (
                  <div>
                    <label className=" text-sm text-[#2E4166]  block mb-2">
                      {t('signupPage.approxEmployees')} *
                    </label>
                    <select
                      value={formData.approxEmployeeCount}
                      onChange={(e) => handleInputChange('approxEmployeeCount', e.target.value)}
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                      
                    >
                      <option value="">{t('signupPage.employees')} </option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-500">101-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className=" text-sm text-[#2E4166]  block mb-2">
                      رقم رخصة الاستقدام *
                    </label>
                    <input
                      type="text"
                      value={formData.valLicenseNumber}
                      onChange={(e) => handleInputChange('valLicenseNumber', e.target.value)}
                      placeholder={` ${t('signupPage.example')} : 1010123456`}
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                      
                    />
                  </div>
                )}
              </div>

              {/* Business Activity */}
              <div>
                <label className=" text-sm text-[#2E4166]  block mb-2">
                 {t('signupPage.businessActivity')} *
                </label>
                <input
                  type="text"
                  value={formData.businessActivity}
                  onChange={(e) => handleInputChange('businessActivity', e.target.value)}
                  placeholder={t('signupPage.businessActivityExample')}
                  className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                  
                />
              </div>

              {/* Responsible Person and Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Responsible Person */}
                <div>
                  <label className=" text-sm text-[#2E4166]  block mb-2">
                    {t('signupPage.responsiblePerson')} *
                  </label>
                  <input
                    type="text"
                    value={formData.responsiblePerson}
                    onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                    placeholder={t('signupPage.secondResponsibleExample')}
                    className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                    
                  />
                </div>

                {/* Position (for customer only) */}
                {userType === SignUpType.customer && (
                  <div>
                    <label className=" text-sm text-[#2E4166]  block mb-2">
                      {t('signupPage.jobPosition')}  *
                    </label>
                    <input
                      type="text"
                      value={formData.responsiblePosition}
                      onChange={(e) => handleInputChange('responsiblePosition', e.target.value)}
                      placeholder={t('signupPage.jobTitleExample')}
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                      
                    />
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-sm text-[#2E4166] block mb-2">
                  {t('signupPage.phone')} *
                </label>

                <div className={`flex ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                  <input
                    type="tel"
                    value={formData.firstPhoneNumber}
                    maxLength={9} // 5xxxxxxxx
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '') // numbers only

                      // must start with 5
                      if (value && value[0] !== '5') return

                      handleInputChange('firstPhoneNumber', value)
                    }}
                    placeholder="5xxxxxxxx"
                    className={`flex-1 h-[48px] bg-white border border-l-0 border-[#E8E8E9] rounded-r-[12px] px-4 text-sm outline-none ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />

                  {/* Code */}
                  <span className="flex items-center px-3 bg-white border border-[#E8E8E9] rounded-l-[12px] text-sm">
                    {isRTL ? '966+' : '+966'}
                  </span>
                </div>
              </div>


              {/* Add Another Responsible Person Button (for customer only) */}
              {/* {userType === SignUpType.customer && (
                <button
                  type="button"
                  onClick={() => setShowSecondResponsible(!showSecondResponsible)}
                  className="text-[#2E4166] text-sm   underline hover:no-underline w-full "
                >
                  {t('signupPage.addAnotherResponsible')}
                </button>
              )} */}

              {/* Second Responsible Person Fields (for customer only) */}
              {/* {userType === SignUpType.customer && showSecondResponsible && ( */}
                {/* <div className="space-y-4 p-4 bg-gray-50 rounded-lg"> */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Second Responsible Person */}
                    <div>
                      <label className=" text-sm text-[#2E4166]  block mb-2">
                       {t('signupPage.secondResponsiblePerson')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.secondResponsiblePerson}
                        onChange={(e) => handleInputChange('secondResponsiblePerson', e.target.value)}
                        placeholder={t('signupPage.secondResponsiblePerson')}
                        className={`w-full p-3 border border-[#E8E8E9] rounded-lg text-sm  text-black`}
                        
                      />
                    </div>

                    {/* Second Phone Number */}
                    <div>
                      <label className="text-sm text-[#2E4166] block mb-2">
                        {t('signupPage.secondPhoneNumber')}
                      </label>

                      <div className={`flex ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}>
                        <input
                          type="tel"
                          value={formData.secondPhoneNumber}
                          maxLength={9} // 
                          required
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '') // numbers only

                            // must start with 5
                            if (value && value[0] !== '5') return

                            handleInputChange('secondPhoneNumber', value)
                          }}
                          placeholder="5xxxxxxxx"
                          className={`flex-1 w-full h-[48px] bg-white border border-l-0 border-[#E8E8E9] rounded-r-[12px] px-4 text-sm outline-none ${
                            isRTL ? 'text-right' : 'text-left'
                          }`}
                        />

                        {/* Code */}
                        <span className="flex items-center px-3 bg-white border border-[#E8E8E9] rounded-l-[12px] text-sm">
                          {isRTL ? '966+' : '+966'}
                        </span>
                      </div>
                    </div>

                  </div>
                {/* </div> */}
              {/* )} */}

              {/* Favorite Area (for customer only) */}
              {userType === SignUpType.customer && (
                <div>
                  <label className=" text-sm text-[#2E4166]  block mb-2">
                    {t('signupPage.preferredRegion')}  *
                  </label>
                  <select
                    value={formData.favoriteArea}
                    onChange={(e) => handleInputChange('favoriteArea', e.target.value)}
                    className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                    
                  >
                    <option value="">{t('signupPage.selectPreferredRegion')} </option>

                      {Object.keys(districtsByCity).map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              )}

              {/* Address (for residence company only) */}
              {userType === SignUpType.companyResidence && (
                <div>
                  <label className=" text-sm text-[#2E4166]  block mb-2">
                    العنوان *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="مثال: شارع الملك فهد، حي النخيل"
                    className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                    
                  />
                </div>
              )}

              {/* Region and City (for residence company only) */}
              {userType === SignUpType.companyResidence && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Region */}
                  <div>
                    <label className=" text-sm text-[#2E4166]  block mb-2">
                      المنطقة *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                      
                    >
                      <option value="">اختر المنطقة</option>

                        {Object.keys(districtsByCity).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className=" text-sm text-[#2E4166]  block mb-2">
                      المدينة *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="مثال: الرياض"
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                      
                    />
                  </div>
                </div>
              )}


              {/* Email */}
              <div>
                <label className=" text-sm text-[#2E4166]  block mb-2">
                  {t('signupPage.email')}   *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="مثال: example@email.com"
                  className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   text-black"
                  
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className=" text-sm text-[#2E4166]  block mb-2">
                   {t('signupPage.password')} 
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('signupPage.password')} 
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   pr-10 text-black"
                      
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
                        <path fillRule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className=" text-sm text-[#2E4166]  block mb-2">
                   {t('signupPage.confirmPassword')} 
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder={t('signupPage.confirmPassword')} 
                      className="w-full p-3 border border-[#E8E8E9] rounded-lg text-sm   pr-10 text-black"
                      
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
                        <path fillRule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>


               {/* Navigation Buttons */}
               <div className="flex gap-4 mt-6">
                 <button
                   type="button"
                   onClick={handlePrevious}
                   className="flex-1 py-3 px-6 border border-[#E8E8E9] text-[#516180] rounded-lg  text-sm hover:bg-gray-50 transition-colors"
                 >
                   {t('signupPage.previous')} 
                 </button>
                 <button
                   type="submit"
                   disabled={loading}
                   className="flex-1 py-3 px-6 bg-[#2E4166] text-white rounded-lg  text-sm hover:bg-[#1f2d47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {loading ? (
                     <>
                       <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       {t('signupPage.registering')}
                     </>
                   ) : (
                     t('signupPage.next')
                   )}
                 </button>
               </div>
             </form>
           </div>
         </div>

        {/* Left - Logo Section - Fixed */}
        <div className="hidden lg:block w-1/2 h-screen sticky top-0 p-4">
          <div className="w-full h-full border border-[#E8E8E9] rounded-3xl relative overflow-hidden">
            {/* Background */}
            <div 
              style={{
                position: 'absolute',
                left: '0px',
                right: '0px',
                top: '0px',
                bottom: '0px',
                background: 'radial-gradient(106.59% 153.23% at 66.62% 0%, #41567F 0%, #2E4166 100%)',
                borderRadius: '20px'
              }}
            />
            
            {/* Decorative logo elements */}
            <img 
              src="/lovable-uploads/bd28609d-7d3d-4a9c-841f-aa2ac0cac4b2.png"
              alt="Decorative logo"
              loading="lazy"
              className="absolute object-contain opacity-10"
              style={{
                position: 'absolute',
                left: '40.35%',
                right: '13.83%',
                top: '45.78%',
                bottom: '-20.21%',
                objectFit: 'contain',
                opacity: 0.1
              }}
            />
            <img 
              src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png"
              alt="Decorative logo"
              loading="lazy"
              className="absolute object-contain opacity-10"
              style={{
                position: 'absolute',
                left: '13.67%',
                right: '40.51%',
                top: '65.15%',
                bottom: '-39.58%',
                objectFit: 'contain',
                opacity: 0.1
              }}
            />
            
            {/* Logo Container */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'auto',
                height: 'auto'
              }}
            >
              <img 
                src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
                alt="GRH Logo" 
                loading="lazy"
                style={{
                  maxWidth: '300px',
                  maxHeight: '150px',
                  width: 'auto',
                  height: 'auto',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
          </div>
        </div>

      

       </div>
     </div>
   );
};

export default CompanySignupStep2;