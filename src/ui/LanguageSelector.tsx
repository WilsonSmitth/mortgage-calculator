import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'pl', label: 'PL', flag: '🇵🇱' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex rounded-md overflow-hidden border border-gray-300">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 text-sm font-medium transition-colors
            ${language === lang.code
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title={lang.label}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
