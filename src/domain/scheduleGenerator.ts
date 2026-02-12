import type {
  MortgageInput,
  LoanParameters,
  ScheduleEntry,
  MortgageSummary,
} from './mortgageTypes';
import {
  generateAnnuityScheduleMonthly,
  generateAnnuityScheduleDaily,
} from './annuity';
import {
  generateDifferentiatedScheduleMonthly,
  generateDifferentiatedScheduleDaily,
} from './differentiated';

/**
 * Derive loan parameters from user input
 */
export function deriveLoanParameters(input: MortgageInput): LoanParameters {
  const principal = input.propertyPrice - input.downPayment;
  const totalPayments = input.loanTermYears * 12;
  const monthlyRate = input.annualInterestRate / 12;
  const dailyRate = input.annualInterestRate / input.dayCountConvention;

  return {
    principal,
    totalPayments,
    monthlyRate,
    dailyRate,
    dayCountConvention: input.dayCountConvention,
  };
}

/**
 * Generate payment schedule based on input parameters
 */
export function generateSchedule(
  input: MortgageInput,
  startYear: number = new Date().getFullYear(),
  startMonth: number = new Date().getMonth() + 1
): ScheduleEntry[] {
  const params = deriveLoanParameters(input);
  const firstPeriodDays = input.firstPeriodDays;

  if (input.paymentType === 'annuity') {
    if (input.interestCalculationMethod === 'monthly') {
      return generateAnnuityScheduleMonthly(params, startYear, startMonth, firstPeriodDays);
    } else {
      return generateAnnuityScheduleDaily(params, startYear, startMonth, firstPeriodDays);
    }
  } else {
    if (input.interestCalculationMethod === 'monthly') {
      return generateDifferentiatedScheduleMonthly(params, startYear, startMonth, firstPeriodDays);
    } else {
      return generateDifferentiatedScheduleDaily(params, startYear, startMonth, firstPeriodDays);
    }
  }
}

/**
 * Calculate summary statistics from schedule
 */
export function calculateSummary(
  schedule: ScheduleEntry[],
  principal: number
): MortgageSummary {
  const totalAmountPaid = schedule.reduce((sum, entry) => sum + entry.payment, 0);
  const totalInterestPaid = schedule.reduce((sum, entry) => sum + entry.interestPayment, 0);
  const overpaymentRatio = principal > 0 ? totalInterestPaid / principal : 0;

  const firstPayment = schedule[0]?.payment ?? 0;
  // For annuity with first-period adjustment: show the "regular" payment (2nd month),
  // and surface the first payment separately
  const secondPayment = schedule.length > 1 ? schedule[1].payment : firstPayment;
  const lastPayment = schedule[schedule.length - 1]?.payment ?? 0;

  // If first payment differs from second by more than 1 cent, it's a first-period adjustment
  const hasFirstPaymentAdjustment = Math.abs(firstPayment - secondPayment) > 0.01;

  return {
    monthlyPayment: hasFirstPaymentAdjustment ? secondPayment : firstPayment,
    firstPaymentAmount: hasFirstPaymentAdjustment ? firstPayment : undefined,
    lastMonthlyPayment: Math.abs(secondPayment - lastPayment) > 0.01 ? lastPayment : undefined,
    totalAmountPaid,
    totalInterestPaid,
    overpaymentRatio,
    principal,
  };
}
