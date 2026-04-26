import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyOwnerDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState({
    nationalId: null as File | null,
    propertyDeed: null as File | null,
    personalPhoto: null as File | null
  });

  const handleFileUpload = (fileType: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Documents uploaded:', uploadedFiles);
    // Navigate to success page
    navigate('/signup/property-owner/success');
  };

  const FileUploadSection = ({ 
    title, 
    description, 
    fileType, 
    acceptedFormats = "PDF, JPG, PNG" 
  }: { 
    title: string; 
    description: string; 
    fileType: string; 
    acceptedFormats?: string; 
  }) => (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        gap: '12px',
        width: '100%',
        background: '#FFFFFF',
        border: '1px dashed #E8E8E9',
        borderRadius: '12px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease'
      }}
      onClick={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.jpg,.jpeg,.png';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) handleFileUpload(fileType, file);
        };
        input.click();
      }}
    >
      {/* Upload Icon */}
      <div 
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#F8FAFD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7 10l5-5 5 5" stroke="#516180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 5v14" stroke="#516180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div 
        style={{
          fontFamily: "'IBM Plex Sans Arabic'",
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '14px',
          color: '#2E4166',
          marginBottom: '4px'
        }}
      >
        {title}
      </div>
      
      <div 
        style={{
          fontFamily: "'IBM Plex Sans Arabic'",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '12px',
          color: '#516180',
          marginBottom: '8px'
        }}
      >
        {description}
      </div>
      
      <div 
        style={{
          fontFamily: "'IBM Plex Sans Arabic'",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '11px',
          color: '#9CA3AF'
        }}
      >
        {acceptedFormats}
      </div>
      
      {uploadedFiles[fileType as keyof typeof uploadedFiles] && (
        <div 
          style={{
            fontFamily: "'IBM Plex Sans Arabic'",
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '12px',
            color: '#059669',
            marginTop: '8px'
          }}
        >
          ✓ تم رفع الملف
        </div>
      )}
    </div>
  );

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
            className="absolute object-contain opacity-10"
            loading="lazy"
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
            className="absolute object-contain opacity-10"
            loading="lazy"
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

        {/* Right - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto p-4">
          <div className="flex flex-col justify-center items-center gap-6 w-full max-w-lg mx-auto min-h-screen" style={{ direction: 'rtl' }}>
            {/* Header */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0px',
                gap: '8px',
                width: '100%',
                flex: 'none',
                order: 0,
                flexGrow: 0
              }}
            >
              <div 
                style={{
                  fontFamily: "'IBM Plex Sans Arabic'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '32px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#2E4166',
                  marginBottom: '8px'
                }}
              >
                إنشاء حساب جديد
              </div>
              <div 
                style={{
                  fontFamily: "'Plus Jakarta Sans'",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#516180'
                }}
              >
                املأ البيانات المطلوبة وسيتم مراجعة طلبك خلال 24 ساعة
              </div>
            </div>

            {/* User Type Toggle */}
            <div 
              style={{
                width: '100%',
                height: '56px',
                position: 'relative',
                marginBottom: '16px'
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '56px',
                  left: '0px',
                  top: '0px',
                  background: '#F8FAFD',
                  borderRadius: '12px',
                  border: '1px solid #E8E8E9'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  width: 'calc(50% - 6px)',
                  height: '44px',
                  left: '6px',
                  top: '6px',
                  background: '#2E4166',
                  borderRadius: '10px',
                  boxShadow: '0 2px 8px rgba(46, 65, 102, 0.15)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 'calc(50% - 6px)',
                  height: '44px',
                  left: '6px',
                  top: '6px',
                  fontFamily: "'IBM Plex Sans Arabic'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#DDD4BA',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                مالك / وسيط عقار
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: 'calc(50% - 6px)',
                  height: '44px',
                  left: 'calc(50% + 0px)',
                  top: '6px',
                  fontFamily: "'IBM Plex Sans Arabic'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#2E4166',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                شركة / مؤسسة
              </div>
            </div>

            {/* Form Content */}
            <form 
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0px',
                gap: '20px',
                width: '100%',
                flex: 'none',
                order: 2,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              {/* Step Title */}
              <div 
                style={{
                  fontFamily: "'IBM Plex Sans Arabic'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  color: '#2E4166',
                  marginBottom: '8px'
                }}
              >
                إنشاء حساب جديد
              </div>

              {/* Step Indicator */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  width: '100%'
                }}
              >
                {/* Step 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#2E4166',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'IBM Plex Sans Arabic'",
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    ✓
                  </div>
                  <div 
                    style={{
                      fontFamily: "'IBM Plex Sans Arabic'",
                      fontSize: '14px',
                      color: '#516180',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    نوع الحساب
                  </div>
                </div>

                {/* Line 1 */}
                <div 
                  style={{
                    width: '40px',
                    height: '2px',
                    background: '#2E4166'
                  }}
                />

                {/* Step 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#2E4166',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'IBM Plex Sans Arabic'",
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    ✓
                  </div>
                  <div 
                    style={{
                      fontFamily: "'IBM Plex Sans Arabic'",
                      fontSize: '14px',
                      color: '#516180',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    البيانات الأساسية
                  </div>
                </div>

                {/* Line 2 */}
                <div 
                  style={{
                    width: '40px',
                    height: '2px',
                    background: '#2E4166'
                  }}
                />

                {/* Step 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#2E4166',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'IBM Plex Sans Arabic'",
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    3
                  </div>
                  <div 
                    style={{
                      fontFamily: "'IBM Plex Sans Arabic'",
                      fontSize: '14px',
                      color: '#2E4166',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}
                  >
                    رفع الوثائق
                  </div>
                </div>
              </div>

              {/* Documents Upload Section */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  width: '100%'
                }}
              >
                <div 
                  style={{
                    fontFamily: "'IBM Plex Sans Arabic'",
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#2E4166',
                    textAlign: 'center',
                    marginBottom: '8px'
                  }}
                >
                  رفع الوثائق المطلوبة
                </div>

                <div 
                  style={{
                    fontFamily: "'IBM Plex Sans Arabic'",
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#516180',
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}
                >
                  أرفق الوثائق المطلوبة للتحقق من الهوية والملكية
                </div>

                {/* National ID Upload */}
                <FileUploadSection
                  title="نسخ من الهوية هوية الإقامة"
                  description="نسخ واضحة هوية الإقامة"
                  fileType="nationalId"
                  acceptedFormats="PDF, JPG, PNG بحد أقصى 10 ميجابايت"
                />

                {/* Property Deed Upload */}
                <FileUploadSection
                  title="صحيفة صك الملكية"
                  description="نسخ واضحة صحيفة صك الملكية"
                  fileType="propertyDeed"
                  acceptedFormats="PDF, JPG, PNG بحد أقصى 10 ميجابايت"
                />

                {/* Personal Photo Upload */}
                <FileUploadSection
                  title="صورة شخصية"
                  description="صورة شخصية واضحة بخلفية بيضاء"
                  fileType="personalPhoto"
                  acceptedFormats="JPG, PNG بحد أقصى 5 ميجابايت"
                />
              </div>

              {/* Action Buttons */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  width: '100%',
                  marginTop: '24px'
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/signup/property-owner')}
                  style={{
                    flex: 1,
                    height: '48px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E9',
                    borderRadius: '12px',
                    fontFamily: "'IBM Plex Sans Arabic'",
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#516180',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  السابق
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    height: '48px',
                    background: '#2E4166',
                    border: 'none',
                    borderRadius: '12px',
                    fontFamily: "'IBM Plex Sans Arabic'",
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  إنهاء التسجيل
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerDocuments;