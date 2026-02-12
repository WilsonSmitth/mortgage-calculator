import type {
  ScenarioInput,
  ScenarioResult,
  ScenarioSummary,
  ScheduleEntry,
  ExtraPaymentEvent,
  RateChangeEvent,
} from './mortgageTypes';
import { calculateAnnuityPayment, getDaysInMonth, calculateDailyInterestForMonth } from './annuity';
import { deriveLoanParameters, generateSchedule, calculateSummary } from './scheduleGenerator';

/**
 * Get the effective annual rate at a given payment number,
 * considering all rate change events sorted by atPayment.
 */
function getEffectiveRate(
  baseRate: number,
  rateChanges: RateChangeEvent[],
  paymentNumber: number
): number {
  let rate = baseRate;
  for (const rc of rateChanges) {
    if (paymentNumber >= rc.atPayment) {
      rate = rc.newRate;
    }
  }
  return rate;
}

/**
 * Get total extra payment for a given payment number.
 */
function getExtraPayment(
  extraPayments: ExtraPaymentEvent[],
  paymentNumber: number
): number {
  let total = 0;
  for (const ep of extraPayments) {
    if (ep.frequency === 'one-time') {
      if (paymentNumber === ep.startAtPayment) {
        total += ep.amount;
      }
    } else if (ep.frequency === 'monthly') {
      const end = ep.endAtPayment ?? Infinity;
      if (paymentNumber >= ep.startAtPayment && paymentNumber <= end) {
        total += ep.amount;
      }
    } else if (ep.frequency === 'yearly') {
      const end = ep.endAtPayment ?? Infinity;
      if (paymentNumber >= ep.startAtPayment && paymentNumber <= end) {
        // Yearly: apply every 12 payments from start
        const offset = paymentNumber - ep.startAtPayment;
        if (offset % 12 === 0) {
          total += ep.amount;
        }
      }
    }
  }
  return total;
}

/**
 * Check if any extra payment event wants to reduce payment (vs reduce term)
 */
function shouldReducePayment(
  extraPayments: ExtraPaymentEvent[],
  paymentNumber: number
): boolean {
  for (const ep of extraPayments) {
    const isActive = ep.frequency === 'one-time'
      ? paymentNumber === ep.startAtPayment
      : paymentNumber >= ep.startAtPayment && paymentNumber <= (ep.endAtPayment ?? Infinity);

    if (isActive && ep.effect === 'reduce-payment') {
      return true;
    }
  }
  return false;
}

/**
 * Calculate scenario: apply extra payments and rate changes to a mortgage.
 *
 * For annuity loans:
 * - "reduce-term": extra payment goes to principal, monthly payment stays same, loan ends sooner
 * - "reduce-payment": after extra payment, recalculate monthly payment for remaining term
 *
 * For differentiated loans:
 * - Extra payment reduces principal, subsequent fixed principal portions are recalculated
 */
