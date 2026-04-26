import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesTable from '@/components/dashboard/PropertiesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus } from 'lucide-react';
import { residencesApi } from '@/api/endpoints/residences';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import type { ResidenceOwnerResponse } from '@/api/types';
import { useTranslation } from 'react-i18next';
// import { districtsByCity } from '@/data/districtsByCity';
import PropertiesSkeleton from '@/components/Skeleton';
import { districtsByCityAr } from '@/locales/ar/districtsByCityAr';
import { districtsByCityEn } from '@/locales/en/districtsByCityEn';

const PropertiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [residences, setResidences] = useState<ResidenceOwnerResponse[]>([]);
  const [filteredResidences, setFilteredResidences] = useState<ResidenceOwnerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const { t , i18n } = useTranslation()  


  // Localization Cities :-----------------
  const districtsByCity = i18n.language === 'ar' ? districtsByCityAr : districtsByCityEn;

  // Load residences on component mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadResidences();
    }
  }, [user?.id]);

  // Filter residences when search or filters change
  useEffect(() => {
    filterResidences();
  }, [residences, searchTerm, statusFilter, cityFilter]);

  const loadResidences = async () => {
    if (!user?.id) {
      console.error('User ID not available');
      toast.error(t('user_id_not_found'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await residencesApi.getResidencesByUserId(user.id);
      setResidences(data);
    } catch (error) {
      console.error('Error loading residences:', error);
      toast.error(t('failed_to_load_properties'));
    } finally {
      setLoading(false);
    }
  };

  const filterResidences = () => {
    let filtered = [...residences];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(residence =>
        residence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        residence.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        residence.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(residence => residence.status === statusFilter);
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(residence => residence.city === cityFilter);
    }

    // Sort by created_at (latest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; // Latest first (descending order)
    });

    setFilteredResidences(filtered);
  };

  const handleAddResidence = () => {
    navigate('/add-residence');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#ffffff] p-4 rounded-md shadow-md">
        <h1 className=" text-xl sm:text-2xl font-bold mb-2">{t('properties')}</h1>
        <p className="text-[#828690] text-sm sm:text-base font-normal"> {t('manage_your_properties')}</p>
      </div>
      

      {/* Filters */}
      <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 right-3" />
              <Input
                placeholder={t('search_properties')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className='flex items-center justify-between gap-2'>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_statuses')}</SelectItem>
                  <SelectItem value="approved">{t('approved')}</SelectItem>
                  <SelectItem value="pending">{t('pending')}</SelectItem>
                  <SelectItem value="rejected">{t('rejected')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('city')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('all_citys')}</SelectItem>
                  {Object.keys(districtsByCity).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center border-[#2E4166] text-[#2E4166] hover:bg-[#2E4166] hover:text-white"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCityFilter('all');
              }}
            >
              <Filter className="w-4 h-4 ml-2" />
               {t('clear_filters')}
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      {!user?.id ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center">
            <span className="text-gray-600">{t('loading_user_data')}</span>
          </div>
        </div>
      ) : loading ? (
        <PropertiesSkeleton/>
      ) : (
        <PropertiesTable 
          data={filteredResidences} 
          onRefresh={loadResidences}
          totalCount={residences.length}
          filteredCount={filteredResidences.length}
        />
      )}
    </div>
  );
};

export default PropertiesPage;
