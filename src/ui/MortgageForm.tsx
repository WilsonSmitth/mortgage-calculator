import { useState } from 'react';
import type {
  MortgageFormState,
  PaymentType,
  InterestCalculationMethod,
  DayCountConvention
} from '../domain/mortgageTypes';
import { useLanguage, formatNumber } from '../i18n/LanguageContext';

interface MortgageFormProps {
  value: MortgageFormState;
  onChange: (value: MortgageFormState) => void;
}

function maskInteger(str: string): string {
  return str.replace(/[^\d]/g, '');
}

function maskDecimal(str: string): string {
  let result = str.replace(/[^\d.]/g, '');
  const parts = result.split('.');
  if (parts.length > 2) {
    result = parts[0] + '.' + parts.slice(1).join('');
  }
  return result;
}

function parseNumber(str: string): number | undefined {
  if (str === '' || str === '.') return undefined;
  const num = parseFloat(str);
  return isNaN(num) ? undefined : num;
}

export function MortgageForm({ value, onChange }: MortgageFormProps) {
  const { t } = useLanguage();

  const [propertyPriceStr, setPropertyPriceStr] = useState(String(value.propertyPrice));
  const [downPaymentStr, setDownPaymentStr] = useState(String(value.downPaymentValue));
  const [loanTermStr, setLoanTermStr] = useState(String(value.loanTermYears));
  const [interestRateStr, setInterestRateStr] = useState(String(value.annualInterestRate * 100));
  const [firstPeriodDaysStr, setFirstPeriodDaysStr] = useState(
    value.firstPeriodDays !== undefined ? String(value.firstPeriodDays) : ''
  );
  const [showFirstPayment, setShowFirstPayment] = useState(value.firstPeriodDays !== undefined);

  const updateField = <K extends keyof MortgageFormState>(
    field: K,
    newValue: MortgageFormState[K]
  ) => {
    onChange({ ...value, [field]: newValue });
  };

  const handlePropertyPriceChange = (str: string) => {
    const masked = maskDecimal(str);
    setPropertyPriceStr(masked);
    const num = parseNumber(masked);
    if (num !== undefined && num >= 0) {
      updateField('propertyPrice', num);
    }
  };

  const handlePropertyPriceBlur = () => {
    setPropertyPriceStr(String(value.propertyPrice));
  };

  const handleDownPaymentChange = (str: string) => {
    const masked = maskDecimal(str);
    setDownPaymentStr(masked);
    const num = parseNumber(masked);
    if (num !== undefined && num >= 0) {
      updateField('downPaymentValue', num);
    }
  };

  const handleDownPaymentBlur = () => {
    setDownPaymentStr(String(value.downPaymentValue));
  };

  const handleLoanTermChange = (str: string) => {
    const masked = maskInteger(str);
    setLoanTermStr(masked);
    const num = parseNumber(masked);
    if (num !== undefined && num >= 1 && num <= 50) {
      updateField('loanTermYears', num);
    }
  };

  const handleLoanTermBlur = () => {
    setLoanTermStr(String(value.loanTermYears));
  };

  const handleInterestRateChange = (str: string) => {
    const masked = maskDecimal(str);
    setInterestRateStr(masked);
    const num = parseNumber(masked);
    if (num !== undefined && num >= 0 && num <= 100) {
      updateField('annualInterestRate', num / 100);
    }
  };

  const handleInterestRateBlur = () => {
    setInterestRateStr(String(value.annualInterestRate * 100));
  };

  const handleDownPaymentModeChange = (mode: 'amount' | 'percentage') => {
    updateField('downPaymentMode', mode);
    setDownPaymentStr(String(value.downPaymentValue));
  };

  const handleFirstPeriodDaysChange = (str: string) => {
    const masked = maskInteger(str);
    setFirstPeriodDaysStr(masked);
    const num = parseNumber(masked);
    if (num !== undefined && num >= 1 && num <= 365) {
      updateField('firstPeriodDays', num);
    } else if (masked === '') {
      updateField('firstPeriodDays', undefined);
    }
  };

  const handleFirstPeriodDaysBlur = () => {
    setFirstPeriodDaysStr(
      value.firstPeriodDays !== undefined ? String(value.firstPeriodDays) : ''
    );
  };

  const handleToggleFirstPayment = () => {
    const next = !showFirstPayment;
    setShowFirstPayment(next);
    if (!next) {
      updateField('firstPeriodDays', undefined);
      setFirstPeriodDaysStr('');
    }
  };

  const loanAmount = value.downPaymentMode === 'percentage'
    ? value.propertyPrice * (1 - value.downPaymentValue / 100)
    : value.propertyPrice - value.downPaymentValue;

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t.formTitle}</h2>

      {/* Property Price */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {t.propertyPrice}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={propertyPriceStr}
            onChange={(e) => handlePropertyPriceChange(e.target.value)}
            onBlur={handlePropertyPriceBlur}
            className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">
            {t.currencySymbol}
          </span>
        </div>
      </div>

      {/* Down Payment with Toggle */}
      <div>
        <div className="flex justify-between items-center mb-1 gap-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">{t.downPayment}</label>
          <div className="flex rounded-md overflow-hidden border border-gray-300 shrink-0">
            <button
              type="button"
              onClick={() => handleDownPaymentModeChange('amount')}
              className={`px-2 sm:px-3 py-1 text-xs font-medium transition-colors
                ${value.downPaymentMode === 'amount'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              {t.currencySymbol}
            </button>
            <button
              type="button"
              onClick={() => handleDownPaymentModeChange('percentage')}
              className={`px-2 sm:px-3 py-1 text-xs font-medium transition-colors
                ${value.downPaymentMode === 'percentage'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              %
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={downPaymentStr}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
            onBlur={handleDownPaymentBlur}
            className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">
            {value.downPaymentMode === 'amount' ? t.currencySymbol : '%'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t.loanAmount}: {formatNumber(loanAmount, t)} {t.currencySymbol}
        </p>
      </div>

      {/* Loan Term */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {t.loanTerm} ({t.loanTermYears})
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={loanTermStr}
          onChange={(e) => handleLoanTermChange(e.target.value)}
          onBlur={handleLoanTermBlur}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                     focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        />
      </div>

      {/* Interest Rate */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {t.annualInterestRate}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={interestRateStr}
            onChange={(e) => handleInterestRateChange(e.target.value)}
            onBlur={handleInterestRateBlur}
            className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">%</span>
        </div>
      </div>

      {/* Payment Type */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          {t.paymentType}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['annuity', 'differentiated'] as PaymentType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('paymentType', type)}
              className={`px-2 sm:px-4 py-2 text-[11px] sm:text-sm font-medium rounded-md border transition-colors text-center leading-tight min-h-[2.5rem]
                ${value.paymentType === type
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {type === 'annuity' ? t.annuity : t.differentiated}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {value.paymentType === 'annuity'
            ? t.annuityDescription
            : t.differentiatedDescription}
        </p>
      </div>

      {/* Interest Calculation Method */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          {t.interestCalculation}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['monthly', 'daily'] as InterestCalculationMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => updateField('interestCalculationMethod', method)}
              className={`px-2 sm:px-4 py-2 text-[11px] sm:text-sm font-medium rounded-md border transition-colors text-center leading-tight min-h-[2.5rem]
                ${value.interestCalculationMethod === method
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {method === 'monthly' ? t.monthly : t.daily}
            </button>
          ))}
        </div>
      </div>

      {/* Day Count Convention (only shown for daily calculation) */}
      {value.interestCalculationMethod === 'daily' && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            {t.dayCountConvention}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {([365, 360] as DayCountConvention[]).map((convention) => (
              <button
                key={convention}
                type="button"
                onClick={() => updateField('dayCountConvention', convention)}
                className={`px-2 sm:px-4 py-2 text-[11px] sm:text-sm font-medium rounded-md border transition-colors text-center leading-tight min-h-[2.5rem]
                  ${value.dayCountConvention === convention
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {convention} {t.days}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {value.dayCountConvention === 365
              ? t.dayCount365Description
              : t.dayCount360Description}
          </p>
        </div>
      )}

      {/* First Payment Adjustment */}
      <div className="border-t border-gray-200 pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showFirstPayment}
            onChange={handleToggleFirstPayment}
            className="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-400"
          />
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            {t.enableFirstPaymentAdjustment}
          </span>
        </label>

        {showFirstPayment && (
          <div className="mt-3">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t.firstPeriodDays}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={firstPeriodDaysStr}
              onChange={(e) => handleFirstPeriodDaysChange(e.target.value)}
              onBlur={handleFirstPeriodDaysBlur}
              placeholder="45"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t.firstPeriodDaysHint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
