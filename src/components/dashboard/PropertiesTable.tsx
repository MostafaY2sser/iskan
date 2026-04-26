import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, RefreshCw, ChevronRight, Home, MapPin, Bath, Bed, Clock, CircleCheckBig, X, ChevronsLeft, ChevronsRight, ChevronLeft, Grid, List } from 'lucide-react';
import type { ResidenceOwnerResponse } from '@/api/types';
import ResidenceEditDialog from './ResidenceEditDialog';
import { toast } from 'sonner';
import { residencesApi } from '@/api';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { AlertDialogHeader } from '../ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import Pagination from '../Pagination';

interface PropertiesTableProps {
  data: ResidenceOwnerResponse[];
  className?: string;
  onRefresh?: () => void;
  totalCount?: number;
  filteredCount?: number;
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({ 
  data, 
  className, 
  onRefresh, 
  totalCount, 
  filteredCount 
}) => {
  const [selectedResidence, setSelectedResidence] = useState<ResidenceOwnerResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [residenceToDelete, setResidenceToDelete] = useState<ResidenceOwnerResponse | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { t , i18n } = useTranslation()
  const isRTL = i18n.language === 'ar';
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const handleDelete = async (residenceId: number) => {
    try {
      setLoadingDelete(true);
      const response = await residencesApi.deleteResidence(residenceId);
      toast.success(t('property_deleted_successfully'));
      onRefresh?.(); 
    } catch (err) {
      console.error(err);
      toast.error(t('property_delete_error'));
    }
    finally {
      setLoadingDelete(false); 
    }
  };


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'approved': { variant: 'default' as const, className: 'bg-[#00A47E] text-[#ffffff] font-[400] text-[12px]', text: t('approved') , icon: <CircleCheckBig className="w-4 h-4 ml-1 text-[#ffffff]"/>},
      'pending': { variant: 'secondary' as const, className: 'bg-[#FFBB55] text-[#ffffff] font-[400] text-[12px]', text: t('pending') , icon: <Clock  className="w-4 h-4 ml-1 text-[#ffffff]" />},
      'rejected': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 font-[400] text-[12px]', text: t('rejected') , icon: <X className="w-4 h-4 ml-1 text-red-800"/>},
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.icon}
        {config.text}
      </Badge>
    );
  };

 
  const formatPrice = (price: number | undefined | null) => {
    if (!price || isNaN(price)) {
      return t('not_specified');
    }
    return `${price.toLocaleString()} ${t('currency')} `;
  };

  
  return (
    <div className={cn(" rounded-2xl shadow-sm border border-gray-100", className)}>
      <div className=" p-4 bg-white rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#2E4166]">{t('properties_list')}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {t('view')} {filteredCount || data.length} {t('from')} {totalCount || data.length} {t('property')}
            </p>
          </div>

          <div className=" flex items-center justify-between sm:justify-normal sm:gap-4">
            <div className="flex items-center gap-3">
              {onRefresh && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onRefresh}
                  className="border-[#2E4166] text-[#2E4166] hover:bg-[#2E4166] hover:text-white "
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                    {t('update')}
                </Button>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'border-[#2E4166]',
                  viewMode === 'grid'
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166]'
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>

              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'border-[#2E4166]',
                  viewMode === 'list'
                    ? 'bg-[#2E4166] text-white'
                    : 'text-[#2E4166]'
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 " />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto mt-6">
        {paginatedData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {t('no_residences_added')}
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((residence) => (
                <Card key={residence.id} className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    
                    {/* Property Image */}
                    <div className="relative h-[230px] bg-gray-200 rounded-t-lg overflow-hidden">

                        { residence.cover_photo_url === null 
                          ?<div className="w-full h-full flex items-center justify-center" style={{ display: residence.cover_photo_url ? 'none' : 'flex' }}>
                            <Home className="w-12 h-12 text-gray-400" />
                          </div>
                          : <div className="w-full h-full">
                            <img
                              src={residence.cover_photo_url}
                              alt={residence.name}
                              className="w-full h-full object-cover transition-all duration-300"
                              loading="lazy"
                            />
                          </div>
                        }
                        
                        
                        {/* Type and Status */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span>
                            {getStatusBadge(residence.status)}
                          </span>
                          {/* <Badge className={getResidenceTypeColor(residence.residence_type)}>
                          </Badge> */}
                          <span className='bg-[#2E4166] text-[#DDD4BA] rounded-full px-2 py-1 text-[12px] font-normal'>
                            {residence.residence_type}
                          </span>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-3 sm:p-6 flex flex-col flex-grow">
                      <div className="flex flex-col mb-2">
                        <h3 className="text-[18px] font-[700] text-[#2E4166] ">
                          {residence.name}
                        </h3>
                        <div className="flex items-center text-[#5D6772] text-xs sm:text-sm font-medium mb-3">
                          <MapPin className="w-4 h-4 ml-1" />
                          <span className="">{residence.city} , {residence.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mb-5 text-[#516180] font-normal text-[13px]">
                          <div className="flex justify-between align-center ">
                              <span>{t('type')} :</span>
                              <p className="text-gray-600 text-xs sm:text-sm">
                                {residence.residence_type}
                              </p>
                          </div>
                          <div className="flex items-center justify-between ">
                              <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4 " />
                                <span className='text-xs sm:text-sm'>  {t('beds_count')} :</span>
                              </div>
                              <span>{residence.bed_count} {t('bed')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 ">
                                <Bath className="w-4 h-4" />
                                <span className='text-xs sm:text-sm'>{t('bathrooms_count')} :</span>
                              </div>
                              <span>{residence.bathroom_count} {t('baths')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                <span className='text-xs sm:text-sm'>  {t('rooms_count')} :</span>
                              </div>
                              <span className='text-xs sm:text-sm'>{residence.rooms_count} {t('rooms')}</span>
                          </div>
                      </div>

                      {/* Price Pre  Month */}
                      <div className="flex items-center justify-between mb-4 text-[13px] font-[600] text-[#2E4166] p-[16px] bg-[#F7F8FA] rounded-sm">
                        {residence.price_period === 'monthly'
                          ? (
                            <>
                              <span className="text-sm text-gray-700"> {t('monthly_price')} :</span>
                              <p className="">
                                {formatPrice(residence.price_per_bed)}
                                <span>{t('person_per_month')}</span>
                              </p>
                            </>
                          )
                          : (
                            <>
                              <span className="text-sm text-gray-700"> {t('per_year_sar')} :</span>
                              <p className="">
                                {formatPrice(residence.price_per_bed)}
                                <span>{t('per_person_per_year')}</span>
                              </p>
                            </>
                          )
                        }
                      </div> 

                      {/* Action Button - Always at bottom */}
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-[#2E4166] border border-[#2E4166] hover:bg-[#2E4166]/10 w-[40%]"
                          title={t('edit')}
                          onClick={() => {
                            setSelectedResidence(residence);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                          <span>{t('edit')}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-[#DDD4BA] hover:bg-[#2E4166]/10 bg-[#2E4166] w-[40%]"
                          title={t('view_details')}
                          // navigate to details page
                          onClick={() => {
                            navigate(`/properties/${residence.id}`, {
                              state: { residence }
                            });
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          <span>{t('view')} </span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-2 text-red-600 bg-red-100 hover:bg-red-50 w-[15%]"
                          title={t('delete')}
                          onClick={() => {
                            setResidenceToDelete(residence);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>


                    </div>


                  </CardContent>
                </Card>
              ))}
            </div>
            ): (
              <div className="space-y-4">
                {paginatedData.map((residence) => (
                  <Card
                    key={residence.id}
                    className="shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">

                        {/* Image Slider */}
                        <div className="relative md:w-1/3 h-[280px] bg-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={residence.cover_photo_url}
                            alt={residence.name}
                            className="min-w-[100%] min-h-[100%] object-cover transition-all duration-300"
                            loading="lazy"
                          />

                          {/* Type & Status */}
                          <div className="absolute top-3 right-3 flex gap-2">
                            {getStatusBadge(residence.status)}
                            <span className="bg-[#2E4166] text-[#DDD4BA] rounded-full px-2 py-1 text-[12px]">
                              {residence.residence_type}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-6 flex flex-col">

                          {/* Name & Location */}
                          <div className="mb-3">
                            <h3 className="text-[18px] font-[700] text-[#2E4166]">
                              {residence.name}
                            </h3>
                            <div className="flex items-center text-[#5D6772] text-[14px] font-[500]">
                              <MapPin className="w-4 h-4 ml-1" />
                              <span>
                                {residence.address}, {residence.city}
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-[#516180] mb-4">
                            <div className="flex justify-between">
                              <span>{t('beds_count')} :</span>
                              <span>{residence.bed_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('bathrooms_count')} :</span>
                              <span>{residence.bathroom_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('rooms_count')} :</span>
                              <span>{residence.rooms_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('type')} :</span>
                              <span className="line-clamp-1">
                                {residence.description}
                              </span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between text-[13px] font-[600] text-[#2E4166] p-[16px] bg-[#F7F8FA] rounded-sm mb-4">
                            <span>{t('monthly_price')} :</span>
                            <p>
                              {formatPrice(residence.price_per_bed)}
                              <span className="ms-1">{t('person_per_month')}</span>
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3 mt-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 text-[#2E4166] border border-[#2E4166]"
                              onClick={() => {
                                setSelectedResidence(residence);
                                setIsEditOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 me-1" />
                              {t('edit')}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1 bg-[#2E4166] text-[#DDD4BA]"
                              onClick={() =>
                                navigate(`/properties/${residence.id}`, {
                                  state: { residence },
                                })
                              }
                            >
                              <Eye className="w-4 h-4 me-1" />
                              {t('view')}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 bg-red-100"
                              onClick={() => {
                                setResidenceToDelete(residence);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
        )}

        {/* Pagination :----------- */}
        {totalPages > 1 && (
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
        )}
        {/* Pagination :----------- */}

      </div>

      {/* Residence Edit Dialog */}
      <ResidenceEditDialog
        residence={selectedResidence}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdated={onRefresh}
      />


      {/* Delete Residence */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <AlertDialogHeader className={` flex items-center `}>
            <DialogTitle>{t('delete_confirmation')}</DialogTitle>
          </AlertDialogHeader>
          <p className="text-gray-700 mt-2 text-center text-xs sm:text-base">
            {t('confirm_property_delete')}
            <strong>{residenceToDelete?.name}</strong> <br /> {t('irreversible_action')}
          </p>
          <div className="mt-4 flex justify-center  gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              disabled={loadingDelete} 
              onClick={async () => {
                if (!residenceToDelete) return;
                await handleDelete(residenceToDelete.id);
                setDeleteDialogOpen(false);
              }}
            >
              {loadingDelete ? t('deleting') : t('delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>



    </div>
  );
};

export default PropertiesTable;
