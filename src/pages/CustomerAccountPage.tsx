import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserDetails } from '@/hooks/useUserDetails';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  User, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  FileText, 
  Calendar,
  Save,
  Edit,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { usersApi } from '@/api';




const CustomerAccountPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { userDetails, loading, error, updateUserDetails } = useUserDetails();
  const [isEditing, setIsEditing] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  // ________________________________________________________________________
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [deactivating, setDeactivating] = useState(false);
  const [isRequestingReactivation, setIsRequestingReactivation] = useState(false);
  // ________________________________________________________________________
  const [originalFormData, setOriginalFormData] = useState({
    company_name: '',
    registration_number: '',
    approx_employee_count: '',
    business_activity: '',
    responsible_person: '',
    first_phone_number: '',
    responsible_position: '',
    second_responsible_person: '',
    second_phone_number: '',
    favorite_area: ''
  });
  const [formData, setFormData] = useState({
    company_name: '',
    registration_number: '',
    approx_employee_count: '',
    business_activity: '',
    responsible_person: '',
    first_phone_number: '',
    responsible_position: '',
    second_responsible_person: '',
    second_phone_number: '',
    favorite_area: ''
  });

  // Initialize form data when userDetails are loaded
  useEffect(() => {
    if (userDetails) {
      const initialFormData = {
        company_name: userDetails.company_name || '',
        registration_number: userDetails.registration_number || '',
        approx_employee_count: userDetails.approx_employee_count?.toString() || '',
        business_activity: userDetails.business_activity || '',
        responsible_person: userDetails.responsible_person || '',
        first_phone_number: userDetails.first_phone_number || '',
        responsible_position: userDetails.responsible_position || '',
        second_responsible_person: userDetails.second_responsible_person || '',
        second_phone_number: userDetails.second_phone_number || '',
        favorite_area: userDetails.favorite_area || ''
      };
      
      setFormData(initialFormData);
      setOriginalFormData(initialFormData); // Store original data for cancel functionality
    }
  }, [userDetails]);

