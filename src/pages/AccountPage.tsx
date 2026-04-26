
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { usersApi } from '@/api';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [accountType, setAccountType] = useState<'owner' | 'company'>('owner');


  const [formData, setFormData] = useState({
    val_license_number: '',
    business_activity: '',
    phone_number: '',
    address: '',
    region: '',
    city: '',
    user_id: '',
    name: '',
    gender: '',
    status: '',
    reason: '',
    created_at: '',
    updated_at: ''
  });

  const [originalFormData, setOriginalFormData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState('');
  const [open, setOpen] = useState(false);
  const [isRequestingReactivation, setIsRequestingReactivation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'invoices'>('profile');


  // Fetch user data from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await usersApi.getOwnerDetails();
        const data = response?.data ?? response;

        const accountType = 'company_name' in data ? 'company' : 'owner';

        setFormData(data);
        setOriginalFormData(data);
        setAccountType(accountType); 
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(t('error_loading_data'));
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);




  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  // Save changes (only allowed fields)
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // val license number Validation  
      if (formData.val_license_number.length !== 10) {
        toast.error(t('signupPage.invalid_val_license_number')); 
        setIsSaving(false);
        return;
      }

      // Phone number  Validation
      const phonePattern = /^9665\d{8}$/;
      if (!phonePattern.test(formData.phone_number)) {
        toast.error(t('phone_must_start_with')); 
        return;
      }


      let updateData;
      let apiCall;

      if (accountType === 'owner') {
        // Owner Update
        updateData = {
          val_license_number: formData.val_license_number.trim(),
          business_activity: formData.business_activity.trim() || null,
          phone_number: formData.phone_number.trim() || null,
          address: formData.address.trim() || null,
          region: formData.region.trim() || null,
          city: formData.city.trim() || null
        };

        apiCall = usersApi.updateOwnerDetails(updateData);
      } else {
        //   Company Update
        updateData = {
          company_name: formData.company_name?.trim() || '',
          val_license_number: formData.val_license_number?.trim() || '',
          business_activity: formData.business_activity?.trim() || '',
          responsible_person: formData.responsible_person?.trim() || '',
          phone_number: formData.phone_number?.trim() || '',
          address: formData.address?.trim() || '',
          region: formData.region?.trim() || '',
          city: formData.city?.trim() || ''
        };

        apiCall = usersApi.updateCompanyDetails(updateData); 
      }

      await apiCall;

      toast.success(t('changes_saved_successfully'));
      setOriginalFormData(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(t('error_saving_changes'));
    } finally {
      setIsSaving(false);
    }
  };




  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditing(false);
    toast.info(t('changes_cancelled'));
  };



  // Deactivate account
  const handleDeactivateAccount = async () => {
    if (!deactivationReason.trim()) {
      toast.error(t('please_enter_deactivation_reason'));
      return;
    }

    try {
      setDeactivating(true);
      await usersApi.deactivateOwner(deactivationReason.trim());
      toast.success(t('account_deactivated_successfully'));
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail || t('account_deactivation_error'));
    } finally {
      setDeactivating(false);
    }
  };



  // Reactivate account
  const handleRequestReactivation = async () => {
    if (!formData.user_id) return;

    try {
      setIsRequestingReactivation(true);
      await usersApi.requestOwnerReactivation(formData.user_id);
      toast.success(t('account_activation_request_sent'));
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail || t('activation_request_error'));
    } finally {
      setIsRequestingReactivation(false);
    }
  };




  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading_data')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-[#ffffff] p-4 rounded-md shadow-md flex justify-between flex-col py-6 sm:flex-row gap-4 sm:gap-0">
        <div>
          <h1 className="responsive-heading text-[24px] font-[700] mb-2">{t('my_account')}</h1>
          <p className="text-[#828690] text-[14px] font-[400]">{t('manage_personal_info')}</p>
        </div>

        <div>
          {!deactivating ? (
            formData?.status === 'suspended' ? (
              <Button
                onClick={handleRequestReactivation}
                disabled={isRequestingReactivation}
                className="py-2 px-4 rounded-md bg-green-500 text-white"
              >
                {isRequestingReactivation ? t('sending_request') : t('activate_account')}
              </Button>
            ) : (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="py-2 px-4 rounded-md bg-red-500 text-white">
                    {t('deactivate_account')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('deactivate_account')}</DialogTitle>
                  </DialogHeader>

                  <div className="py-4 flex flex-col gap-2">
                    <Label>{t('deactivation_reason')}</Label>
                    <Input
                      value={deactivationReason}
                      onChange={(e) => setDeactivationReason(e.target.value)}
                      placeholder={t('enter_reason_here')}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">{t('cancel')}</Button>
                      </DialogClose>
                      <Button
                        onClick={handleDeactivateAccount}
                        disabled={!deactivationReason || loading}
                        className="bg-red-500 text-white"
                      >
                        {loading ? t('deactivating') : t('confirm_deactivation')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#ffffff] px-2 sm:px-6 pt-2 pb-6 rounded-lg shadow-md">
        <div className="flex gap-1 md:gap-3 border-b my-4 md:my-6 rounded-md text-sm font-medium bg-[#2E4166] px-[10px] md:px-[30px]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 md:py-4 px-4 md:px-8 text-[12px] md:text-[14px] ${
              activeTab === 'profile' ? 'border-b-2 border-[#DDD4BA] text-[#DDD4BA]' : 'text-[#ffffff]'
            }`}
          >
            {t('profile')}
          </button>
        </div>

        {/* Tab Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-2xl">
                  <User className="w-5 h-5" />
                  {t('personal_info')}
                </CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 sm:px-6 pb-6">
                {/** Editable fields only */}
                {accountType === 'company' && (
                  <div>
                    <Label>{t('company_name')}</Label>
                    <Input
                      value={formData.company_name ?? ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-100' : ''}
                    />
                  </div>
                )}
                {accountType === 'company' && (
                  <div>
                    <Label>{t('responsible_person')}</Label>
                    <Input
                      value={formData.responsible_person ?? ''}
                      onChange={(e) => handleInputChange('responsible_person', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-gray-100' : ''}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="phone_number">{t('phone_number')}</Label>
                  <Input
                    id="phone_number"
                    value={formData?.phone_number ?? ''}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    minLength={12}
                    maxLength={12}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-100' : ''}
                    placeholder='9665xxxxxxxx'
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t('address')}</Label>
                  <Input
                    id="address"
                    value={formData?.address ?? ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-100' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="region">{t('region')}</Label>
                  <Input
                    id="region"
                    value={formData?.region ?? ''}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-100' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="city">{t('city')}</Label>
                  <Input
                    id="city"
                    value={formData?.city ?? ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-gray-100' : ''}
                  />
                </div>

                {/** Read-only fields */}
                {accountType === 'company' 
                  ? <></>
                  : (
                    <div>
                    <Label>{t('name')}</Label>
                    <Input value={formData?.name ?? ''} disabled className="bg-gray-100" />
                  </div>
                  )
                }
                {accountType === 'company' 
                  ? <></>
                  : (
                    <div>
                      <Label>{t('gender')}</Label>
                      <Input value={formData?.gender ?? '-'} disabled className="bg-gray-100" />
                    </div>
                  )
                }
                <div>
                  <Label htmlFor="business_activity">{t('company_activity')}</Label>
                  <Input
                    id="business_activity"
                    value={formData?.business_activity ?? ''}
                    onChange={(e) => handleInputChange('business_activity', e.target.value)}
                    disabled
                    className={!isEditing ? 'bg-gray-100' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="val_license_number">{t('license_number')}</Label>
                  <Input
                    id="val_license_number"
                    value={formData?.val_license_number ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 10) handleInputChange('val_license_number', val);
                    }}
                    disabled
                    minLength={10}
                    maxLength={10}
                    className={!isEditing ? 'bg-gray-100' : ''}
                    placeholder={t('enter_exactly_11_digits')}
                  />
                </div>
                <div>
                  <Label>{t('status')}</Label>
                  <Input value={formData?.status} disabled className="bg-gray-100" />
                </div>
                <div>
                  <Label>{t('created_at')}</Label>
                  <Input
                    value={formData?.created_at ? formData.created_at.slice(0, 10) : ''}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label>{t('updated_at')}</Label>
                  <Input
                    value={formData?.updated_at ? formData.updated_at.slice(0, 10) : ''}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

              </div>
            </Card>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#2E4166] sm:w-60 text-[#DDD4BA] font-[600]"
              >
                <Edit className="w-4 h-4 ml-2" />
                {t('edit_profile')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="w-4 h-4 ml-2" />
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {isSaving ? t('saving') : t('save_changes')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
