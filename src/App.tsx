import { useState, useMemo } from 'react';
import type { MortgageFormState, MortgageResult } from './domain/mortgageTypes';
import { calculateMortgage, validateMortgageInput } from './domain/mortgageCalculator';
import { MortgageForm } from './ui/MortgageForm';
import { Summary } from './ui/Summary';
import { ScheduleTable } from './ui/ScheduleTable';
import { Disclaimer } from './ui/Disclaimer';
import { LanguageSelector } from './ui/LanguageSelector';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const defaultFormState: MortgageFormState = {
  propertyPrice: 500000,
  downPaymentValue: 20,
  downPaymentMode: 'percentage',
  loanTermYears: 30,
  annualInterestRate: 0.065,
  paymentType: 'annuity',
  interestCalculationMethod: 'monthly',
  dayCountConvention: 365,
};

function MortgageCalculator() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState<MortgageFormState>(defaultFormState);

  // Derive MortgageInput from form state
  const mortgageInput = useMemo(() => {
    const downPayment = formState.downPaymentMode === 'percentage'
      ? formState.propertyPrice * (formState.downPaymentValue / 100)
      : formState.downPaymentValue;

    return {
      propertyPrice: formState.propertyPrice,
      downPayment,
      loanTermYears: formState.loanTermYears,
      annualInterestRate: formState.annualInterestRate,
      paymentType: formState.paymentType,
      interestCalculationMethod: formState.interestCalculationMethod,
      dayCountConvention: formState.dayCountConvention,
    };
  }, [formState]);

  // Calculate mortgage (memoized to prevent unnecessary recalculations)
  const result: MortgageResult | null = useMemo(() => {
    const errors = validateMortgageInput(mortgageInput);
    if (errors.length > 0) {
      return null;
    }
    try {
      return calculateMortgage(mortgageInput);
    } catch {
      return null;
    }
  }, [mortgageInput]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.appTitle}</h1>
              <p className="text-gray-600 mt-2">
                {t.appSubtitle}
              </p>
            </div>
            <LanguageSelector />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <MortgageForm
              value={formState}
              onChange={setFormState}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            {result && (
              <>
                <Summary summary={result.summary} />
                <ScheduleTable schedule={result.schedule} />
              </>
            )}
          </div>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MortgageCalculator />
    </LanguageProvider>
  );
}

export default App;
