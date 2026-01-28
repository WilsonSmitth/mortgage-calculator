import type { ScheduleEntry } from '../domain/mortgageTypes';
import { useLanguage, formatCurrency } from '../i18n/LanguageContext';

interface ScheduleTableProps {
  schedule: ScheduleEntry[];
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.scheduleTitle}</h2>

      <div className="overflow-auto max-h-96 border border-gray-200 rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200">
                {t.scheduleNumber}
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200">
                {t.scheduleDate}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 border-b border-gray-200">
                {t.schedulePayment}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 border-b border-gray-200">
                {t.schedulePrincipal}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 border-b border-gray-200">
                {t.scheduleInterest}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 border-b border-gray-200">
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
                <td className="px-4 py-2 text-gray-600">
                  {entry.paymentNumber}
                </td>
                <td className="px-4 py-2 text-gray-900">
                  {t.months[entry.month - 1]} {entry.year}
                </td>
                <td className="px-4 py-2 text-right text-gray-900 font-medium">
                  {formatCurrency(entry.payment, t)}
                </td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {formatCurrency(entry.principalPayment, t)}
                </td>
                <td className="px-4 py-2 text-right text-gray-500">
                  {formatCurrency(entry.interestPayment, t)}
                </td>
                <td className="px-4 py-2 text-right text-gray-900">
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