export function calculateScenario(input: ScenarioInput): ScenarioResult {
  const { baseInput, startYear, startMonth, extraPayments, rateChanges } = input;

  // Sort rate changes by payment number
  const sortedRateChanges = [...rateChanges].sort((a, b) => a.atPayment - b.atPayment);

  // Generate original schedule for comparison
  const originalSchedule = generateSchedule(baseInput, startYear, startMonth);
  const params = deriveLoanParameters(baseInput);
  const originalSummary = calculateSummary(originalSchedule, params.principal);

  // Now generate scenario schedule
  const schedule: ScheduleEntry[] = [];
  let remainingBalance = params.principal;
  let currentYear = startYear;
  let currentMonth = startMonth;
  let currentAnnualRate = baseInput.annualInterestRate;
  let currentMonthlyRate = currentAnnualRate / 12;
  let remainingPayments = params.totalPayments;
  let currentMonthlyPayment = calculateAnnuityPayment(
    params.principal,
    currentMonthlyRate,
    params.totalPayments
  );
  let totalExtraPayments = 0;

  const maxPayments = params.totalPayments * 2; // Safety limit

  for (let i = 1; i <= maxPayments && remainingBalance > 0.01; i++) {
    // Check for rate change
    const newRate = getEffectiveRate(baseInput.annualInterestRate, sortedRateChanges, i);
    if (Math.abs(newRate - currentAnnualRate) > 1e-10) {
      currentAnnualRate = newRate;
      currentMonthlyRate = currentAnnualRate / 12;
      // Recalculate monthly payment for remaining balance and remaining payments
      if (baseInput.paymentType === 'annuity') {
        currentMonthlyPayment = calculateAnnuityPayment(
          remainingBalance,
          currentMonthlyRate,
          remainingPayments
        );
      }
    }

    // Calculate interest
    let interestPayment: number;
    if (baseInput.interestCalculationMethod === 'daily') {
      const dayCount = baseInput.dayCountConvention;
      const dailyRate = currentAnnualRate / dayCount;
      const daysInMonth = dayCount === 360 ? 30 : getDaysInMonth(currentYear, currentMonth);
      interestPayment = calculateDailyInterestForMonth(remainingBalance, dailyRate, daysInMonth);
    } else {
      interestPayment = remainingBalance * currentMonthlyRate;
    }

    // Calculate principal payment
    let principalPayment: number;
    let payment: number;

    if (baseInput.paymentType === 'annuity') {
      principalPayment = Math.min(currentMonthlyPayment - interestPayment, remainingBalance);
      payment = principalPayment + interestPayment;
    } else {
      // Differentiated
      const fixedPrincipal = remainingBalance / remainingPayments;
      principalPayment = Math.min(fixedPrincipal, remainingBalance);
      payment = principalPayment + interestPayment;
    }

    // Apply extra payments
    const extraPaymentAmount = getExtraPayment(extraPayments, i);
    let appliedExtra = 0;
    if (extraPaymentAmount > 0) {
      appliedExtra = Math.min(extraPaymentAmount, remainingBalance - principalPayment);
      if (appliedExtra > 0) {
        totalExtraPayments += appliedExtra;
      }
    }

    remainingBalance = Math.max(0, remainingBalance - principalPayment - appliedExtra);
    remainingPayments--;

    // If extra payment and "reduce-payment" effect, recalculate monthly payment
    if (appliedExtra > 0 && shouldReducePayment(extraPayments, i) && baseInput.paymentType === 'annuity') {
      if (remainingPayments > 0 && remainingBalance > 0.01) {
        currentMonthlyPayment = calculateAnnuityPayment(
          remainingBalance,
          currentMonthlyRate,
          remainingPayments
        );
      }
    }

    schedule.push({
      paymentNumber: i,
      year: currentYear,
      month: currentMonth,
      payment: payment + appliedExtra,
      interestPayment,
      principalPayment: principalPayment + appliedExtra,
      remainingBalance,
      extraPayment: appliedExtra > 0 ? appliedExtra : undefined,
      activeRate: currentAnnualRate,
    });

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  // Calculate scenario summary
  const newTotalInterest = schedule.reduce((sum, e) => sum + e.interestPayment, 0);

  // Find the "regular" monthly payment (last entry without extra)
  let regularPayment = currentMonthlyPayment;
  for (let j = schedule.length - 1; j >= 0; j--) {
    if (!schedule[j].extraPayment) {
      regularPayment = schedule[j].payment;
      break;
    }
  }

  const summary: ScenarioSummary = {
    originalTotalInterest: originalSummary.totalInterestPaid,
    originalTotalPayments: originalSchedule.length,
    originalMonthlyPayment: originalSummary.monthlyPayment,
    newTotalInterest,
    newTotalPayments: schedule.length,
    newMonthlyPayment: regularPayment,
    interestSaved: originalSummary.totalInterestPaid - newTotalInterest,
    paymentsSaved: originalSchedule.length - schedule.length,
    totalExtraPayments,
  };

  return {
    summary,
    schedule,
    originalSchedule,
  };
}
