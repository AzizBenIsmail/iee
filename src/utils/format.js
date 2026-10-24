export function formatPrice(value, language) {
  const locale = language === 'ar' ? 'ar-TN' : language === 'en' ? 'en-TN' : 'fr-TN';
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)} DT`;
}
