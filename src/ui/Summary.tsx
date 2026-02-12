import type { MortgageSummary } from '../domain/mortgageTypes';
import { useLanguage, formatCurrency, formatPercent } from '../i18n/LanguageContext';

interface SummaryProps {
  summary: MortgageSummary;
}

export function Summary({ summary }: SummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{t.summaryTitle}</h2>

      {/* Primary metric - Monthly Payment */}
      <div className="bg-white rounded-md px-4 sm:px-6 py-4 sm:py-5 border border-gray-200 mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600">{t.monthlyPayment}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tabular-nums break-all">
          {formatCurrency(summary.monthlyPayment, t)}
        </p>
        {summary.firstPaymentAmount !== undefined && (
          <p className="text-xs sm:text-sm text-amber-600 mt-1 font-medium">
            {t.firstPaymentLabel}: {formatCurrency(summary.firstPaymentAmount, t)}
          </p>
        )}
        {summary.lastMonthlyPayment !== undefined && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t.lastPayment}: {formatCurrency(summary.lastMonthlyPayment, t)}
          </p>
        )}
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white rounded-md px-4 sm:px-5 py-3 sm:py-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">{t.loanAmountLabel}</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatCurrency(summary.principal, t)}
          </p>
        </div>

        <div className="bg-white rounded-md px-4 sm:px-5 py-3 sm:py-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">{t.totalInterest}</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatCurrency(summary.totalInterestPaid, t)}
          </p>
        </div>

        <div className="bg-white rounded-md px-4 sm:px-5 py-3 sm:py-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">{t.totalAmount}</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatCurrency(summary.totalAmountPaid, t)}
          </p>
        </div>

        <div className="bg-white rounded-md px-4 sm:px-5 py-3 sm:py-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">{t.overpaymentRatio}</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatPercent(summary.overpaymentRatio, t)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t.interestPrincipal}</p>
        </div>
      </div>
    </div>
  );
}
