import type { MortgageSummary } from '../domain/mortgageTypes';
import { useLanguage, formatCurrency, formatPercent } from '../i18n/LanguageContext';

interface SummaryProps {
  summary: MortgageSummary;
}

export function Summary({ summary }: SummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.summaryTitle}</h2>

      {/* Primary metric - Monthly Payment */}
      <div className="bg-white rounded-md px-6 py-5 border border-gray-200 mb-4">
        <p className="text-sm text-gray-600">{t.monthlyPayment}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1 tabular-nums">
          {formatCurrency(summary.monthlyPayment, t)}
        </p>
        {summary.lastMonthlyPayment && (
          <p className="text-sm text-gray-500 mt-1">
            {t.lastPayment}: {formatCurrency(summary.lastMonthlyPayment, t)}
          </p>
        )}
      </div>

      {/* Secondary metrics - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-md px-5 py-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t.loanAmountLabel}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatCurrency(summary.principal, t)}
          </p>
        </div>

        <div className="bg-white rounded-md px-5 py-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t.totalInterest}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatCurrency(summary.totalInterestPaid, t)}
          </p>
        </div>

        <div className="bg-white rounded-md px-5 py-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t.totalAmount}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatCurrency(summary.totalAmountPaid, t)}
          </p>
        </div>

        <div className="bg-white rounded-md px-5 py-4 border border-gray-200">
          <p className="text-sm text-gray-600">{t.overpaymentRatio}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1 tabular-nums">
            {formatPercent(summary.overpaymentRatio, t)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t.interestPrincipal}</p>
        </div>
      </div>
    </div>
  );
}
