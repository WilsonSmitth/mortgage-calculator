import { useLanguage } from '../i18n/LanguageContext';

export function Disclaimer() {
  const { t } = useLanguage();

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t.disclaimerTitle}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {t.disclaimerText}
        </p>
      </div>
    </div>
  );
}
