import type { LoanParameters, ScheduleEntry } from './mortgageTypes';

/**
 * Calculate annuity (fixed) monthly payment
 *
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateAnnuityPayment(
  principal: number,
  monthlyRate: number,
  totalPayments: number
): number {
  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  const compoundFactor = Math.pow(1 + monthlyRate, totalPayments);
  return principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);
}

/**
 * Calculate monthly interest for daily calculation method
 */
export function calculateDailyInterestForMonth(
  remainingBalance: number,
  dailyRate: number,
  daysInMonth: number
): number {
  return remainingBalance * dailyRate * daysInMonth;
}

/**
 * Get number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Generate annuity payment schedule with monthly interest calculation.
 * Supports optional firstPeriodDays for when the first payment period
 * differs from a standard month (e.g., loan disbursed mid-month).
 */
export function generateAnnuityScheduleMonthly(
  params: LoanParameters,
  startYear: number,
  startMonth: number,
  firstPeriodDays?: number
): ScheduleEntry[] {
  const { principal, totalPayments, monthlyRate } = params;
  const monthlyPayment = calculateAnnuityPayment(principal, monthlyRate, totalPayments);

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    let interestPayment: number;
    let principalPayment: number;
    let payment: number;

    if (i === 1 && firstPeriodDays !== undefined && firstPeriodDays > 0) {
      // First payment covers a non-standard period.
      // Calculate interest based on actual days instead of monthly rate.
      const annualRate = monthlyRate * 12;
      const dailyRate = annualRate / 365;
      interestPayment = remainingBalance * dailyRate * firstPeriodDays;
      // Principal portion stays the same as in standard annuity
      const standardInterest = remainingBalance * monthlyRate;
      principalPayment = monthlyPayment - standardInterest;
      payment = principalPayment + interestPayment;
    } else {
      interestPayment = remainingBalance * monthlyRate;
      principalPayment = monthlyPayment - interestPayment;
      payment = monthlyPayment;
    }

    if (i === totalPayments) {
      principalPayment = remainingBalance;
      payment = principalPayment + interestPayment;
    }

    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      paymentNumber: i,
      year: currentYear,
      month: currentMonth,
      payment,
      interestPayment,
      principalPayment,
      remainingBalance,
    });

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return schedule;
}

/**
 * Generate annuity payment schedule with daily interest calculation
 */
export function generateAnnuityScheduleDaily(
  params: LoanParameters,
  startYear: number,
  startMonth: number,
  firstPeriodDays?: number
): ScheduleEntry[] {
  const { principal, totalPayments, monthlyRate, dailyRate, dayCountConvention } = params;

  const baseMonthlyPayment = calculateAnnuityPayment(principal, monthlyRate, totalPayments);

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    let daysInMonth: number;

    if (i === 1 && firstPeriodDays !== undefined && firstPeriodDays > 0) {
      daysInMonth = firstPeriodDays;
    } else {
      daysInMonth = dayCountConvention === 360 ? 30 : getDaysInMonth(currentYear, currentMonth);
    }

    const interestPayment = calculateDailyInterestForMonth(remainingBalance, dailyRate, daysInMonth);

    const standardInterest = remainingBalance * monthlyRate;
    let principalPayment = baseMonthlyPayment - standardInterest;
    let payment = principalPayment + interestPayment;

    if (i === totalPayments) {
      principalPayment = remainingBalance;
      payment = principalPayment + interestPayment;
    }

    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      paymentNumber: i,
      year: currentYear,
      month: currentMonth,
      payment,
      interestPayment,
      principalPayment,
      remainingBalance,
      daysInMonth,
    });

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return schedule;
}
