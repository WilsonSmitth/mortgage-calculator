import type { MortgageSummary, ScenarioSummary } from '../domain/mortgageTypes';
import { useLanguage, formatCurrency, formatPercent } from '../i18n/LanguageContext';

interface SummaryProps {
  summary: MortgageSummary;
  scenarioSummary: ScenarioSummary | null;
}

export function Summary({ summary, scenarioSummary }: SummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{t.summaryTitle}</h2>

      {/* Primary metric - Monthly Payment */}
      <div className="bg-white rounded-md px-4 sm:px-6 py-4 sm:py-5 border border-gray-200 mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-gray-600">{t.monthlyPayment}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tabular-nums break-all">
          {formatCurrency(scenarioSummary ? scenarioSummary.newMonthlyPayment : summary.monthlyPayment, t)}
        </p>
        {scenarioSummary && scenarioSummary.newMonthlyPayment !== scenarioSummary.originalMonthlyPayment && (
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 line-through tabular-nums">
            {formatCurrency(scenarioSummary.originalMonthlyPayment, t)}
          </p>
        )}
        {!scenarioSummary && summary.firstPaymentAmount !== undefined && (
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

      {/* Scenario savings bar */}
      {scenarioSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 sm:mb-4">
          <div className="bg-green-50 border border-green-200 rounded-md px-3 sm:px-4 py-2 sm:py-3">
            <p className="text-xs text-green-700">{t.interestSaved}</p>
            <p className="text-base sm:text-lg font-bold text-green-800 tabular-nums break-all">
              {formatCurrency(scenarioSummary.interestSaved, t)}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md px-3 sm:px-4 py-2 sm:py-3">
            <p className="text-xs text-blue-700">{t.paymentsSaved}</p>
            <p className="text-base sm:text-lg font-bold text-blue-800 tabular-nums">
              {scenarioSummary.paymentsSaved} {t.monthsLabel}
            </p>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-md px-3 sm:px-4 py-2 sm:py-3">
            <p className="text-xs text-gray-600">{t.totalExtraPaymentsMade}</p>
            <p className="text-base sm:text-lg font-bold text-gray-900 tabular-nums break-all">
              {formatCurrency(scenarioSummary.totalExtraPayments, t)}
            </p>
          </div>
        </div>
      )}

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
            {formatCurrency(scenarioSummary ? scenarioSummary.newTotalInterest : summary.totalInterestPaid, t)}
          </p>
          {scenarioSummary && (
            <p className="text-xs text-gray-400 mt-0.5 line-through tabular-nums">
              {formatCurrency(scenarioSummary.originalTotalInterest, t)}
            </p>
          )}
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
