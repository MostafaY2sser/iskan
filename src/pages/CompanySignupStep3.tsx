import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useDocumentStatus } from '@/hooks/useDocumentStatus';
import { uploadsApi } from '@/api/endpoints/uploads';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  Eye, 
  Trash2, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import flatpickr from 'flatpickr';
import { useTranslation } from 'react-i18next';

interface SelectedFile {
  id: string;
  file: File;
  docType: string;
  expiryDate: string;
  status: 'selected' | 'uploading' | 'uploaded' | 'error';
  progress: number;
  uploadId?: number;
  error?: string;
}

interface UploadedDocument {
  id: number;
  file_path: string;
  entity_type: string;
  entity_id: number;
  uploaded_at: string;
  doc_type?: string;
  expiry_date?: string;
}


const CompanySignupStep3: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refetch } = useDocumentStatus();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t  } = useTranslation()
  const [hasUploadedFalLicense, setHasUploadedFalLicense] = useState(false);


  // useEffect(() => {
  //   const hasFal = selectedFiles.some(file => file.docType === "رخصة فال");
  //   setHasUploadedFalLicense(hasFal);
  // }, [selectedFiles]);

  
 useEffect(() => {
  const hasFal = uploadedDocuments.some(doc => doc.doc_type === "رخصة فال") ||
                 selectedFiles.some(file => file.docType === "رخصة فال");
  setHasUploadedFalLicense(hasFal);
}, [selectedFiles, uploadedDocuments]);


  


  // _____________________________________________________________________________________________________________________________________________________________________________________________
  // Load existing documents on component mount
  // useEffect(() => {
  //   if (user?.id) {
  //     loadUploadedDocuments();
  //   }
  // }, [user?.id]);


  
  // const loadUploadedDocuments = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await uploadsApi.listUserSignupDocuments(user!.id);
  //     setUploadedDocuments(response?.results || []);
  //   } catch (err) {
  //     // Enhanced error logging for document loading
  //     console.error('=== DOCUMENT LOADING ERROR DETAILS ===');
  //     console.error('User ID:', user?.id);
  //     console.error('Error Object:', err);
      
  //     if (err instanceof Error) {
  //       console.error('Error Message:', err.message);
  //       console.error('Error Stack:', err.stack);
  //     }
      
  //     // Check if it's an API error with response details
  //     if (err && typeof err === 'object' && 'response' in err) {
  //       const apiError = err as any;
  //       console.error('API Response Status:', apiError.response?.status);
  //       console.error('API Response Data:', apiError.response?.data);
  //       console.error('API Response Headers:', apiError.response?.headers);
  //     }
      
  //     console.error('=== END DOCUMENT LOADING ERROR DETAILS ===');
      
  //     setError('فشل في تحميل الوثائق الموجودة');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const location = useLocation();
  const userIdFromState = location.state?.userId;

  useEffect(() => {
    const userId = userIdFromState || user?.id;

    if (!userId) {
      console.warn("لا يوجد userId متاح، لن يتم تحميل الوثائق.");
      return;
    }

    console.log("تحميل المستندات للمستخدم:", userId);
    loadUploadedDocuments(userId);
  }, [userIdFromState, user?.id]);

  const loadUploadedDocuments = async (userId?: number | string) => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await uploadsApi.listUserSignupDocuments(userId);
      setUploadedDocuments(response?.results || []);
      setError(null); 
    } catch (err) {
      console.error("فشل في تحميل المستندات:", err);
      setError("فشل في تحميل الوثائق الموجودة");
    } finally {
      setLoading(false);
    }
  };
  // _____________________________________________________________________________________________________________________________________________________________________________________________




  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newFiles: SelectedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      docType: '',
      expiryDate: '',
      status: 'selected',
      progress: 0
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateFileData = (id: string, updates: Partial<SelectedFile>) => {
    setSelectedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const removeSelectedFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };



  // ______________________________________________________________________________________________________________________________
  // const uploadFile = async (selectedFile: SelectedFile) => {
  //   try {
  //     updateFileData(selectedFile.id, { status: 'uploading', progress: 0, error: undefined });

  //     const formData = new FormData();
  //     formData.append('file', selectedFile.file);
  //     formData.append('doc_type', selectedFile.docType);
  //     formData.append('expiry_date', selectedFile.expiryDate);

  //     // Simulate progress
  //     const progressInterval = setInterval(() => {
  //       updateFileData(selectedFile.id, { progress: prev => Math.min(prev + 10, 90) });
  //     }, 200);

  //     const result = await uploadsApi.uploadUserSignupDocument(formData);
      
  //     clearInterval(progressInterval);
  //     updateFileData(selectedFile.id, { 
  //       status: 'uploaded', 
  //       progress: 100, 
  //       uploadId: result.id,
  //       error: undefined
  //     });

  //     // Refresh uploaded documents list
  //     await loadUploadedDocuments();

  //   } catch (err) {
  //     // Enhanced error logging with detailed information
  //     console.error('=== UPLOAD ERROR DETAILS ===');
  //     console.error('File:', selectedFile.file.name);
  //     console.error('File Size:', selectedFile.file.size, 'bytes');
  //     console.error('File Type:', selectedFile.file.type);
  //     console.error('Document Type:', selectedFile.docType);
  //     console.error('Expiry Date:', selectedFile.expiryDate);
  //     console.error('Error Object:', err);
      
  //     if (err instanceof Error) {
  //       console.error('Error Message:', err.message);
  //       console.error('Error Stack:', err.stack);
  //     }
      
  //     // Check if it's an API error with response details
  //     if (err && typeof err === 'object' && 'response' in err) {
  //       const apiError = err as any;
  //       console.error('API Response Status:', apiError.response?.status);
  //       console.error('API Response Data:', apiError.response?.data);
  //       console.error('API Response Headers:', apiError.response?.headers);
  //     }
      
  //     // Check if it's a network error
  //     if (err && typeof err === 'object' && 'code' in err) {
  //       const networkError = err as any;
  //       console.error('Network Error Code:', networkError.code);
  //       console.error('Network Error Message:', networkError.message);
  //     }
      
  //     console.error('=== END ERROR DETAILS ===');
      
  //     // Determine user-friendly error message
  //     let userErrorMessage = 'فشل في رفع الملف';
  //     if (err instanceof Error) {
  //       if (err.message.includes('Network Error') || err.message.includes('fetch')) {
  //         userErrorMessage = 'خطأ في الشبكة - تحقق من اتصال الإنترنت';
  //       } else if (err.message.includes('413') || err.message.includes('too large')) {
  //         userErrorMessage = 'حجم الملف كبير جداً - الحد الأقصى 10MB';
  //       } else if (err.message.includes('415') || err.message.includes('unsupported')) {
  //         userErrorMessage = 'نوع الملف غير مدعوم - استخدم PDF, JPG, PNG';
  //       } else if (err.message.includes('401') || err.message.includes('unauthorized')) {
  //         userErrorMessage = 'غير مصرح - يرجى تسجيل الدخول مرة أخرى';
  //       } else if (err.message.includes('500') || err.message.includes('server')) {
  //         userErrorMessage = 'خطأ في الخادم - يرجى المحاولة لاحقاً';
  //       } else {
  //         userErrorMessage = `خطأ: ${err.message}`;
  //       }
  //     }
      
  //     updateFileData(selectedFile.id, { 
  //       status: 'error', 
  //       error: userErrorMessage,
  //       progress: 0
  //     });
  //   }
  // };

  const uploadFile = async (selectedFile: SelectedFile) => {
    try {
      updateFileData(selectedFile.id, { status: 'uploading', progress: 0, error: undefined });

      const formData = new FormData();
      formData.append('file', selectedFile.file);
      formData.append('doc_type', selectedFile.docType);
      formData.append('expiry_date', selectedFile.expiryDate);

      const progressInterval = setInterval(() => {
        updateFileData(selectedFile.id, { progress: prev => Math.min(prev + 10, 90) });
      }, 200);

      const result = await uploadsApi.uploadUserSignupDocument(formData);

      clearInterval(progressInterval);

      updateFileData(selectedFile.id, { 
        status: 'uploaded', 
        progress: 100, 
        uploadId: result.id,
        error: undefined
      });

      setUploadedDocuments(prev => [
        ...prev,
        {
          id: result.id,
          file_path: result.file_path,
          entity_type: result.entity_type,
          entity_id: result.entity_id,
          uploaded_at: result.uploaded_at,
          doc_type: selectedFile.docType,
          expiry_date: selectedFile.expiryDate,
          signed_url: result.signed_url 
        }
      ]);

      await loadUploadedDocuments(userIdFromState || user?.id);


    } catch (err) {
      console.error(err);
      updateFileData(selectedFile.id, { status: 'error', error: 'فشل في رفع الملف', progress: 0 });
    }
  };
