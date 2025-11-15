export interface ChartDataPoint {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface Financials {
  totalIncome: number;
  incomeChange: number | null;
  totalExpenses: number;
  expensesChange: number | null;
  netProfit: number;
  netProfitChange: number | null;
  taxes: number;
  chartData: ChartDataPoint[];
}
