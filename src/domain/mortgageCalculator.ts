import type { MortgageInput, MortgageResult } from './mortgageTypes';
import { deriveLoanParameters, generateSchedule, calculateSummary } from './scheduleGenerator';

/**
 * Main facade function for mortgage calculations
 *
 * @param input - User input parameters
 * @param startYear - Optional start year (defaults to current year)
 * @param startMonth - Optional start month (defaults to current month)
 * @returns Complete mortgage calculation result
 */
export function calculateMortgage(
  input: MortgageInput,
  startYear?: number,
  startMonth?: number
): MortgageResult {
  const params = deriveLoanParameters(input);

  // Validate input
  if (params.principal <= 0) {
    throw new Error('Principal must be greater than 0');
  }
  if (input.annualInterestRate < 0) {
    throw new Error('Interest rate cannot be negative');
  }
  if (input.loanTermYears <= 0) {
    throw new Error('Loan term must be greater than 0');
  }

  const schedule = generateSchedule(input, startYear, startMonth);
  const summary = calculateSummary(schedule, params.principal);

  return {
    summary,
    schedule,
    input,
  };
}

/**
 * Validate mortgage input and return validation errors
 */
export function validateMortgageInput(input: Partial<MortgageInput>): string[] {
  const errors: string[] = [];

  if (!input.propertyPrice || input.propertyPrice <= 0) {
    errors.push('Property price must be greater than 0');
  }

  if (input.downPayment === undefined || input.downPayment < 0) {
    errors.push('Down payment cannot be negative');
  }

  if (input.propertyPrice && input.downPayment !== undefined && input.downPayment >= input.propertyPrice) {
    errors.push('Down payment must be less than property price');
  }

  if (!input.loanTermYears || input.loanTermYears <= 0 || input.loanTermYears > 50) {
    errors.push('Loan term must be between 1 and 50 years');
  }

  if (input.annualInterestRate === undefined || input.annualInterestRate < 0 || input.annualInterestRate > 1) {
    errors.push('Interest rate must be between 0% and 100%');
  }

  return errors;
}

// Re-export types for convenience
export type { MortgageInput, MortgageResult, MortgageSummary, ScheduleEntry } from './mortgageTypes';
