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

  /** Optional: custom first payment amount override */
  firstPaymentOverride?: number;

  /**
   * Optional: number of days in first period.
   * When loan disbursement date != first payment date - 1 month,
   * the first payment covers a different number of days.
   * E.g., loan on Jan 15, first payment Feb 1 — first period is 17 days,
   * but interest accrues from Jan 15 to Mar 1 (45 days) making first payment higher.
   */
  firstPeriodDays?: number;
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

  /** Extra payment made this month (for scenarios) */
  extraPayment?: number;

  /** Interest rate active during this payment (for scenarios with rate changes) */
  activeRate?: number;
}

/**
 * Summary statistics for the loan
 */
export interface MortgageSummary {
  /** Monthly payment (fixed for annuity, first month for differentiated) */
  monthlyPayment: number;

  /** First payment amount if it differs from regular (first-period adjustment) */
  firstPaymentAmount?: number;

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

// ============= Scenario Types =============

export type ExtraPaymentFrequency = 'one-time' | 'monthly' | 'yearly';

export interface ExtraPaymentEvent {
  id: string;
  amount: number;
  frequency: ExtraPaymentFrequency;
  /** Payment number when this starts (1-indexed) */
  startAtPayment: number;
  /** For monthly/yearly: payment number when this stops (inclusive) */
  endAtPayment?: number;
  /** How to apply: reduce monthly payment or reduce term */
  effect: 'reduce-payment' | 'reduce-term';
}

export interface RateChangeEvent {
  id: string;
  /** New annual interest rate as decimal */
  newRate: number;
  /** Payment number when rate changes (1-indexed) */
  atPayment: number;
}

export interface ScenarioInput {
  baseInput: MortgageInput;
  startYear: number;
  startMonth: number;
  extraPayments: ExtraPaymentEvent[];
  rateChanges: RateChangeEvent[];
}

export interface ScenarioSummary {
  originalTotalInterest: number;
  originalTotalPayments: number;
  originalMonthlyPayment: number;
  newTotalInterest: number;
  newTotalPayments: number;
  newMonthlyPayment: number;
  interestSaved: number;
  paymentsSaved: number;
  totalExtraPayments: number;
}

export interface ScenarioResult {
  summary: ScenarioSummary;
  schedule: ScheduleEntry[];
  originalSchedule: ScheduleEntry[];
}
