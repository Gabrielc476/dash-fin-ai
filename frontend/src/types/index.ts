// src/types/index.ts

// Exportar todos os tipos para facilitar a importação
export * from "./auth";
export * from "./categoria";
export * from "./transacao";
export * from "./orcamento";
export * from "./relatorio";
export * from "./ia";

// Tipos comuns para as APIs
export interface ApiResponse<T> {
  data?: T;
  status: "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
