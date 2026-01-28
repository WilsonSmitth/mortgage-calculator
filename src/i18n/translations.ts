export type Language = 'en' | 'pl' | 'ru';

export interface Translations {
  // App header
  appTitle: string;
  appSubtitle: string;

  // Form labels
  formTitle: string;
  propertyPrice: string;
  downPayment: string;
  loanAmount: string;
  loanTerm: string;
  loanTermYears: string;
  annualInterestRate: string;
  paymentType: string;
  annuity: string;
  differentiated: string;
  annuityDescription: string;
  differentiatedDescription: string;
  interestCalculation: string;
  monthly: string;
  daily: string;
  dayCountConvention: string;
  days: string;
  dayCount365Description: string;
  dayCount360Description: string;

  // Summary
  summaryTitle: string;
  monthlyPayment: string;
  lastPayment: string;
  loanAmountLabel: string;
  totalInterest: string;
  totalAmount: string;
  overpaymentRatio: string;
  interestPrincipal: string;

  // Schedule
  scheduleTitle: string;
  scheduleNumber: string;
  scheduleDate: string;
  schedulePayment: string;
  schedulePrincipal: string;
  scheduleInterest: string;
  scheduleBalance: string;
  paymentsCount: string;

  // Disclaimer
  disclaimerTitle: string;
  disclaimerText: string;

  // Months
  months: string[];

  // Currency
  currencyCode: string;
  currencySymbol: string;
  locale: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Mortgage Calculator',
    appSubtitle: 'Calculate your mortgage payments with detailed amortization schedule',

    formTitle: 'Loan Parameters',
    propertyPrice: 'Property Price',
    downPayment: 'Down Payment',
    loanAmount: 'Loan amount',
    loanTerm: 'Loan Term',
    loanTermYears: 'years',
    annualInterestRate: 'Annual Interest Rate',
    paymentType: 'Payment Type',
    annuity: 'Annuity (Fixed)',
    differentiated: 'Differentiated',
    annuityDescription: 'Fixed monthly payment throughout the loan term',
    differentiatedDescription: 'Fixed principal, decreasing interest over time',
    interestCalculation: 'Interest Calculation',
    monthly: 'Monthly',
    daily: 'Daily',
    dayCountConvention: 'Day Count Convention',
    days: 'days',
    dayCount365Description: 'Actual days per month, 365 days/year',
    dayCount360Description: '30 days per month, 360 days/year',

    summaryTitle: 'Summary',
    monthlyPayment: 'Monthly Payment',
    lastPayment: 'Last payment',
    loanAmountLabel: 'Loan Amount',
    totalInterest: 'Total Interest',
    totalAmount: 'Total Amount',
    overpaymentRatio: 'Overpayment Ratio',
    interestPrincipal: 'Interest / Principal',

    scheduleTitle: 'Payment Schedule',
    scheduleNumber: '#',
    scheduleDate: 'Date',
    schedulePayment: 'Payment',
    schedulePrincipal: 'Principal',
    scheduleInterest: 'Interest',
    scheduleBalance: 'Balance',
    paymentsCount: 'Number of payments',

