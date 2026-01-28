import type { ScheduleEntry } from '../domain/mortgageTypes';
import { useLanguage, formatCurrency } from '../i18n/LanguageContext';

interface ScheduleTableProps {
  schedule: ScheduleEntry[];
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{t.scheduleTitle}</h2>

      <div className="overflow-x-auto max-h-80 sm:max-h-96 border border-gray-200 rounded-md">
        <table className="w-full text-xs sm:text-sm min-w-[500px]">
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
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                {t.scheduleBalance}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {schedule.map((entry) => (
              <tr
                key={entry.paymentNumber}
                className="hover:bg-gray-50 transition-colors"
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
                <td className="px-2 sm:px-4 py-2 text-right text-gray-900 tabular-nums whitespace-nowrap">
                  {formatCurrency(entry.remainingBalance, t)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {t.paymentsCount}: {schedule.length}
      </p>
    </div>
  );
}
