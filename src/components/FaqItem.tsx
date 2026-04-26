import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FaqItem as FaqItemType } from '@/data/faq';

interface FaqItemProps {
  faq: FaqItemType;
  value: string;
  isOpen?: boolean;
}
// 
const FaqItem: React.FC<FaqItemProps> = ({ faq, value, isOpen = false }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <AccordionItem 
      value={value}
      className="border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <AccordionTrigger 
        className={`px-4 md:px-6 py-1 md:py-4 hover:no-underline group transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'} [&[data-state=open]_.plus-icon]:opacity-0 [&[data-state=open]_.plus-icon]:scale-75 [&[data-state=open]_.minus-icon]:opacity-100 [&[data-state=open]_.minus-icon]:scale-100`}
        aria-label={`${faq.question} - ${t('faq.expand')}`}
        id={`trigger-${faq.id}`}
        aria-controls={`panel-${faq.id}`}
        indicator={
          <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
            <span 
              className="plus-icon absolute inset-0 flex items-center justify-center text-lg font-medium text-muted-foreground transition-all duration-200 opacity-100 scale-100"
              aria-hidden="true"
            >
              +
            </span>
            <span 
              className="minus-icon absolute inset-0 flex items-center justify-center text-lg font-medium text-muted-foreground transition-all duration-200 opacity-0 scale-75"
              aria-hidden="true"
            >
              −
            </span>
          </div>
        }
      >
        <div className={`flex items-center gap-4 w-full min-h-[44px] ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className={`font-medium text-foreground text-sm md:text-lg font-ibm-plex-arabic leading-relaxed ${isRTL ? 'order-2 text-right flex-1' : 'order-1 text-left flex-1'}`}>
            {faq.question}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent 
        className="px-6 pb-5"
        role="region"
        id={`panel-${faq.id}`}
        aria-labelledby={`trigger-${faq.id}`}
      >
        <div className={`text-muted-foreground text-sm md:text-base leading-relaxed font-ibm-plex-arabic ${isRTL ? 'text-right' : 'text-left'}`}>
          {faq.answer}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqItem;