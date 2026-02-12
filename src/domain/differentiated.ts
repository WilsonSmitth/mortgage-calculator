import type { LoanParameters, ScheduleEntry } from './mortgageTypes';
import { calculateDailyInterestForMonth, getDaysInMonth } from './annuity';

/**
 * Calculate differentiated payment for a specific month
 */
export function calculateDifferentiatedPayment(
  remainingBalance: number,
  fixedPrincipalPayment: number,
  monthlyRate: number
): { payment: number; interestPayment: number; principalPayment: number } {
  const interestPayment = remainingBalance * monthlyRate;
  const payment = fixedPrincipalPayment + interestPayment;

  return {
    payment,
    interestPayment,
    principalPayment: fixedPrincipalPayment,
  };
}

/**
 * Generate differentiated payment schedule with monthly interest calculation
 */
export function generateDifferentiatedScheduleMonthly(
  params: LoanParameters,
  startYear: number,
  startMonth: number,
  firstPeriodDays?: number
): ScheduleEntry[] {
  const { principal, totalPayments, monthlyRate } = params;
  const fixedPrincipalPayment = principal / totalPayments;

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    let interestPayment: number;

    if (i === 1 && firstPeriodDays !== undefined && firstPeriodDays > 0) {
      const annualRate = monthlyRate * 12;
      const dailyRate = annualRate / 365;
      interestPayment = remainingBalance * dailyRate * firstPeriodDays;
    } else {
      interestPayment = remainingBalance * monthlyRate;
    }

    const payment = fixedPrincipalPayment + interestPayment;

    remainingBalance = Math.max(0, remainingBalance - fixedPrincipalPayment);

    if (i === totalPayments) {
      remainingBalance = 0;
    }

    schedule.push({
      paymentNumber: i,
      year: currentYear,
      month: currentMonth,
      payment,
      interestPayment,
      principalPayment: fixedPrincipalPayment,
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
 * Generate differentiated payment schedule with daily interest calculation
 */
export function generateDifferentiatedScheduleDaily(
  params: LoanParameters,
  startYear: number,
  startMonth: number,
  firstPeriodDays?: number
): ScheduleEntry[] {
  const { principal, totalPayments, dailyRate, dayCountConvention } = params;
  const fixedPrincipalPayment = principal / totalPayments;

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
    const payment = fixedPrincipalPayment + interestPayment;

    remainingBalance = Math.max(0, remainingBalance - fixedPrincipalPayment);

    if (i === totalPayments) {
      remainingBalance = 0;
    }

    schedule.push({
      paymentNumber: i,
      year: currentYear,
      month: currentMonth,
      payment,
      interestPayment,
      principalPayment: fixedPrincipalPayment,
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
