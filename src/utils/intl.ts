/**
 * Internationalization utilities for formatting numbers, dates, and currencies
 */

export const formatNumber = (
  value: number,
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatCurrency = (
  value: number,
  locale: string = 'en',
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (
  date: Date | string,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

export const formatRelativeTime = (
  date: Date | string,
  locale: string = 'en'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

// Example usage for Arabic and English
export const formatPriceInSAR = (value: number, locale: string = 'ar-SA'): string => {
  return formatCurrency(value, locale, 'SAR');
};

export const formatDateArabic = (date: Date | string): string => {
  return formatDate(date, 'ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateEnglish = (date: Date | string): string => {
  return formatDate(date, 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};