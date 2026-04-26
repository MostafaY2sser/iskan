import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const BrokerSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '16px',
        gap: '24px',
        isolation: 'isolate',
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#FFFFFF',
        minHeight: '100vh'
      }}
    >
      {/* Row */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px',
          gap: '24px',
          width: '100%',
          height: '100%',
          flex: 'none',
          order: 0,
          alignSelf: 'stretch',
          flexGrow: 1,
          maxWidth: '1408px',
          margin: '0 auto'
        }}
      >
        {/* Left */}
        <div 
          style={{
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '640px',
            minHeight: '400px',
            height: '100%',
            border: '1px solid #E8E8E9',
            borderRadius: '20px',
            flex: '1',
            order: 0,
            alignSelf: 'stretch',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
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

        {/* Right */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px',
            gap: '24px',
            width: '100%',
            maxWidth: '744px',
            height: '100%',
            flex: '1',
            order: 1,
            alignSelf: 'stretch'
          }}
        >
          {/* Success Content Container */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '48px 0px',
              gap: '32px',
              width: '500px',
              maxWidth: '500px',
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}
          >
            {/* Success Icon */}
            <div 
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M20 6L9 17l-5-5" 
                  stroke="#FFFFFF" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Success Message */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                textAlign: 'center'
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
                  color: '#2E4166'
                }}
              >
               {t('signupPage.request_sent_successfully')}
              </div>
              
              <div 
                style={{
                  fontFamily: "'IBM Plex Sans Arabic'",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#516180',
                  maxWidth: '400px'
                }}
              >
               {t('signupPage.registration_thank_you_message')}
              </div>
            </div>

            {/* Action Buttons */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
                marginTop: '24px'
              }}
            >
              <button
                onClick={handleLoginRedirect}
                style={{
                  width: '100%',
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
               {t('signupPage.login_with_credentials')}
              </button>
              
              <button
                onClick={handleHomeRedirect}
                style={{
                  width: '100%',
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
               {t('signupPage.back_to_homepage')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerSuccess;