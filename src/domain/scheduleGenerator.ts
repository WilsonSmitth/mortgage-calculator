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

  if (input.paymentType === 'annuity') {
    if (input.interestCalculationMethod === 'monthly') {
      return generateAnnuityScheduleMonthly(params, startYear, startMonth);
    } else {
      return generateAnnuityScheduleDaily(params, startYear, startMonth);
    }
  } else {
    if (input.interestCalculationMethod === 'monthly') {
      return generateDifferentiatedScheduleMonthly(params, startYear, startMonth);
    } else {
      return generateDifferentiatedScheduleDaily(params, startYear, startMonth);
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
  const lastPayment = schedule[schedule.length - 1]?.payment ?? 0;

  return {
    monthlyPayment: firstPayment,
    lastMonthlyPayment: firstPayment !== lastPayment ? lastPayment : undefined,
    totalAmountPaid,
    totalInterestPaid,
    overpaymentRatio,
    principal,
  };
}
