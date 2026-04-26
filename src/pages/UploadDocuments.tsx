import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useDocumentStatus } from '@/hooks/useDocumentStatus';
import { uploadsApi } from '@/api/endpoints/uploads';

interface DocumentUpload {
  id: string;
  file: File | null;
  docType: string;
  expiryDate: string;
  uploaded: boolean;
  uploadId?: number;
}

const UploadDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { refetch } = useDocumentStatus();
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { id: '1', file: null, docType: 'National ID', expiryDate: '', uploaded: false },
    { id: '2', file: null, docType: 'Commercial Registration', expiryDate: '', uploaded: false },
    { id: '3', file: null, docType: 'Business License', expiryDate: '', uploaded: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleFileChange = (id: string, file: File | null) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, file, uploaded: false } : doc
    ));
  };

  const handleDocTypeChange = (id: string, docType: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, docType } : doc
    ));
  };

  const handleExpiryDateChange = (id: string, expiryDate: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, expiryDate } : doc
    ));
  };

  const uploadDocument = async (document: DocumentUpload) => {
    if (!document.file || !user?.id) return;

    try {
      const response = await uploadsApi.uploadUserDocument(
        document.file,
        document.docType,
        document.expiryDate
      );
      
      return response.id;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const uploadPromises = documents
        .filter(doc => doc.file && !doc.uploaded)
        .map(async (doc) => {
          const uploadId = await uploadDocument(doc);
          return { ...doc, uploaded: true, uploadId };
        });

      const results = await Promise.all(uploadPromises);
      
      // Update documents state with upload results
      setDocuments(prev => prev.map(doc => {
        const result = results.find(r => r.id === doc.id);
        return result || doc;
      }));

      setSuccess('تم رفع المستندات بنجاح! سيتم مراجعة طلبك خلال 24 ساعة.');
      
      // Refresh document status and redirect to dashboard
      await refetch();
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      setError('حدث خطأ أثناء رفع المستندات. يرجى المحاولة مرة أخرى.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, file: null, uploaded: false, uploadId: undefined } : doc
    ));
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div 
      className="min-h-screen bg-background flex items-start"
      style={{
        fontFamily: "'IBM Plex Sans Arabic'",
        background: '#FFFFFF',
        direction: 'ltr'
      }}
    >
      {/* Container */}
      <div className="w-full h-screen flex" style={{ direction: 'ltr' }}>
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
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              objectFit: 'contain'
            }}
          />
          
          {/* Main logo */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              zIndex: 10
            }}
          >
            <img 
              src="/lovable-uploads/logo-white.png"
              alt="Logo"
              loading="lazy"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain'
              }}
            />
            <div 
              style={{
                fontFamily: "'IBM Plex Sans Arabic'",
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '32px',
                textAlign: 'center',
                color: '#FFFFFF',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              منصة إسكان
            </div>
            <div 
              style={{
                fontFamily: "'IBM Plex Sans Arabic'",
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                textAlign: 'center',
                color: '#E8E8E9',
                maxWidth: '300px'
              }}
            >
              رفع المستندات المطلوبة للمتابعة
            </div>
          </div>
          </div>
        </div>

        {/* Right - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto p-4" style={{ direction: 'rtl' }}>
          <div className="flex flex-col justify-center items-center gap-6 w-full max-w-lg mx-auto min-h-screen">
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
                رفع المستندات المطلوبة
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
                يرجى رفع المستندات المطلوبة للمتابعة إلى لوحة التحكم
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
                gap: '24px',
                width: '100%',
                flex: 'none',
                order: 2,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              {/* Documents List */}
              {documents.map((document) => (
                <div 
                  key={document.id}
                  style={{
                    width: '100%',
                    padding: '24px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E9',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: '0 2px 8px rgba(46, 65, 102, 0.08)'
                  }}
                >
                  {/* Document Type */}
                  <div>
                    <label 
                      style={{
                        fontFamily: "'IBM Plex Sans Arabic'",
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#2E4166',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      نوع المستند
                    </label>
                    <select
                      value={document.docType}
                      onChange={(e) => handleDocTypeChange(document.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E8E8E9',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: "'IBM Plex Sans Arabic'",
                        background: '#FFFFFF',
                        color: '#2E4166',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                    >
                      <option value="National ID">الهوية الوطنية</option>
                      <option value="Commercial Registration">السجل التجاري</option>
                      <option value="Business License">رخصة العمل</option>
                      <option value="Passport">جواز السفر</option>
                      <option value="Other">أخرى</option>
                    </select>
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label 
                      style={{
                        fontFamily: "'IBM Plex Sans Arabic'",
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#2E4166',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="date"
                      value={document.expiryDate}
                      onChange={(e) => handleExpiryDateChange(document.id, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E8E8E9',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: "'IBM Plex Sans Arabic'",
                        color: '#2E4166',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label 
                      style={{
                        fontFamily: "'IBM Plex Sans Arabic'",
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#2E4166',
                        marginBottom: '8px',
                        display: 'block'
                      }}
                    >
                      الملف
                    </label>
                    
                    {/* Upload Area */}
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '24px',
                        gap: '12px',
                        width: '100%',
                        background: document.file ? '#F8FAFD' : '#FFFFFF',
                        border: document.file ? '2px solid #2E4166' : '1px dashed #E8E8E9',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.pdf,.jpg,.jpeg,.png';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleFileChange(document.id, file);
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
                          background: document.file ? '#2E4166' : '#F8FAFD',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px'
                        }}
                      >
                        {document.file ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10l5-5 5 5" stroke="#516180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 5v14" stroke="#516180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      
                      <div 
                        style={{
                          fontFamily: "'IBM Plex Sans Arabic'",
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '14px',
                          color: document.file ? '#2E4166' : '#516180',
                          marginBottom: '4px'
                        }}
                      >
                        {document.file ? 'تم اختيار الملف' : 'اضغط لرفع الملف'}
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
                        PDF, JPG, PNG (حد أقصى 10 ميجابايت)
                      </div>

                      {document.file && (
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginTop: '8px'
                          }}
                        >
                          <div 
                            style={{
                              fontFamily: "'IBM Plex Sans Arabic'",
                              fontSize: '12px',
                              color: '#2E4166',
                              fontWeight: 500
                            }}
                          >
                            {document.file.name}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDocument(document.id);
                            }}
                            style={{
                              padding: '4px 8px',
                              background: '#FF4444',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '10px',
                              cursor: 'pointer',
                              fontFamily: "'IBM Plex Sans Arabic'"
                            }}
                          >
                            إزالة
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Status */}
                  {document.uploaded && (
                    <div 
                      style={{
                        padding: '12px 16px',
                        background: '#E8F5E8',
                        color: '#2E7D32',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontFamily: "'IBM Plex Sans Arabic'",
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      تم رفع المستند بنجاح
                    </div>
                  )}
                </div>
              ))}

              {/* Error Message */}
              {error && (
                <div 
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: '#FFEBEE',
                    color: '#C62828',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'IBM Plex Sans Arabic'",
                    textAlign: 'center',
                    border: '1px solid #FFCDD2'
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div 
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: '#E8F5E8',
                    color: '#2E7D32',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'IBM Plex Sans Arabic'",
                    textAlign: 'center',
                    border: '1px solid #C8E6C9'
                  }}
                >
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || documents.every(doc => !doc.file)}
                style={{
                  width: '100%',
                  height: '56px',
                  background: loading ? '#CCCCCC' : '#2E4166',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Sans Arabic'",
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(46, 65, 102, 0.15)'
                }}
              >
                {loading ? 'جاري الرفع...' : 'رفع المستندات والمتابعة'}
              </button>

              {/* Skip for now button */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '100%',
                  height: '56px',
                  background: 'transparent',
                  color: '#2E4166',
                  border: '2px solid #2E4166',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Sans Arabic'",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                تخطي الآن
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;