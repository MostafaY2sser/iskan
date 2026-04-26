import React from 'react';
import { Card, CardContent } from './ui/card';
import { HomeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  count: number;       // e.g. 135
  percent: number;     // e.g. 78
  className?: string;
};

const PRIMARY = '#2E4166';
const SECONDARY = '#D9C690';

const TotalAssetsCard: React.FC<Props> = ({ count, percent, className }) => {
  const pct = Math.max(0, Math.min(100, percent));
  const { t } = useTranslation()

  return (
    <Card className="w-full  h-32 bg-primary shadow-md rounded-xl border border-border">
    <CardContent className="p-4 h-full flex items-center justify-between relative">
      <div className="flex items-center gap-3 w-full">
        <HomeIcon className="w-16 h-16 lg:w-20 lg:h-20 text-secondary flex-shrink-0" />
        <div className="flex flex-row gap-4 flex-1 min-w-0">
          <div className="text-right flex-1">
            <p className="text-base lg:text-lg font-bold text-secondary mb-2">{t('total_properties')}</p>
            <div className="space-y-1">
              <div className="w-full max-w-64 bg-muted rounded-full h-2 flex justify-end ml-auto">
                <div 
                  className="bg-secondary h-2 rounded-sm transition-all duration-300"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <div className="text-right">
                <span className="text-xs text-secondary">
                  <span className="font-bold">{pct}%</span> {t('available_capacity')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-2xl lg:text-3xl font-medium text-secondary">{count}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

export default TotalAssetsCard;
