
import artranslations from '../locales/ar/common.json'; 
import entranslations from '../locales/en/common.json'; 
import i18n from 'i18next';

export interface FaqItem {
  id: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
  popular?: boolean;
}

const getTranslations = () => i18n.language === 'ar' ? artranslations : entranslations;

export const getFaqData = (): FaqItem[] => {
  const translations = getTranslations();

  return [
    {
      id: 'platform-1',
      slug: 'how-to-register',
      question: translations.faqQuestions.platform1.question,
      answer: translations.faqQuestions.platform1.answer,
      category: 'platform',
      tags: ['registration', 'account'],
      popular: true
    },
    {
      id: 'platform-2',
      slug: 'platform-cost',
      question: translations.faqQuestions.platform2.question,
      answer: translations.faqQuestions.platform2.answer,
      category: 'platform',
      tags: ['pricing', 'cost'],
      popular: false
    },
    {
      id: 'platform-3',
      slug: 'property-quality',
      question: translations.faqQuestions.platform3.question,
      answer: translations.faqQuestions.platform3.answer,
      category: 'platform',
      tags: ['quality', 'verification'],
      popular: false
    },
    {
      id: 'company-1',
      slug: 'company-approval-time',
      question: translations.faqQuestions.company1.question,
      answer: translations.faqQuestions.company1.answer,
      category: 'company',
      tags: ['approval', 'timeline'],
      popular: true
    },
    {
      id: 'company-2',
      slug: 'lease-modifications',
      question: translations.faqQuestions.company2.question,
      answer: translations.faqQuestions.company2.answer,
      category: 'company',
      tags: ['modifications', 'contract'],
      popular: true
    },
    {
      id: 'company-3',
      slug: 'lease-solution',
      question: translations.faqQuestions.company3.question,
      answer: translations.faqQuestions.company3.answer,
      category: 'company',
      tags: ['disputes', 'mediation'],
      popular: false
    },
    {
      id: 'owner-1',
      slug: 'property-guarantees',
      question: translations.faqQuestions.owner1.question,
      answer: translations.faqQuestions.owner1.answer,
      category: 'owner',
      tags: ['insurance', 'protection'],
      popular: true
    },
    {
      id: 'owner-2',
      slug: 'rent-pricing',
      question: translations.faqQuestions.owner2.question,
      answer: translations.faqQuestions.owner2.answer,
      category: 'owner',
      tags: ['pricing', 'rent'],
      popular: true
    },
    {
      id: 'owner-3',
      slug: 'property-management',
      question: translations.faqQuestions.owner3.question,
      answer: translations.faqQuestions.owner3.answer,
      category: 'owner',
      tags: ['management', 'multiple'],
      popular: false
    }
  ]
};
  

export const getPopularFaqs = (): FaqItem[] =>
  getFaqData().filter(faq => faq.popular);

export const getFaqsByCategory = (category: string): FaqItem[] =>
  getFaqData().filter(faq => faq.category === category);

export const getAllFaqs = (): FaqItem[] => getFaqData();

export const getFaqBySlug = (slug: string): FaqItem | undefined =>
  getFaqData().find(faq => faq.slug === slug);