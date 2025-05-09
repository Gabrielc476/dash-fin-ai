// src/types/report.d.ts
import { ExportFormat, ReportGroupBy } from "./enums";

// Interface para relatório de receitas vs despesas
export interface IncomeExpenseReport {
  startDate: Date;
  endDate: Date;
  groupBy: string;
  data: IncomeExpensePeriod[];
  summary: {
    totalExpenses: number;
    totalIncomes: number;
    totalBalance: number;
  };
}

export interface IncomeExpensePeriod {
  period: string;
  expenses: number;
  incomes: number;
  balance: number;
}

// Interface para relatório por categoria
export interface CategoryReport {
  startDate: Date;
  endDate: Date;
  data: CategorySummary[];
  totalExpenses: number;
}

export interface CategorySummary {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIcon?: string;
  total: number;
  count: number;
  percentage: number;
}

// Interface para tendências
export interface TrendReport {
  period: {
    startDate: Date;
    endDate: Date;
    months: number;
  };
  monthlySummary: MonthlySummary[];
  averages: {
    expenses: number;
    incomes: number;
    savings: number;
  };
  trends: {
    expenses: TrendInfo;
    incomes: TrendInfo;
  };
  categories: CategoryTrend[];
}

export interface MonthlySummary {
  period: string;
  expenses: number;
  incomes: number;
  total_transactions: number;
}

export interface TrendInfo {
  trend: number; // Valor entre -1 e 1
  direction: "upward" | "downward" | "stable";
}

export interface CategoryTrend {
  categoryId: number;
  categoryName: string;
  currentValue: number;
  previousValue: number;
  percentChange: number;
  direction: "up" | "down" | "stable";
}

// Interface para exportação
export interface ExportResult {
  data: Buffer | Uint8Array | string;
  contentType: string;
  filename: string;
}

// Interface para parâmetros de relatório
export interface ReportParams {
  startDate: Date;
  endDate: Date;
  categoryIds?: number[];
  groupBy?: ReportGroupBy;
  includeExpenses?: boolean;
  includeIncomes?: boolean;
  format?: ExportFormat;
}
