import type { LoanParameters, ScheduleEntry } from './mortgageTypes';

/**
 * Calculate annuity (fixed) monthly payment
 *
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Where:
 * - M = monthly payment
 * - P = principal (loan amount)
 * - r = monthly interest rate (annual rate / 12)
 * - n = total number of payments (months)
 *
 * @param principal - Loan amount
 * @param monthlyRate - Monthly interest rate as decimal
 * @param totalPayments - Total number of monthly payments
 * @returns Fixed monthly payment amount
 */
export function calculateAnnuityPayment(
  principal: number,
  monthlyRate: number,
  totalPayments: number
): number {
  // Handle edge case: 0% interest
  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  const compoundFactor = Math.pow(1 + monthlyRate, totalPayments);
  const payment = principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);

  return payment;
}

/**
 * Calculate monthly interest for daily calculation method
 *
 * For daily interest calculation:
 * - Daily rate = annual rate / days in year (360 or 365)
 * - Monthly interest = remaining balance * daily rate * days in month
 *
 * @param remainingBalance - Current remaining principal
 * @param dailyRate - Daily interest rate
 * @param daysInMonth - Number of days in the current month
 * @returns Interest amount for the month
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
 *
 * @param year - Full year (e.g., 2024)
 * @param month - Month (1-12)
 * @returns Number of days in the month
 */
export function getDaysInMonth(year: number, month: number): number {
  // Month in Date constructor is 0-indexed, using day 0 gives last day of previous month
  return new Date(year, month, 0).getDate();
}

/**
 * Generate annuity payment schedule with monthly interest calculation
 *
 * @param params - Loan parameters
 * @param startYear - Year when loan starts
 * @param startMonth - Month when loan starts (1-12)
 * @returns Array of schedule entries
 */
export function generateAnnuityScheduleMonthly(
  params: LoanParameters,
  startYear: number,
  startMonth: number
): ScheduleEntry[] {
  const { principal, totalPayments, monthlyRate } = params;
  const monthlyPayment = calculateAnnuityPayment(principal, monthlyRate, totalPayments);

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    const interestPayment = remainingBalance * monthlyRate;
    let principalPayment = monthlyPayment - interestPayment;
    let payment = monthlyPayment;

    // Fix floating point issues on last payment
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

    // Advance to next month
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
 *
 * When using daily interest calculation, the interest varies by actual days in month,
 * but principal amortization follows the standard annuity trajectory.
 *
 * @param params - Loan parameters
 * @param startYear - Year when loan starts
 * @param startMonth - Month when loan starts (1-12)
 * @returns Array of schedule entries
 */
export function generateAnnuityScheduleDaily(
  params: LoanParameters,
  startYear: number,
  startMonth: number
): ScheduleEntry[] {
  const { principal, totalPayments, monthlyRate, dailyRate, dayCountConvention } = params;

  // Calculate base payment using monthly rate for principal amortization schedule
  const baseMonthlyPayment = calculateAnnuityPayment(principal, monthlyRate, totalPayments);

  const schedule: ScheduleEntry[] = [];
  let remainingBalance = principal;
  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= totalPayments; i++) {
    const daysInMonth = dayCountConvention === 360 ? 30 : getDaysInMonth(currentYear, currentMonth);
    const interestPayment = calculateDailyInterestForMonth(remainingBalance, dailyRate, daysInMonth);

    // Principal payment follows standard amortization based on monthly rate
    const standardInterest = remainingBalance * monthlyRate;
    let principalPayment = baseMonthlyPayment - standardInterest;
    let payment = principalPayment + interestPayment;

    // Fix floating point issues on last payment
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
