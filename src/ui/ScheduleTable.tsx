import type { ScheduleEntry } from '../domain/mortgageTypes';
import { useLanguage, formatCurrency, formatPercent } from '../i18n/LanguageContext';

interface ScheduleTableProps {
  schedule: ScheduleEntry[];
  /** When true, extra columns (extra payment, rate) are shown */
  hasScenario?: boolean;
}

export function ScheduleTable({ schedule, hasScenario = false }: ScheduleTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t.scheduleTitle}</h2>
        {hasScenario && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t.scenarioLabel}
          </span>
        )}
      </div>

      <div className="overflow-x-auto max-h-80 sm:max-h-96 border border-gray-200 rounded-md">
        <table className={`w-full text-xs sm:text-sm ${hasScenario ? 'min-w-[650px]' : 'min-w-[500px]'}`}>
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.scheduleNumber}
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.scheduleDate}
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.schedulePayment}
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.schedulePrincipal}
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.scheduleInterest}
              </th>
              {hasScenario && (
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-green-700 border-b border-gray-200 whitespace-nowrap">
                  {t.scheduleExtraPayment}
                </th>
              )}
              {hasScenario && (
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                  {t.scheduleRate}
                </th>
              )}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.scheduleBalance}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {schedule.map((entry) => {
              const hasExtra = hasScenario && entry.extraPayment;
              return (
                <tr
                  key={entry.paymentNumber}
                  className={`hover:bg-gray-50 transition-colors ${hasExtra ? 'bg-green-50/50' : ''}`}
                >
                  <td className="px-2 sm:px-4 py-2 text-gray-600 tabular-nums">
                    {entry.paymentNumber}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-gray-900 whitespace-nowrap">
                    {t.months[entry.month - 1]} {entry.year}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-right text-gray-900 font-medium tabular-nums whitespace-nowrap">
                    {formatCurrency(entry.payment, t)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-right text-gray-700 tabular-nums whitespace-nowrap">
                    {formatCurrency(entry.principalPayment, t)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-right text-gray-500 tabular-nums whitespace-nowrap">
                    {formatCurrency(entry.interestPayment, t)}
                  </td>
                  {hasScenario && (
                    <td className="px-2 sm:px-4 py-2 text-right tabular-nums whitespace-nowrap">
                      {entry.extraPayment ? (
                        <span className="text-green-700 font-medium">
                          {formatCurrency(entry.extraPayment, t)}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  )}
                  {hasScenario && (
                    <td className="px-2 sm:px-4 py-2 text-right text-gray-500 tabular-nums whitespace-nowrap">
                      {entry.activeRate !== undefined ? formatPercent(entry.activeRate, t) : '-'}
                    </td>
                  )}
                  <td className="px-2 sm:px-4 py-2 text-right text-gray-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(entry.remainingBalance, t)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {t.paymentsCount}: {schedule.length}
      </p>
    </div>
  );
}
