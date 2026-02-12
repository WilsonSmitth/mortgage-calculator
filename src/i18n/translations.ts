export type Language = 'en' | 'pl' | 'ru';

export interface Translations {
  // App header
  appTitle: string;
  appSubtitle: string;

  // Tabs
  tabCalculator: string;
  tabScenarios: string;

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

  // First payment adjustment
  firstPaymentAdjustment: string;
  firstPeriodDays: string;
  firstPeriodDaysHint: string;
  enableFirstPaymentAdjustment: string;

  // Summary
  summaryTitle: string;
  monthlyPayment: string;
  firstPaymentLabel: string;
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

  // Scenario tab
  scenarioTitle: string;
  scenarioSubtitle: string;
  scenarioBaseLoan: string;
  scenarioExtraPayments: string;
  scenarioRateChanges: string;
  scenarioResults: string;

  // Extra payments
  addExtraPayment: string;
  extraPaymentAmount: string;
  extraPaymentFrequency: string;
  extraPaymentOneTime: string;
  extraPaymentMonthly: string;
  extraPaymentYearly: string;
  extraPaymentStartAt: string;
  extraPaymentEndAt: string;
  extraPaymentEffect: string;
  extraPaymentReduceTerm: string;
  extraPaymentReducePayment: string;
  extraPaymentRemove: string;
  paymentNumberLabel: string;
  optionalLabel: string;

  // Rate changes
  addRateChange: string;
  newRate: string;
  rateChangeAtPayment: string;
  rateChangeRemove: string;

  // Scenario results
  scenarioComparison: string;
  originalLabel: string;
  scenarioLabel: string;
  differenceLabel: string;
  interestSaved: string;
  paymentsSaved: string;
  totalExtraPaymentsMade: string;
  monthsLabel: string;
  newMonthlyPayment: string;
  scenarioSchedule: string;
  scheduleExtraPayment: string;
  scheduleRate: string;

  // Start date
  startYear: string;
  startMonth: string;

  // Calculate
  calculateScenario: string;
  noEventsHint: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Mortgage Calculator',
    appSubtitle: 'Calculate your mortgage payments with detailed amortization schedule',

    tabCalculator: 'Calculator',
    tabScenarios: 'Scenarios',

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

    firstPaymentAdjustment: 'First Payment Adjustment',
    firstPeriodDays: 'Days in first period',
    firstPeriodDaysHint: 'Number of days from loan disbursement to first payment (e.g., 45 if disbursed mid-month)',
    enableFirstPaymentAdjustment: 'Adjust first payment',

    summaryTitle: 'Summary',
    monthlyPayment: 'Monthly Payment',
    firstPaymentLabel: 'First payment',
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

    scenarioTitle: 'What-If Scenarios',
    scenarioSubtitle: 'See how extra payments and rate changes affect your mortgage',
    scenarioBaseLoan: 'Base Loan Parameters',
    scenarioExtraPayments: 'Extra Payments',
    scenarioRateChanges: 'Rate Changes',
    scenarioResults: 'Scenario Results',

    addExtraPayment: 'Add extra payment',
    extraPaymentAmount: 'Amount',
    extraPaymentFrequency: 'Frequency',
    extraPaymentOneTime: 'One-time',
    extraPaymentMonthly: 'Monthly',
    extraPaymentYearly: 'Yearly',
    extraPaymentStartAt: 'Start at payment #',
    extraPaymentEndAt: 'End at payment #',
    extraPaymentEffect: 'Effect',
    extraPaymentReduceTerm: 'Reduce term',
    extraPaymentReducePayment: 'Reduce payment',
    extraPaymentRemove: 'Remove',
    paymentNumberLabel: 'payment #',
    optionalLabel: 'optional',

    addRateChange: 'Add rate change',
    newRate: 'New rate',
    rateChangeAtPayment: 'At payment #',
    rateChangeRemove: 'Remove',

