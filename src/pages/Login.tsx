import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import AuthHero from '@/components/shared/AuthHero';
import { authApi, api } from '@/api';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeUserType, setActiveUserType] = useState('property-owner'); // 'property-owner' or 'company'
  const [isLoading, setIsLoading] = useState(false);
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, refreshAuth } = useAuth();
  
  // Get success message from registration
  const successMessage = (location.state as { message?: string })?.message;

  // ------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });

      // الاتصال بالـ API مباشرة
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response);

      if (!response.access_token) {
        throw new Error('Invalid response format: missing access_token');
      }

      // تخزين الـ tokens في localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_id', response.user_id);

      // تخزين كامل بيانات المستخدم
      localStorage.setItem('auth_user', JSON.stringify(response));

      // تحديد role داخلي بناء على user_type
      let userRole = 'property-owner';
      switch (response.user_type) {
        case 'customer':
        case 'owner':
        case 'residence_company':
          userRole = 'property-owner';
          break;
        default:
          userRole = 'property-owner';
      }

      const basicUser = {
        id: response.user_id,
        email: email,
        firstName: 'User', // لا توجد بيانات من الـ login
        lastName: '',
        role: userRole,
        user_type: response.user_type,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem('housing_user', JSON.stringify(basicUser));

      // تحديث حالة AuthProvider إذا موجودة
      if (refreshAuth) refreshAuth();

      // الانتقال للـ dashboard
      navigate('/dashboard');

      toast.success(t('Logged_in_successfully'));
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t('login_error'));
    } finally {
      setIsLoading(false);
    }
  };
  // ------------------------------------------




  return (
    <div 
      className="min-h-screen bg-background flex items-start bg-white">
      {/* Container */}
      <div className="w-full h-screen flex" >
       
        {/* Right - Form Section - Scrollable */}
        <div className=" w-full lg:w-1/2 min-h-screen  p-4">
          <div className="flex flex-col  sm:justify-center mt-8 sm:mt-0 items-center gap-6 w-full max-w-lg mx-auto min-h-screen " >
            {/* Header */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0px',
                gap: '8px',
                // width: '400px',
                height: '64px',
                flex: 'none',
                order: 0,
                flexGrow: 0
              }}
            >
              <div 
                style={{
                  // width: '129px',
                  // height: '32px',
                  
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '32px',
                  
                  letterSpacing: '0.005em',
                  color: '#2E4166',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
               {t('signupPage.welcomeBack')}
              </div>
              <div 
                style={{
                  // width: '400px',
                  // height: '24px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#516180',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
               {t('signupPage.welcomeMessage')}
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-['IBM Plex Sans Arabic'] text-sm">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Register Method */}
            <form 
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                // width: '400px',
                height: '224px',
                flex: 'none',
                order: 2,
                flexGrow: 0
              }}
              className='w-[350px] sm:w-full'
            >
              {/* Email Field */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '6px',
                  // width: '400px',
                  height: '70px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    // width: '400px',
                    height: '20px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <div 
                    style={{
                      // width: '400px',
                      height: '20px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.005em',
                      color: '#2E4166',
                      flex: 'none',
                      order: 0,
                      flexGrow: 1
                    }}
                  >
                     {t('signupPage.email')}
                  </div>
                </div>
                <div 
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '4px',
                    // width: '400px',
                    height: '44px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E9',
                    borderRadius: '12px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      // width: '368px',
                      height: '20px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 1
                    }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('signupPage.email')}
                      required
                      style={{
                        width: '100%',
                        height: '20px',
                        
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        
                        letterSpacing: '0.005em',
                        color: '#516180',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '6px',
                  // width: '400px',
                  height: '70px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    // width: '400px',
                    height: '20px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <div 
                    style={{
                      // width: '400px',
                      height: '20px',
                      
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      
                      letterSpacing: '0.005em',
                      color: '#2E4166',
                      flex: 'none',
                      order: 0,
                      flexGrow: 1
                    }}
                  >
                      {t('signupPage.password')}
                  </div>
                </div>
                <div 
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '6px',
                    // width: '400px',
                    height: '44px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E9',
                    borderRadius: '12px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      width: '20px',
                      height: '20px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '16px', height: '16px', color: '#516180' }} />
                    ) : (
                      <Eye style={{ width: '16px', height: '16px', color: '#516180' }} />
                    )}
                  </button>
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      // justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: '0px',
                      // gap: '8px',
                      // width: '342px',
                      height: '20px',
                      flex: 'none',
                      order: 1,
                      flexGrow: 1
                    }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('signupPage.password')}
                      required
                      style={{
                        width: '100%',
                        height: '20px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#516180',
                        order: 0,
                        flexGrow: 0,
                        outline: 'none',
                        background: 'transparent',
                        
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  padding: '0px',
                  // width: '400px',
                  height: '52px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    // width: '400px',
                    height: '52px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 1
                  }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '15px 30px',
                      // width: '400px',
                      height: '53px',
                      background: isLoading ? '#516180' : '#2E4166',
                      borderRadius: '10px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    <div 
                      style={{
                        
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#DDD4BA',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    >
                      {isLoading ? t('signupPage.loggingIn') : t('signupPage.login')}
                    </div>
                  </button>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div 
              className='gap-4 items-center'
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0px',
                width: '100%',
                height: '160px',
                flex: 'none',
                order: 3,
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  // width: '400px',
                  height: '20px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '55px',
                    height: '20px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0
                  }}
                >
                  <Link
                    to="/signup"
                    style={{
                      // width: '100px',
                      // height: '20px',
                      
                      fontStyle: 'normal',
                      fontWeight: 700,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.005em',
                      background: 'radial-gradient(106.59% 153.23% at 66.62% 0%, #2E4166 0%, #2E4166 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      textDecoration: 'none',
                      color: '#2E4166'
                    }}
                  >
                   {t('signupPage.registerNow')}
                  </Link>
                </div>
                <div 
                  style={{
                    // width: '180px',
                    // height: '20px',
                    
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.005em',
                    color: '#2E4166',
                    // flex: 'none',
                    // order: 1,
                    // flexGrow: 0
                  }}
                  className={`${isRTL ? 'ml-0' : 'ml-8'}`}
                >
                 {t('signupPage.noAccount')}
                </div>
              </div>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  // width: '400px',
                  height: '60px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
              >
                <div 
                  style={{
                    width: '350px',
                    height: '60px',
                    
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    textAlign: 'center',
                    letterSpacing: '0.005em',
                    color: '#2E4166',
                    opacity: 0.5,
                    flex: 'none',
                    order: 0,
                    flexGrow: 0
                  }}
                >
                  {t('signupPage.termsMessage')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left - Logo Section - Fixed */}
        <AuthHero />

      </div>
    </div>
  );
};

export default Login;