/**
 * Payment type: annuity (fixed monthly payment) or differentiated (decreasing payment)
 */
export type PaymentType = 'annuity' | 'differentiated';

/**
 * Interest calculation method
 * - monthly: rate/12 applied monthly
 * - daily: rate/daysInYear applied daily, then summed for month
 */
export type InterestCalculationMethod = 'monthly' | 'daily';

/**
 * Day count convention for daily interest calculation
 * - 360: Assume 360 days/year (30 days/month)
 * - 365: Assume 365 days/year (actual days per month)
 */
export type DayCountConvention = 360 | 365;

/**
 * User input parameters for mortgage calculation
 */
export interface MortgageInput {
  /** Property purchase price */
  propertyPrice: number;

  /** Down payment amount (derived from percentage if using percentage mode) */
  downPayment: number;

  /** Loan term in years */
  loanTermYears: number;

  /** Annual interest rate as decimal (e.g., 0.05 for 5%) */
  annualInterestRate: number;

  /** Payment type selection */
  paymentType: PaymentType;

  /** How interest is calculated */
  interestCalculationMethod: InterestCalculationMethod;

  /** Day count convention (only relevant for daily calculation) */
  dayCountConvention: DayCountConvention;
}

/**
 * Derived loan parameters used in calculations
 */
export interface LoanParameters {
  /** Principal = propertyPrice - downPayment */
  principal: number;

  /** Total number of payments (months) */
  totalPayments: number;

  /** Monthly interest rate (for monthly method) */
  monthlyRate: number;

  /** Daily interest rate (for daily method) */
  dailyRate: number;

  /** Day count convention */
  dayCountConvention: DayCountConvention;
}

/**
 * Single row in the payment schedule
 */
export interface ScheduleEntry {
  /** Payment number (1-indexed) */
  paymentNumber: number;

  /** Year of payment */
  year: number;

  /** Month of payment (1-12) */
  month: number;

  /** Total payment for this month */
  payment: number;

  /** Interest portion of payment */
  interestPayment: number;

  /** Principal portion of payment */
  principalPayment: number;

  /** Remaining balance after payment */
  remainingBalance: number;

  /** Days in this month (for daily calculation display) */
  daysInMonth?: number;
}

/**
 * Summary statistics for the loan
 */
export interface MortgageSummary {
  /** Monthly payment (fixed for annuity, first month for differentiated) */
  monthlyPayment: number;

  /** For differentiated: last month's payment */
  lastMonthlyPayment?: number;

  /** Total amount paid over loan lifetime */
  totalAmountPaid: number;

  /** Total interest paid */
  totalInterestPaid: number;

  /** Overpayment ratio = totalInterestPaid / principal */
  overpaymentRatio: number;

  /** Principal amount */
  principal: number;
}

/**
 * Complete calculation result
 */
export interface MortgageResult {
  summary: MortgageSummary;
  schedule: ScheduleEntry[];
  input: MortgageInput;
}

/**
 * Utility type for form state (includes percentage toggle)
 */
export interface MortgageFormState extends Omit<MortgageInput, 'downPayment'> {
  downPaymentValue: number;
  downPaymentMode: 'amount' | 'percentage';
}
