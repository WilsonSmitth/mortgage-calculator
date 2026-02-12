import { useState, useMemo } from 'react';
import type {
  MortgageInput,
  ExtraPaymentEvent,
  ExtraPaymentFrequency,
  RateChangeEvent,
  ScenarioResult,
} from '../domain/mortgageTypes';
import { validateMortgageInput } from '../domain/mortgageCalculator';
import { calculateScenario } from '../domain/scenarioCalculator';
import { useLanguage, formatCurrency, formatPercent } from '../i18n/LanguageContext';

interface ScenarioSectionProps {
  mortgageInput: MortgageInput;
}

let nextId = 1;
function generateId(): string {
  return String(nextId++);
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

export function ScenarioSection({ mortgageInput }: ScenarioSectionProps) {
  const { t } = useLanguage();

  const [isExpanded, setIsExpanded] = useState(false);
  const [extraPayments, setExtraPayments] = useState<ExtraPaymentEvent[]>([]);
  const [rateChanges, setRateChanges] = useState<RateChangeEvent[]>([]);
  const [startYear] = useState(new Date().getFullYear());
  const [startMonth] = useState(new Date().getMonth() + 1);

  const result: ScenarioResult | null = useMemo(() => {
    const errors = validateMortgageInput(mortgageInput);
    if (errors.length > 0) return null;
    if (extraPayments.length === 0 && rateChanges.length === 0) return null;

    try {
      return calculateScenario({
        baseInput: mortgageInput,
        startYear,
        startMonth,
        extraPayments,
        rateChanges,
      });
    } catch {
      return null;
    }
  }, [mortgageInput, extraPayments, rateChanges, startYear, startMonth]);

  // Auto-expand when there are events
  const hasEvents = extraPayments.length > 0 || rateChanges.length > 0;

  // Extra payment handlers
  const addExtraPayment = () => {
    setExtraPayments(prev => [...prev, {
      id: generateId(),
      amount: 10000,
      frequency: 'one-time',
      startAtPayment: 12,
      effect: 'reduce-term',
    }]);
  };

  const updateExtraPayment = (id: string, updates: Partial<ExtraPaymentEvent>) => {
    setExtraPayments(prev => prev.map(ep =>
      ep.id === id ? { ...ep, ...updates } : ep
    ));
  };

  const removeExtraPayment = (id: string) => {
    setExtraPayments(prev => prev.filter(ep => ep.id !== id));
  };

  // Rate change handlers
  const addRateChange = () => {
    setRateChanges(prev => [...prev, {
      id: generateId(),
      newRate: mortgageInput.annualInterestRate - 0.005,
      atPayment: 12,
    }]);
  };

  const updateRateChange = (id: string, updates: Partial<RateChangeEvent>) => {
    setRateChanges(prev => prev.map(rc =>
      rc.id === id ? { ...rc, ...updates } : rc
    ));
  };

  const removeRateChange = (id: string) => {
    setRateChanges(prev => prev.filter(rc => rc.id !== id));
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      {/* Clickable header — always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-100 transition-colors text-left group"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl">
              {isExpanded ? '▾' : '▸'}
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t.scenarioTitle}</h2>
            {hasEvents && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {extraPayments.length + rateChanges.length}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 ml-7">
            {t.scenarioSubtitle}
          </p>
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
          {/* Extra Payments */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                {t.scenarioExtraPayments}
              </h3>
              <button
                type="button"
                onClick={addExtraPayment}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors self-start sm:self-auto whitespace-nowrap"
              >
                + {t.addExtraPayment}
              </button>
            </div>

            {extraPayments.length === 0 && (
              <p className="text-xs sm:text-sm text-gray-400 italic">{t.noEventsHint}</p>
            )}

            <div className="space-y-2">
              {extraPayments.map((ep) => (
                <ExtraPaymentCard
                  key={ep.id}
                  event={ep}
                  onUpdate={(updates) => updateExtraPayment(ep.id, updates)}
                  onRemove={() => removeExtraPayment(ep.id)}
                />
              ))}
            </div>
          </div>

          {/* Rate Changes */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                {t.scenarioRateChanges}
              </h3>
              <button
                type="button"
                onClick={addRateChange}
                className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors self-start sm:self-auto whitespace-nowrap"
              >
                + {t.addRateChange}
              </button>
            </div>

            <div className="space-y-2">
              {rateChanges.map((rc) => (
                <RateChangeCard
                  key={rc.id}
                  event={rc}
                  onUpdate={(updates) => updateRateChange(rc.id, updates)}
                  onRemove={() => removeRateChange(rc.id)}
                />
              ))}
            </div>
          </div>

          {/* Results */}
          {hasEvents && result && (
            <>
              <ScenarioComparisonSummary result={result} />
              <ScenarioScheduleTable result={result} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// =================== Sub-components ===================

function ExtraPaymentCard({
  event,
  onUpdate,
  onRemove,
}: {
  event: ExtraPaymentEvent;
  onUpdate: (updates: Partial<ExtraPaymentEvent>) => void;
  onRemove: () => void;
}) {
  const { t } = useLanguage();
  const [amountStr, setAmountStr] = useState(String(event.amount));
  const [startStr, setStartStr] = useState(String(event.startAtPayment));
  const [endStr, setEndStr] = useState(event.endAtPayment !== undefined ? String(event.endAtPayment) : '');

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
          {/* Amount */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t.extraPaymentAmount}</label>
            <input
              type="text"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => {
                const v = maskDecimal(e.target.value);
                setAmountStr(v);
                const n = parseFloat(v);
                if (!isNaN(n) && n > 0) onUpdate({ amount: n });
              }}
              onBlur={() => setAmountStr(String(event.amount))}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t.extraPaymentFrequency}</label>
            <select
              value={event.frequency}
              onChange={(e) => onUpdate({ frequency: e.target.value as ExtraPaymentFrequency })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              <option value="one-time">{t.extraPaymentOneTime}</option>
              <option value="monthly">{t.extraPaymentMonthly}</option>
              <option value="yearly">{t.extraPaymentYearly}</option>
            </select>
          </div>

          {/* Start at payment */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t.extraPaymentStartAt}</label>
            <input
              type="text"
              inputMode="numeric"
              value={startStr}
              onChange={(e) => {
                const v = maskInteger(e.target.value);
                setStartStr(v);
                const n = parseInt(v);
                if (!isNaN(n) && n >= 1) onUpdate({ startAtPayment: n });
              }}
              onBlur={() => setStartStr(String(event.startAtPayment))}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
          </div>

          {/* End at payment (for recurring) */}
          {event.frequency !== 'one-time' && (
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {t.extraPaymentEndAt}
                <span className="text-gray-400 ml-1">({t.optionalLabel})</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={endStr}
                onChange={(e) => {
                  const v = maskInteger(e.target.value);
                  setEndStr(v);
                  const n = parseInt(v);
                  if (!isNaN(n) && n >= event.startAtPayment) {
                    onUpdate({ endAtPayment: n });
                  } else if (v === '') {
                    onUpdate({ endAtPayment: undefined });
                  }
                }}
                onBlur={() => setEndStr(event.endAtPayment !== undefined ? String(event.endAtPayment) : '')}
                placeholder="-"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md
                           focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          )}

          {/* Effect */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t.extraPaymentEffect}</label>
            <select
              value={event.effect}
              onChange={(e) => onUpdate({ effect: e.target.value as 'reduce-payment' | 'reduce-term' })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              <option value="reduce-term">{t.extraPaymentReduceTerm}</option>
              <option value="reduce-payment">{t.extraPaymentReducePayment}</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors shrink-0 self-start"
        >
          {t.extraPaymentRemove}
        </button>
      </div>
    </div>
  );
}

function RateChangeCard({
  event,
  onUpdate,
  onRemove,
}: {
  event: RateChangeEvent;
  onUpdate: (updates: Partial<RateChangeEvent>) => void;
  onRemove: () => void;
}) {
  const { t } = useLanguage();
  const [rateStr, setRateStr] = useState(String(event.newRate * 100));
  const [atStr, setAtStr] = useState(String(event.atPayment));

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="grid grid-cols-2 gap-3 flex-1">
          {/* New rate */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t.newRate} (%)</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={rateStr}
                onChange={(e) => {
                  const v = maskDecimal(e.target.value);
                  setRateStr(v);
                  const n = parseFloat(v);
                  if (!isNaN(n) && n >= 0 && n <= 100) onUpdate({ newRate: n / 100 });
                }}
                onBlur={() => setRateStr(String(event.newRate * 100))}
                className="w-full px-2 pr-7 py-1.5 text-sm border border-gray-300 rounded-md
                           focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
            </div>
          </div>

          {/* At payment */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">{t.rateChangeAtPayment}</label>
            <input
              type="text"
              inputMode="numeric"
              value={atStr}
              onChange={(e) => {
                const v = maskInteger(e.target.value);
                setAtStr(v);
                const n = parseInt(v);
                if (!isNaN(n) && n >= 1) onUpdate({ atPayment: n });
              }}
              onBlur={() => setAtStr(String(event.atPayment))}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md
                         focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors shrink-0 self-start"
        >
          {t.rateChangeRemove}
        </button>
      </div>
    </div>
  );
}

function ScenarioComparisonSummary({ result }: { result: ScenarioResult }) {
  const { t } = useLanguage();
  const { summary } = result;

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{t.scenarioComparison}</h3>

      {/* Key savings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3">
          <p className="text-xs text-green-700">{t.interestSaved}</p>
          <p className="text-lg sm:text-xl font-bold text-green-800 tabular-nums break-all">
            {formatCurrency(summary.interestSaved, t)}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
          <p className="text-xs text-blue-700">{t.paymentsSaved}</p>
          <p className="text-lg sm:text-xl font-bold text-blue-800 tabular-nums">
            {summary.paymentsSaved} {t.monthsLabel}
          </p>
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-md px-4 py-3">
          <p className="text-xs text-gray-600">{t.totalExtraPaymentsMade}</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900 tabular-nums break-all">
            {formatCurrency(summary.totalExtraPayments, t)}
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="w-full text-xs sm:text-sm min-w-[400px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700"></th>
              <th className="px-3 py-2 text-right font-medium text-gray-700 whitespace-nowrap">{t.originalLabel}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-700 whitespace-nowrap">{t.scenarioLabel}</th>
              <th className="px-3 py-2 text-right font-medium text-gray-700 whitespace-nowrap">{t.differenceLabel}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{t.monthlyPayment}</td>
              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">{formatCurrency(summary.originalMonthlyPayment, t)}</td>
              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">{formatCurrency(summary.newMonthlyPayment, t)}</td>
              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">
                {formatCurrency(summary.newMonthlyPayment - summary.originalMonthlyPayment, t)}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{t.totalInterest}</td>
              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">{formatCurrency(summary.originalTotalInterest, t)}</td>
              <td className="px-3 py-2 text-right tabular-nums whitespace-nowrap">{formatCurrency(summary.newTotalInterest, t)}</td>
              <td className="px-3 py-2 text-right tabular-nums text-green-700 font-medium whitespace-nowrap">
                {formatCurrency(summary.newTotalInterest - summary.originalTotalInterest, t)}
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{t.paymentsCount}</td>
              <td className="px-3 py-2 text-right tabular-nums">{summary.originalTotalPayments}</td>
              <td className="px-3 py-2 text-right tabular-nums">{summary.newTotalPayments}</td>
              <td className="px-3 py-2 text-right tabular-nums text-blue-700 font-medium">
                {summary.newTotalPayments - summary.originalTotalPayments}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScenarioScheduleTable({ result }: { result: ScenarioResult }) {
  const { t } = useLanguage();
  const { schedule } = result;

  return (
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{t.scenarioSchedule}</h3>

      <div className="overflow-x-auto max-h-80 sm:max-h-96 border border-gray-200 rounded-md">
        <table className="w-full text-xs sm:text-sm min-w-[600px]">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">{t.scheduleNumber}</th>
              <th className="px-2 sm:px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">{t.scheduleDate}</th>
              <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border-b border-gray-200">{t.schedulePayment}</th>
              <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border-b border-gray-200">{t.schedulePrincipal}</th>
              <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border-b border-gray-200">{t.scheduleInterest}</th>
              <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border-b border-gray-200">{t.scheduleExtraPayment}</th>
              <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border-b border-gray-200">{t.scheduleRate}</th>
              <th className="px-2 sm:px-3 py-2 text-right font-medium text-gray-700 border-b border-gray-200">{t.scheduleBalance}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {schedule.map((entry) => (
              <tr
                key={entry.paymentNumber}
                className={`hover:bg-gray-50 transition-colors ${entry.extraPayment ? 'bg-green-50/50' : ''}`}
              >
                <td className="px-2 sm:px-3 py-1.5 text-gray-600 tabular-nums">{entry.paymentNumber}</td>
                <td className="px-2 sm:px-3 py-1.5 text-gray-900 whitespace-nowrap">
                  {t.months[entry.month - 1]} {entry.year}
                </td>
                <td className="px-2 sm:px-3 py-1.5 text-right text-gray-900 font-medium tabular-nums whitespace-nowrap">
                  {formatCurrency(entry.payment, t)}
                </td>
                <td className="px-2 sm:px-3 py-1.5 text-right text-gray-700 tabular-nums whitespace-nowrap">
                  {formatCurrency(entry.principalPayment, t)}
                </td>
                <td className="px-2 sm:px-3 py-1.5 text-right text-gray-500 tabular-nums whitespace-nowrap">
                  {formatCurrency(entry.interestPayment, t)}
                </td>
                <td className="px-2 sm:px-3 py-1.5 text-right tabular-nums whitespace-nowrap">
                  {entry.extraPayment ? (
                    <span className="text-green-700 font-medium">
                      {formatCurrency(entry.extraPayment, t)}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-2 sm:px-3 py-1.5 text-right text-gray-500 tabular-nums whitespace-nowrap">
                  {entry.activeRate !== undefined ? formatPercent(entry.activeRate, t) : '-'}
                </td>
                <td className="px-2 sm:px-3 py-1.5 text-right text-gray-900 tabular-nums whitespace-nowrap">
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
