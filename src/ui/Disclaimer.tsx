import { useLanguage } from '../i18n/LanguageContext';

export function Disclaimer() {
  const { t } = useLanguage();

  return (
    <div className="mt-6 sm:mt-12 pt-4 sm:pt-8 border-t border-gray-200">
      <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">{t.disclaimerTitle}</h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {t.disclaimerText}
        </p>
      </div>
    </div>
  );
}
