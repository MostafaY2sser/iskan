import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ResidenceOwnerResponse } from "@/api/types";
import { residencesApi } from "@/api";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Skeleton } from "../ui/skeleton";

interface ResidenceEditDialogProps {
  residence: ResidenceOwnerResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; 
}

const ResidenceEditDialog: React.FC<ResidenceEditDialogProps> = ({
  residence,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    name: residence?.name || "",
    location: residence?.location || "",
    bed_count: residence?.bed_count || 0,
    price_per_bed: residence?.price_per_bed || 0,
    description: residence?.description || "",
    residence_type: residence?.residence_type || "",
    rooms_count: residence?.rooms_count || 0,
    kitchen_count: residence?.kitchen_count || 0,
    bathroom_count: residence?.bathroom_count || 0,
    building_year: residence?.building_year || 2024,
    address: residence?.address || "",
    city: residence?.city || "",
    nearby_landmarks: residence?.nearby_landmarks || "",
    price_period: residence?.price_period || "monthly",
    is_renewed: residence?.is_renewed ?? true,
  });

  const [loading, setLoading] = useState(false);
  const { t , i18n } = useTranslation()
  const isRTL = i18n.language === 'ar';
  const [fetching, setFetching] = useState(false);



  // Get Residence Details :----------------
  useEffect(() => {
    if (!isOpen || !residence?.id) return;

    const fetchResidence = async () => {
      try {
        setFetching(true);

        const data = await residencesApi.getResidenceDetailsOwnweById(residence.id);

        setFormData({
          name: data.name || "",
          location: data.location || "",
          bed_count: data.bed_count || 0,
          price_per_bed: data.price_per_bed || 0,
          description: data.description || "",
          residence_type: data.residence_type || "",
          rooms_count: data.rooms_count || 0,
          kitchen_count: data.kitchen_count || 0,
          bathroom_count: data.bathroom_count || 0,
          building_year: data.building_year || 2024,
          address: data.address || "",
          city: data.city || "",
          nearby_landmarks: data.nearby_landmarks || "",
          price_period: data.price_period || "monthly",
          is_renewed: data.is_renewed ?? true,
        });
      } catch (error) {
        console.error(error);
        toast.error(t("error_loading_property_data"));
      } finally {
        setFetching(false);
      }
    };
    fetchResidence();
  }, [isOpen, residence?.id]);
  // Get Residence Details :----------------


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("_count") || name === "price_per_bed" || name === "building_year"
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!residence) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      await residencesApi.updateResidence(residence.id, formData, token);

      toast.success(t('property_updated_successfully'));
      onClose();
      onUpdated?.();
    } catch (err) {
      console.error(err);
      toast.error(t('saving_changes_error'));
    } finally {
      setLoading(false);
    }
  };

  if (!residence) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-3 sm:-6">
        <DialogHeader>
          <DialogTitle className={`text-xl sm:text-2xl font-bold  ${ isRTL ? 'text-right' : 'text-left'} `}>
            {t('edit_property_data')}
          </DialogTitle>
        </DialogHeader>

        {fetching 
          ? <ResidenceEditSkeleton/>
          :<form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              name: t('name'),
              location: t('property_location'),
              city: t('city'),
              address: t('address') ,
              residence_type: t('property_type') ,
            }).map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input id={key} name={key} value={formData[key as keyof typeof formData]} onChange={handleChange} />
              </div>
            ))}

            {Object.entries({
              bed_count: t('beds_count'),
              rooms_count: t('rooms_count'),
              bathroom_count: t('bathroom_count'),
              kitchen_count: t('kitchen_count'),
              price_per_bed: t('price_per_bed'),
              building_year: t('build_year'),
            }).map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  type="number"
                  id={key}
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="nearby_landmarks">{t('nearby_landmarks')}</Label>
            <Input
              id="nearby_landmarks"
              name="nearby_landmarks"
              value={formData.nearby_landmarks}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="price_period">{t('price_period')}</Label>
            <select
              id="price_period"
              name="price_period"
              value={formData.price_period}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="monthly">{t('monthly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_renewed"
              name="is_renewed"
              checked={formData.is_renewed}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_renewed: e.target.checked }))
              }
            />
            <Label htmlFor="is_renewed">{t('renewed')}</Label>
          </div>

          <div>
            <Label htmlFor="description">{t('property_description')}</Label>
            <textarea
              id="description"
              name="description"
              className="w-full border rounded-md p-2 min-h-[100px]"
              value={formData.description}
              onChange={handleChange}
            />
          </div>


          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#2E4166] text-white hover:bg-[#1f2d47]"
            >
              {loading ? t('saving') : t('save_changes') }
            </Button>
          </div>
           </form>
        }


      </DialogContent>
    </Dialog>
  );
};

export default ResidenceEditDialog;





const ResidenceEditSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};