// alert(userDetails.updated_at)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Phone number  Validation
      const phonePattern = /^9665\d{8}$/;
      if (!phonePattern.test(formData.first_phone_number) || !phonePattern.test(formData.second_phone_number)) {
        toast.error(t('phone_must_start_with')); 
        return;
      }
      
      // Validate required fields
      if (!formData.company_name?.trim()) {
        toast.error(t('company_name_required'));
        setIsSaving(false);
        return;
      }

      if (formData.registration_number.length !== 10) {
        toast.error(t('signupPage.invalid_registration_number')); 
        return;
      }

      if (!formData.responsible_person?.trim()) {
        toast.error(t('responsible_person_required'));
        setIsSaving(false);
        return;
      }

      // Convert string values to appropriate types
      const updateData = {
        company_name: formData.company_name.trim(),
        registration_number: formData.registration_number.trim() || null,
        approx_employee_count: formData.approx_employee_count ? parseInt(formData.approx_employee_count) : null,
        business_activity: formData.business_activity.trim() || null,
        responsible_person: formData.responsible_person.trim(),
        first_phone_number: formData.first_phone_number.trim() || null,
        responsible_position: formData.responsible_position.trim() || null,
        second_responsible_person: formData.second_responsible_person.trim() || null,
        second_phone_number: formData.second_phone_number.trim() || null,
        favorite_area: formData.favorite_area.trim() || null
      };

      const result = await updateUserDetails(updateData);
      
      // Update original form data with the new values
      setOriginalFormData(formData);
      
      setIsEditing(false);
      toast.success(t('update_success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('update_failed');
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(originalFormData);
    setIsEditing(false);
  };


  // _______________________________________________________________________
  // Handle Deactivate Account Customer :-
  const handleDeactivateAccount = async () => {
    if (!deactivationReason.trim()) {
      toast.error(t('deactivation_reason_required'));
      return;
    }

    try {
      setDeactivating(true);
      await usersApi.deactivateOwner(deactivationReason.trim());
      toast.success(t('account_deactivated_successfully'));
      setOpenDeactivateDialog(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || t('something_went_wrong'));
    } finally {
      setDeactivating(false);
    }
  };

  // Handle Request Reactivation Cutomer :-
  const handleRequestReactivation = async () => {
    try {
      setIsRequestingReactivation(true);
      await usersApi.requestOwnerReactivation(userDetails.user_id);
      toast.success(t('reactivation_request_sent'));
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || t('something_went_wrong'));
    } finally {
      setIsRequestingReactivation(false);
    }
  };
  // _______________________________________________________________________



  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{t('load_data_failed')}</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex sm:items-center justify-between gap-4 sm:gap-0 flex-col md:flex-row bg-white p-4 rounded-md shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold t mb-2">{t('my_account')}</h1>
          <p className="text-sm sm:text-base">{t('account_management_subtitle')}</p>
        </div>
          
        <div className="flex items-center gap-2 flex-wrap ">
          {user?.user_type === 'customer' && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hidden md:block">
              {t('account_type_customer')}
            </Badge>
          )}
          {userDetails?.status === 'suspended' ? (
            <Button
              onClick={handleRequestReactivation}
              disabled={isRequestingReactivation}
              className="bg-green-500 text-white"
            >
              {isRequestingReactivation
                ? t('sending_request')
                : t('reactivate_account')}
            </Button>
            ) : (
              <Dialog open={openDeactivateDialog} onOpenChange={setOpenDeactivateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-red-500 text-white p-2 sm:p-4 text-sm sm:text-base ">
                    {t('deactivate_account')}
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('deactivate_account')}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <Label>{t('deactivation_reason')}</Label>
                    <Input
                      value={deactivationReason}
                      onChange={(e) => setDeactivationReason(e.target.value)}
                      placeholder={t('enter_reason_here')}
                    />

                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">{t('cancel')}</Button>
                      </DialogClose>

                      <Button
                        onClick={handleDeactivateAccount}
                        disabled={deactivating}
                        className="bg-red-500 text-white p-2 sm:p-4 text-sm sm:text-base "
                      >
                        {deactivating ? t('deactivating') : t('confirm_deactivation')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 ml-2 text-sm sm:text-base" />
                {t('edit_profile')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  {t('cancel')}
                </Button>

                <Button className='bg-green-700' onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : (
                    <Save className="w-4 h-4 ml-2" />
                  )}
                  {t('save_changes')}
                </Button>
              </div>
            )}
            <Badge variant="secondary" className="bg-blue-100 text-blue-800  md:hidden">
              {t('account_type_customer')}
            </Badge>
        </div>

      </div>
      

      { loading 
        ?(
          <div className="flex items-center flex-col pt-40 gap-4 h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('loading_data')}</p>
          </div>
        )
        :(
          <>
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                  <Building2 className="w-5 h-5" />
                  {t('company_info')}
                  {isEditing && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {t('edit_mode')}
                    </Badge>
                  )}
                </CardTitle>

              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">{t('company_name')}</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      disabled
                      placeholder={t('company_name')}
                      className={!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="registration_number">{t('registration_number')}</Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) =>{
                        // Remove non-digit characters
                        const value = e.target.value.replace(/\D/g, ''); 
                        handleInputChange('registration_number', value)}
                      } 
                      maxLength={10}
                      disabled
                      placeholder={t('registration_number')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="approx_employee_count">{t('approx_employee_count')}</Label>
                    <Input
                      id="approx_employee_count"
                      type="number"
                      value={formData.approx_employee_count}
                      onChange={(e) => handleInputChange('approx_employee_count', e.target.value)}
                      disabled={!isEditing}
                      placeholder={t('approx_employee_count')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="business_activity">{t('business_activity')}</Label>
                    <Input
                      id="business_activity"
                      value={formData.business_activity}
                      onChange={(e) => handleInputChange('business_activity', e.target.value)}
                      disabled={!isEditing}
                      placeholder={t('business_activity')}
                    />
                  </div>
                </div>
              </CardContent>

            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                    <User className="w-5 h-5" />
                    {t('contact_info')}
                    {isEditing && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {t('edit_mode')}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="responsible_person">{t('responsible_person')}</Label>
                    <Input
                      id="responsible_person"
                      value={formData.responsible_person}
                      onChange={(e) => handleInputChange('responsible_person', e.target.value)}
                      disabled={!isEditing}
                      placeholder={t('responsible_person_placeholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="responsible_position">{t('responsible_position')}</Label>
                    <Input
                      id="responsible_position"
                      value={formData.responsible_position}
                      onChange={(e) => handleInputChange('responsible_position', e.target.value)}
                      disabled={!isEditing}
                      placeholder={t('responsible_position_placeholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="first_phone_number">{t('first_phone_number')}</Label>
                    <Input
                      id="first_phone_number"
                      value={formData.first_phone_number}
                      onChange={(e) => handleInputChange('first_phone_number', e.target.value)}
                      disabled={!isEditing}
                      minLength={12}
                      maxLength={12}
                      // placeholder={t('first_phone_number_placeholder')}
                      placeholder='9665xxxxxxxx'
                    />
                  </div>

                  <div>
                    <Label htmlFor="second_responsible_person">{t('second_responsible_person')}</Label>
                    <Input
                      id="second_responsible_person"
                      value={formData.second_responsible_person}
                      onChange={(e) => handleInputChange('second_responsible_person', e.target.value)}
                      disabled={!isEditing}
                      placeholder={t('second_responsible_person_placeholder')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="second_phone_number">{t('second_phone_number')}</Label>
                    <Input
                      id="second_phone_number"
                      value={formData.second_phone_number}
                      onChange={(e) => handleInputChange('second_phone_number', e.target.value)}
                      minLength={12}
                      maxLength={12}
                      disabled={!isEditing}
                      // placeholder={t('second_phone_number_placeholder')}
                      placeholder='9665xxxxxxxx'
                    />
                  </div>

                  <div>
                    <Label htmlFor="favorite_area">{t('favorite_area')}</Label>
                    <Input
                      id="favorite_area"
                      value={formData.favorite_area}
                      onChange={(e) => handleInputChange('favorite_area', e.target.value)}
                      disabled={!isEditing}
                      placeholder={t('favorite_area_placeholder')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                  <Mail className="w-5 h-5" />
                  {t('account_info')}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('email_cannot_be_changed')}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="user_id">{t('user_id')}</Label>
                    <Input
                      id="user_id"
                      value={userDetails?.user_id || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="created_at">{t('created_at')}</Label>
                    <Input
                      id="created_at"
                      // value={userDetails?.created_at ? new Date(userDetails.created_at).toLocaleDateString('ar-SA') : ''}
                      value={
                        userDetails?.created_at
                          ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }).format(new Date(userDetails.created_at))
                          : ''
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="updated_at">{t('updated_at')}</Label>
                    <Input
                      id="updated_at"
                      // value={userDetails?.updated_at ? new Date(userDetails.updated_at).toLocaleDateString('ar-SA') : ''}
                      value={
                        userDetails?.updated_at
                          ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }).format(new Date(userDetails.updated_at))
                          : ''
                      }
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )
      }


    </div>
  );
};

export default CustomerAccountPage;
