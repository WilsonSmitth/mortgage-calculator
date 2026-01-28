import type { LoanParameters, ScheduleEntry } from './mortgageTypes';
import { calculateDailyInterestForMonth, getDaysInMonth } from './annuity';

/**
 * Calculate differentiated payment for a specific month
 *
 * In differentiated payment scheme:
 * - Principal portion is constant: P / n (principal / total payments)
 * - Interest portion decreases as balance decreases
 * - Total payment = fixed principal + variable interest
 *
 * @param remainingBalance - Current remaining principal
 * @param fixedPrincipalPayment - Fixed principal portion each month
 * @param monthlyRate - Monthly interest rate
 * @returns Object with payment breakdown
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
 *
 * @param params - Loan parameters
 * @param startYear - Year when loan starts
 * @param startMonth - Month when loan starts (1-12)
 * @returns Array of schedule entries
 */
export function generateDifferentiatedScheduleMonthly(
  params: LoanParameters,
  startYear: number,
  startMonth: number
): ScheduleEntry[] {
  const { principal, totalPayments, monthlyRate } = params;
  const fixedPrincipalPayment = principal / totalPayments;

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    const { payment, interestPayment, principalPayment } = calculateDifferentiatedPayment(
      remainingBalance,
      fixedPrincipalPayment,
      monthlyRate
    );

    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    // Fix floating point issues on last payment
    if (i === totalPayments) {
      remainingBalance = 0;
    }

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
 * Generate differentiated payment schedule with daily interest calculation
 *
 * @param params - Loan parameters
 * @param startYear - Year when loan starts
 * @param startMonth - Month when loan starts (1-12)
 * @returns Array of schedule entries
 */
export function generateDifferentiatedScheduleDaily(
  params: LoanParameters,
  startYear: number,
  startMonth: number
): ScheduleEntry[] {
  const { principal, totalPayments, dailyRate, dayCountConvention } = params;
  const fixedPrincipalPayment = principal / totalPayments;

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    const daysInMonth = dayCountConvention === 360 ? 30 : getDaysInMonth(currentYear, currentMonth);
    const interestPayment = calculateDailyInterestForMonth(remainingBalance, dailyRate, daysInMonth);
    const payment = fixedPrincipalPayment + interestPayment;

    remainingBalance = Math.max(0, remainingBalance - fixedPrincipalPayment);

    // Fix floating point issues on last payment
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
