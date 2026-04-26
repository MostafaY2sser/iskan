import { useTranslation } from "react-i18next";

const ResidentialManagement: React.FC = () => {
  
    const { t } = useTranslation();

  return (

    <div className="min-h-96">

        {/* Header */}
        <div className="bg-[#ffffff] p-4 rounded-md shadow-md mb-4">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('workers_reports')}</h1>
          <p className="text-[#828690] text-sm font-normal">{t('complete_reports_about_your_residences')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-md shadow-md p-4 sm:p-6 flex flex-col gap-3">
                <p className="text-[#516180] text-sm font-medium">{t('current_bookings')}</p>
                <span className="text-primary text-xl  sm:text-[32px] font-semibold">14</span>
                <p className="text-[#516180] text-sm font-medium">{t('need_accommodation')}</p>
            </div>
            <div className="bg-white rounded-md shadow-md p-4 sm:p-6 flex flex-col gap-3">
                <p className="text-[#516180] text-sm font-medium">{t('workers_in_residence')}</p>
                <span className="text-primary text-xl sm:text-[32px] font-semibold">142</span>
                <p className="text-[#516180] text-sm font-medium">{t('successfully_localized')}</p>
            </div>
            <div className="bg-white rounded-md shadow-md p-4 sm:p-6 flex flex-col gap-3">
                <p className="text-[#516180] text-sm font-medium">{t('total_workers')}</p>
                <span className="text-primary text-xl sm:text-[32px] font-semibold">156</span>
                <p className="text-[#516180] text-sm font-medium">{t('in_all_properties')}</p>
            </div>
        </div>

    </div>
  );
};

export default ResidentialManagement;