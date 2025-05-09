// src/types/enums.ts

// Enumeração para tipos de transação
export enum TransactionType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}

// Enumeração para métodos de pagamento
export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
  PIX = "PIX",
  DIGITAL_WALLET = "DIGITAL_WALLET",
  OTHER = "OTHER",
}

// Enumeração para tipos de recorrência de orçamentos
export enum BudgetRecurrence {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMIANNUALLY = "SEMIANNUALLY",
  ANNUALLY = "ANNUALLY",
}

// Enumeração para tipos de insights
export enum InsightType {
  SPENDING_PATTERN = "SPENDING_PATTERN",
  SAVING_OPPORTUNITY = "SAVING_OPPORTUNITY",
  ANOMALY_DETECTION = "ANOMALY_DETECTION",
  BUDGET_RECOMMENDATION = "BUDGET_RECOMMENDATION",
  TREND = "TREND",
}

// Enumeração para agrupamento em relatórios
export enum ReportGroupBy {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
  CATEGORY = "CATEGORY",
}

// Enumeração para status de resposta da API
export enum ApiStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
}

// Enumeração para tipos de exportação de relatórios
export enum ExportFormat {
  PDF = "PDF",
  CSV = "CSV",
  EXCEL = "EXCEL",
  JSON = "JSON",
}
