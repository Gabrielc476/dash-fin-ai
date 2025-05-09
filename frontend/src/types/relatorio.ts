// src/types/relatorio.ts

export enum TipoAgrupamento {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
  CATEGORY = "CATEGORY",
}

export enum FormatoExportacao {
  PDF = "PDF",
  CSV = "CSV",
  EXCEL = "EXCEL",
  JSON = "JSON",
}

export interface PeriodoRelatorio {
  startDate: string;
  endDate: string;
}

export interface RelatorioReceitaDespesa {
  startDate: string;
  endDate: string;
  groupBy: TipoAgrupamento;
  data: {
    period: string;
    expenses: number;
    incomes: number;
    balance: number;
  }[];
  summary: {
    totalExpenses: number;
    totalIncomes: number;
    totalBalance: number;
  };
}

export interface RelatorioCategoria {
  startDate: string;
  endDate: string;
  data: {
    categoryId: number;
    categoryName: string;
    categoryColor: string;
    categoryIcon?: string;
    total: number;
    count: number;
    percentage: number;
  }[];
  totalExpenses: number;
}

export interface ParametrosRelatorio {
  startDate: string;
  endDate: string;
  categoryIds?: number[];
  groupBy?: TipoAgrupamento;
  includeExpenses?: boolean;
  includeIncomes?: boolean;
  format?: FormatoExportacao;
}

export interface Tendencia {
  period: {
    startDate: string;
    endDate: string;
    months: number;
  };
  monthlySummary: {
    period: string;
    expenses: number;
    incomes: number;
    total_transactions: number;
  }[];
  averages: {
    expenses: number;
    incomes: number;
    savings: number;
  };
  trends: {
    expenses: {
      trend: number;
      direction: "upward" | "downward" | "stable";
    };
    incomes: {
      trend: number;
      direction: "upward" | "downward" | "stable";
    };
  };
  categories: {
    categoryId: number;
    categoryName: string;
    currentValue: number;
    previousValue: number;
    percentChange: number;
    direction: "up" | "down" | "stable";
  }[];
}