    scenarioComparison: 'Comparison',
    originalLabel: 'Original',
    scenarioLabel: 'With changes',
    differenceLabel: 'Difference',
    interestSaved: 'Interest saved',
    paymentsSaved: 'Payments saved',
    totalExtraPaymentsMade: 'Total extra payments',
    monthsLabel: 'months',
    newMonthlyPayment: 'New monthly payment',
    scenarioSchedule: 'Modified Schedule',
    scheduleExtraPayment: 'Extra',
    scheduleRate: 'Rate',

    startYear: 'Start year',
    startMonth: 'Start month',

    calculateScenario: 'Calculate scenario',
    noEventsHint: 'Add extra payments or rate changes to see the impact on your mortgage.',
  },

  pl: {
    appTitle: 'Kalkulator kredytu hipotecznego',
    appSubtitle: 'Oblicz raty kredytu i zobacz szczegółowy harmonogram spłat',

    tabCalculator: 'Kalkulator',
    tabScenarios: 'Scenariusze',

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

    firstPaymentAdjustment: 'Korekta pierwszej raty',
    firstPeriodDays: 'Dni w pierwszym okresie',
    firstPeriodDaysHint: 'Liczba dni od wypłaty kredytu do pierwszej raty (np. 45, jeśli wypłata w połowie miesiąca)',
    enableFirstPaymentAdjustment: 'Koryguj pierwszą ratę',

    summaryTitle: 'Podsumowanie',
    monthlyPayment: 'Rata miesięczna',
    firstPaymentLabel: 'Pierwsza rata',
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

    scenarioTitle: 'Scenariusze "co jeśli"',
    scenarioSubtitle: 'Sprawdź jak nadpłaty i zmiany oprocentowania wpłyną na Twój kredyt',
    scenarioBaseLoan: 'Podstawowe parametry kredytu',
    scenarioExtraPayments: 'Nadpłaty',
    scenarioRateChanges: 'Zmiany oprocentowania',
    scenarioResults: 'Wyniki scenariusza',

    addExtraPayment: 'Dodaj nadpłatę',
    extraPaymentAmount: 'Kwota',
    extraPaymentFrequency: 'Częstotliwość',
    extraPaymentOneTime: 'Jednorazowa',
    extraPaymentMonthly: 'Co miesiąc',
    extraPaymentYearly: 'Co rok',
    extraPaymentStartAt: 'Od raty #',
    extraPaymentEndAt: 'Do raty #',
    extraPaymentEffect: 'Efekt',
    extraPaymentReduceTerm: 'Skróć okres',
    extraPaymentReducePayment: 'Zmniejsz ratę',
    extraPaymentRemove: 'Usuń',
    paymentNumberLabel: 'rata #',
    optionalLabel: 'opcjonalnie',

    addRateChange: 'Dodaj zmianę oprocentowania',
    newRate: 'Nowa stawka',
    rateChangeAtPayment: 'Od raty #',
    rateChangeRemove: 'Usuń',

    scenarioComparison: 'Porównanie',
    originalLabel: 'Oryginał',
    scenarioLabel: 'Ze zmianami',
    differenceLabel: 'Różnica',
    interestSaved: 'Zaoszczędzone odsetki',
    paymentsSaved: 'Zaoszczędzone raty',
    totalExtraPaymentsMade: 'Suma nadpłat',
    monthsLabel: 'mies.',
    newMonthlyPayment: 'Nowa rata miesięczna',
    scenarioSchedule: 'Zmodyfikowany harmonogram',
    scheduleExtraPayment: 'Nadpłata',
    scheduleRate: 'Stawka',

    startYear: 'Rok początkowy',
    startMonth: 'Miesiąc początkowy',

    calculateScenario: 'Oblicz scenariusz',
    noEventsHint: 'Dodaj nadpłaty lub zmiany oprocentowania, aby zobaczyć wpływ na kredyt.',
  },

  ru: {
    appTitle: 'Ипотечный калькулятор',
    appSubtitle: 'Рассчитайте ежемесячные платежи и просмотрите график погашения',

    tabCalculator: 'Калькулятор',
    tabScenarios: 'Сценарии',

    formTitle: 'Параметры кредита',
    propertyPrice: 'Стоимость недвижимости',
    downPayment: 'Первоначальный взнос',
    loanAmount: 'Сумма кредита',
    loanTerm: 'Срок кредита',
    loanTermYears: 'лет',
    annualInterestRate: 'Годовая процентная ставка',
    paymentType: 'Тип платежей',
    annuity: 'Аннуитетные',
    differentiated: 'Дифференц.',
    annuityDescription: 'Фиксированный платёж на весь срок кредита',
    differentiatedDescription: 'Дифференцированные: фикс. часть долга, убывающие проценты',
    interestCalculation: 'Начисление процентов',
    monthly: 'Ежемесячное',
    daily: 'Ежедневное',
    dayCountConvention: 'Конвенция дней в году',
    days: 'дней',
    dayCount365Description: 'Фактическое число дней в месяце, 365 дней/год',
    dayCount360Description: '30 дней в месяце, 360 дней/год',

    firstPaymentAdjustment: 'Корректировка первого платежа',
    firstPeriodDays: 'Дней в первом периоде',
    firstPeriodDaysHint: 'Кол-во дней от выдачи кредита до первого платежа (напр. 45, если выдача в середине месяца)',
    enableFirstPaymentAdjustment: 'Корректировать первый платёж',

    summaryTitle: 'Итого',
    monthlyPayment: 'Ежемесячный платёж',
    firstPaymentLabel: 'Первый платёж',
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

    scenarioTitle: 'Сценарии "что если"',
    scenarioSubtitle: 'Посмотрите, как досрочные платежи и изменение ставки повлияют на ипотеку',
    scenarioBaseLoan: 'Базовые параметры кредита',
    scenarioExtraPayments: 'Досрочные платежи',
    scenarioRateChanges: 'Изменения ставки',
    scenarioResults: 'Результаты сценария',

    addExtraPayment: 'Добавить досрочный платёж',
    extraPaymentAmount: 'Сумма',
    extraPaymentFrequency: 'Периодичность',
    extraPaymentOneTime: 'Разовый',
    extraPaymentMonthly: 'Ежемесячно',
    extraPaymentYearly: 'Ежегодно',
    extraPaymentStartAt: 'С платежа №',
    extraPaymentEndAt: 'До платежа №',
    extraPaymentEffect: 'Результат',
    extraPaymentReduceTerm: 'Сократить срок',
    extraPaymentReducePayment: 'Уменьшить платёж',
    extraPaymentRemove: 'Удалить',
    paymentNumberLabel: 'платёж №',
    optionalLabel: 'необязательно',

    addRateChange: 'Добавить изменение ставки',
    newRate: 'Новая ставка',
    rateChangeAtPayment: 'С платежа №',
    rateChangeRemove: 'Удалить',

    scenarioComparison: 'Сравнение',
    originalLabel: 'Оригинал',
    scenarioLabel: 'С изменениями',
    differenceLabel: 'Разница',
    interestSaved: 'Экономия на процентах',
    paymentsSaved: 'Сэкономлено платежей',
    totalExtraPaymentsMade: 'Всего досрочных платежей',
    monthsLabel: 'мес.',
    newMonthlyPayment: 'Новый ежемесячный платёж',
    scenarioSchedule: 'Изменённый график',
    scheduleExtraPayment: 'Доп.',
    scheduleRate: 'Ставка',

    startYear: 'Год начала',
    startMonth: 'Месяц начала',

    calculateScenario: 'Рассчитать сценарий',
    noEventsHint: 'Добавьте досрочные платежи или изменения ставки, чтобы увидеть их влияние.',
  },
};