    disclaimerTitle: 'Disclaimer',
    disclaimerText: 'This calculator provides estimates for educational purposes only. Results may differ from actual bank offers and do not constitute a financial agreement. The calculations shown are estimates and may not reflect the actual terms, rates, or payments you may receive from a lender. Actual mortgage terms depend on many factors including your credit score, income, debt-to-income ratio, property type, and current market conditions. This tool does not constitute financial advice. Always consult with a qualified financial advisor or mortgage professional before making any financial decisions.',

    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    currencyCode: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
  },

  pl: {
    appTitle: 'Kalkulator kredytu hipotecznego',
    appSubtitle: 'Oblicz raty kredytu i zobacz szczegółowy harmonogram spłat',

    formTitle: 'Parametry kredytu',
    propertyPrice: 'Cena nieruchomości',
    downPayment: 'Wkład własny',
    loanAmount: 'Kwota kredytu',
    loanTerm: 'Okres kredytowania',
    loanTermYears: 'lata',
    annualInterestRate: 'Oprocentowanie roczne',
    paymentType: 'Rodzaj rat',
    annuity: 'Równe (annuitetowe)',
    differentiated: 'Malejące',
    annuityDescription: 'Stała rata przez cały okres kredytowania',
    differentiatedDescription: 'Stała część kapitałowa, malejące odsetki',
    interestCalculation: 'Naliczanie odsetek',
    monthly: 'Miesięczne',
    daily: 'Dzienne',
    dayCountConvention: 'Konwencja dni w roku',
    days: 'dni',
    dayCount365Description: 'Rzeczywista liczba dni w miesiącu, 365 dni/rok',
    dayCount360Description: '30 dni w miesiącu, 360 dni/rok',

    summaryTitle: 'Podsumowanie',
    monthlyPayment: 'Rata miesięczna',
    lastPayment: 'Ostatnia rata',
    loanAmountLabel: 'Kwota kredytu',
    totalInterest: 'Suma odsetek',
    totalAmount: 'Suma do spłaty',
    overpaymentRatio: 'Wskaźnik nadpłaty',
    interestPrincipal: 'Odsetki / Kapitał',

    scheduleTitle: 'Harmonogram spłat',
    scheduleNumber: '#',
    scheduleDate: 'Data',
    schedulePayment: 'Rata',
    schedulePrincipal: 'Kapitał',
    scheduleInterest: 'Odsetki',
    scheduleBalance: 'Saldo',
    paymentsCount: 'Liczba rat',

    disclaimerTitle: 'Zastrzeżenie',
    disclaimerText: 'Niniejszy kalkulator służy wyłącznie celom edukacyjnym i poglądowym. Wyniki mogą różnić się od rzeczywistych ofert bankowych i nie stanowią umowy finansowej. Przedstawione obliczenia są szacunkowe i mogą nie odzwierciedlać faktycznych warunków, stawek lub rat, które otrzymasz od kredytodawcy. Rzeczywiste warunki kredytu hipotecznego zależą od wielu czynników, w tym zdolności kredytowej, dochodów, wskaźnika zadłużenia, rodzaju nieruchomości i aktualnych warunków rynkowych. To narzędzie nie stanowi porady finansowej. Przed podjęciem jakichkolwiek decyzji finansowych zawsze skonsultuj się z wykwalifikowanym doradcą finansowym lub specjalistą ds. kredytów hipotecznych.',

    months: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],

    currencyCode: 'PLN',
    currencySymbol: 'zł',
    locale: 'pl-PL',
  },

  ru: {
    appTitle: 'Ипотечный калькулятор',
    appSubtitle: 'Рассчитайте ежемесячные платежи и просмотрите график погашения',

    formTitle: 'Параметры кредита',
    propertyPrice: 'Стоимость недвижимости',
    downPayment: 'Первоначальный взнос',
    loanAmount: 'Сумма кредита',
    loanTerm: 'Срок кредита',
    loanTermYears: 'лет',
    annualInterestRate: 'Годовая процентная ставка',
    paymentType: 'Тип платежей',
    annuity: 'Аннуитетные (равные)',
    differentiated: 'Дифференцированные',
    annuityDescription: 'Фиксированный платёж на весь срок кредита',
    differentiatedDescription: 'Фиксированная часть основного долга, убывающие проценты',
    interestCalculation: 'Начисление процентов',
    monthly: 'Ежемесячное',
    daily: 'Ежедневное',
    dayCountConvention: 'Конвенция дней в году',
    days: 'дней',
    dayCount365Description: 'Фактическое число дней в месяце, 365 дней/год',
    dayCount360Description: '30 дней в месяце, 360 дней/год',

    summaryTitle: 'Итого',
    monthlyPayment: 'Ежемесячный платёж',
    lastPayment: 'Последний платёж',
    loanAmountLabel: 'Сумма кредита',
    totalInterest: 'Общая сумма процентов',
    totalAmount: 'Общая сумма выплат',
    overpaymentRatio: 'Коэффициент переплаты',
    interestPrincipal: 'Проценты / Основной долг',

    scheduleTitle: 'График платежей',
    scheduleNumber: '№',
    scheduleDate: 'Дата',
    schedulePayment: 'Платёж',
    schedulePrincipal: 'Основной долг',
    scheduleInterest: 'Проценты',
    scheduleBalance: 'Остаток',
    paymentsCount: 'Количество платежей',

    disclaimerTitle: 'Отказ от ответственности',
    disclaimerText: 'Данный калькулятор предоставляет оценочные расчёты исключительно в образовательных целях. Результаты могут отличаться от реальных банковских предложений и не являются финансовым соглашением. Представленные расчёты являются приблизительными и могут не отражать фактические условия, ставки или платежи, которые вы получите от кредитора. Реальные условия ипотеки зависят от многих факторов, включая кредитную историю, доход, соотношение долга к доходу, тип недвижимости и текущие рыночные условия. Этот инструмент не является финансовой консультацией. Перед принятием любых финансовых решений всегда консультируйтесь с квалифицированным финансовым консультантом или специалистом по ипотеке.',

    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],

    currencyCode: 'RUB',
    currencySymbol: '₽',
    locale: 'ru-RU',
  },
};