// ______________________________________________________________________________________________________________________________







  const retryUpload = async (fileId: string) => {
    const file = selectedFiles.find(f => f.id === fileId);
    if (file && file.status === 'error') {
      await uploadFile(file);
    }
  };

  const uploadAllFiles = async () => {
    const filesToUpload = selectedFiles.filter(f => 
      (f.status === 'selected' || f.status === 'error') && f.docType && f.expiryDate
    );

    if (filesToUpload.length === 0) {
      setError('يرجى تحديد نوع الوثيقة وتاريخ الانتهاء لجميع الملفات');
      return;
    }

    setError(null);
    
    for (const file of filesToUpload) {
      await uploadFile(file);
    }
  };

  const deleteDocument = async (documentId: number) => {
    try {
      await uploadsApi.deleteUserDocument(documentId);
      await loadUploadedDocuments();
    } catch (err) {
      // Enhanced error logging for document deletion
      console.error('=== DOCUMENT DELETION ERROR DETAILS ===');
      console.error('Document ID:', documentId);
      console.error('Error Object:', err);
      
      if (err instanceof Error) {
        console.error('Error Message:', err.message);
        console.error('Error Stack:', err.stack);
      }
      
      // Check if it's an API error with response details
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as any;
        console.error('API Response Status:', apiError.response?.status);
        console.error('API Response Data:', apiError.response?.data);
        console.error('API Response Headers:', apiError.response?.headers);
      }
      
      console.error('=== END DOCUMENT DELETION ERROR DETAILS ===');
      
      setError('فشل في حذف الوثيقة');
    }
  };

  const viewDocument = async (documentId: number) => {
    try {
      const result = await uploadsApi.viewUserDocument(documentId);
      window.open(result.signed_url, '_blank');
    } catch (err) {
      // Enhanced error logging for document viewing
      console.error('=== DOCUMENT VIEWING ERROR DETAILS ===');
      console.error('Document ID:', documentId);
      console.error('Error Object:', err);
      
      if (err instanceof Error) {
        console.error('Error Message:', err.message);
        console.error('Error Stack:', err.stack);
      }
      
      // Check if it's an API error with response details
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as any;
        console.error('API Response Status:', apiError.response?.status);
        console.error('API Response Data:', apiError.response?.data);
        console.error('API Response Headers:', apiError.response?.headers);
      }
      
      console.error('=== END DOCUMENT VIEWING ERROR DETAILS ===');
      
      // setError('فشل في فتح الوثيقة');
    }
  };

  // const canContinue = uploadedDocuments.length > 0;

  const canContinue = uploadedDocuments.length > 0 || selectedFiles.some(f => f.status === 'uploaded');


  const handleContinue = async () => {
    if (canContinue) {
      // Refresh document status cache before navigating to dashboard
      await refetch();
      // navigate('/dashboard');
      navigate('/dashboard', { replace: true });
      // OnUpload Document reload page to navigate Dashboard :- 
      window.location.reload(); 
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
      <div className="w-full h-screen flex flex-row-reverse">
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

        {/* Right - Form Section - Scrollable */}
        <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto p-4">
          <div className="flex flex-col justify-start items-center gap-6 w-full max-w-lg mx-auto min-h-full py-8">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div 
                style={{
                 
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
                {t('upload_documents')}
              </div>
              <div 
                style={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.005em',
                  color: '#516180'
                }}
              >
                {t('upload_documents_description')}
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6 w-full" style={{ direction: 'rtl' }}>
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center font-['IBM_Plex_Sans_Arabic'] text-xs font-semibold">
                  ✓
                </div>
                <div className="font-['IBM_Plex_Sans_Arabic'] text-xs text-[#516180] hidden sm:block" style={{ marginTop: '8px' }}>
                 {t('signupPage.accountType')}
                </div>
              </div>

              <div className="w-8 h-0.5 bg-[#2E4166]" />

              {/* Step 2 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center font-['IBM_Plex_Sans_Arabic'] text-xs font-semibold">
                  ✓
                </div>
                <div className="font-['IBM_Plex_Sans_Arabic'] text-xs text-[#516180] hidden sm:block" style={{ marginTop: '8px' }}>
                  {/* {t('housing_recruitment_information')} */}
                  {t('company_basic_information')}
                </div>
              </div>

              <div className="w-8 h-0.5 bg-[#2E4166]" />

              {/* Step 3 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2E4166] text-white flex items-center justify-center font-['IBM_Plex_Sans_Arabic'] text-sm font-semibold">
                  3
                </div>
                <div className="font-['IBM_Plex_Sans_Arabic'] text-xs text-[#2E4166] hidden sm:block" style={{ marginTop: '8px' }}>
                    {t('upload_documents')}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 font-['IBM Plex Sans Arabic'] text-sm">{error}</span>
              </div>
            )}

            {/* File Upload Area */}
            <div className="w-full">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-[#E8E8E9] rounded-lg text-center cursor-pointer hover:border-[#2E4166] transition-colors"
              >
                <Upload className="w-12 h-12 text-[#516180] mx-auto mb-4" />
                <div className="font-['IBM Plex Sans Arabic'] text-lg text-[#2E4166] mb-2">
                 {t('upload_required_documents')}
                </div>
                <div className="font-['IBM Plex Sans Arabic'] text-sm text-[#516180]">
                 {t('click_or_drag_files')}
                </div>
                <div className="font-['IBM Plex Sans Arabic'] text-xs text-[#516180] mt-2">
                  {t('file_formats_note')}
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="w-full">
                <h3 className="font-['IBM Plex Sans Arabic'] text-lg text-[#2E4166] mb-4 text-right">
                 {t('selected_files')}
                </h3>
                <div className="space-y-4">
                  {selectedFiles.map((file) => (
                    <Card key={file.id} className="border-2 border-[#2E4166]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-[#2E4166]" />
                            <div>
                              <div className="font-['IBM Plex Sans Arabic'] text-sm text-[#2E4166]">
                                {file.file.name}
                              </div>
                              <div className="font-['IBM Plex Sans Arabic'] text-xs text-[#516180]">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {file.status === 'selected' && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {t('selected')}
                              </Badge>
                            )}
                            {file.status === 'uploading' && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                               {t('uploading')}
                              </Badge>
                            )}
                            {file.status === 'uploaded' && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                               {t('uploaded')}
                              </Badge>
                            )}
                            {file.status === 'error' && (
                              <Badge variant="destructive">
                                خطأ
                              </Badge>
                            )}
                            
                            {file.status === 'selected' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSelectedFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                            {file.status === 'error' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => retryUpload(file.id)}
                                className="text-blue-500 hover:text-blue-700"
                                title="إعادة المحاولة"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {file.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div 
                              className="bg-[#2E4166] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}

                        {/* Error Message */}
                        {file.status === 'error' && file.error && (
                          <div className="text-red-600 text-sm mb-4 font-['IBM Plex Sans Arabic']">
                            {file.error}
                          </div>
                        )}

                        {/* Form Fields for Document Type and Expiry */}
                        {file.status === 'selected' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="font-['IBM Plex Sans Arabic'] text-sm text-[#2E4166]">
                               {t('document_type_label')}
                              </Label>
                              <select
                                value={file.docType}
                                onChange={(e) => updateFileData(file.id, { docType: e.target.value })}
                                className="w-full p-2 border border-[#E8E8E9] rounded-lg text-sm font-['IBM Plex Sans Arabic'] text-right"
                                style={{ direction: 'rtl' }}
                              >
                                <option value=""> {t('select_document_type')}</option>
                                {/* <option value="هوية وطنية"> {t('national_id')}</option> */}
                                {/* <option value="جواز سفر">{t('passport')}</option> */}
                                {/* <option value="رخصة فال">{t('رخصة فال')}</option> */}
                                {/* <option value="رخصة تجارية">{t('commercial_license')}</option> */}
                                {/* <option value="شهادة تسجيل"> {t('registration_certificate')}</option> */}
                                {/* <option value="وثيقة أخرى"> {t('other_document')}</option> */}
                                <option 
                                  value="رخصة فال" 
                                  disabled={hasUploadedFalLicense} 
                                >
                                  {t('val_license')}
                                </option>
                                <option 
                                  value="رخصة تجارية" 
                                  disabled={!hasUploadedFalLicense} // لازم تكون رخصة فال مرفوعة قبل ما يختار تجارية
                                >
                                  {t('commercial_license')}
                                </option>

                              </select>
                            </div>
                            
                            <div>
                              <Label className="font-['IBM Plex Sans Arabic'] text-sm text-[#2E4166]">
                               {t('expiry_date')}
                              </Label>
                              {/* <Input
                                type="date"
                                value={file.expiryDate}
                                onChange={(e) => updateFileData(file.id, { expiryDate: e.target.value })}
                                className="w-full p-2 border border-[#E8E8E9] rounded-lg text-sm font-['IBM Plex Sans Arabic']"
                              /> */}
                              <Flatpickr
                                  options={{ dateFormat: "Y-m-d" }} 
                                  value={file.expiryDate ? new Date(file.expiryDate) : ""}
                                  onChange={([date]) => {
                                    const formattedDate = date ? flatpickr.formatDate(date, "Y-m-d") : "";
                                    updateFileData(file.id, {
                                      expiryDate: formattedDate
                                    });
                                    // alert(formattedDate); 
                                  }}
                                  className="w-full p-2 border rounded-lg"
                                />  
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Upload Button */}
                <Button
                  onClick={uploadAllFiles}
                  disabled={selectedFiles.filter(f => (f.status === 'selected' || f.status === 'error') && f.docType && f.expiryDate).length === 0}
                  className="w-full mt-4 bg-[#2E4166] hover:bg-[#1f2d47] text-white font-['IBM Plex Sans Arabic']"
                >
                  {selectedFiles.some(f => f.status === 'error') ? 'إعادة رفع الملفات' : t('upload_selected_files') }
                </Button>
              </div>
            )}

            {/* Uploaded Documents */}
            {uploadedDocuments.length > 0 && (
              <div className="w-full">
                <h3 className="font-['IBM Plex Sans Arabic'] text-lg text-[#2E4166] mb-4 text-right">
                  {t('uploaded_documents')}
                </h3>
                <div className="space-y-3">
                  {uploadedDocuments.map((doc , index) => (
                    <Card key={doc.id} className="border border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Check className="w-6 h-6 text-green-600" />
                            <div>
                              <a className='' target='_blank' href={`${doc.signed_url}`}> {index + 1} -   {t('view_document')} </a>
                              {/* <div className="font-['IBM Plex Sans Arabic'] text-sm text-[#2E4166]">
                                {doc.doc_type || 'وثيقة' }
                              </div> */}
                              {/* <div className="font-['IBM Plex Sans Arabic'] text-xs text-[#516180]">
                                {new Date(doc.uploaded_at).toLocaleDateString('ar-SA')}
                              </div> */}
                            </div>
                        </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewDocument(doc.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <a  href={`${doc.signed_url}`} target='_blank' >
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="w-full mt-8">
              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                className="w-full bg-[#2E4166] hover:bg-[#1f2d47] text-white font-['IBM Plex Sans Arabic'] py-3"
              >
                {canContinue ? t('continue_to_dashboard') : t('at_least_one_document')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignupStep3;