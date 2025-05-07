// src/types/models.d.ts

// Interfaces para User (Usuário)
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateDto {
  email: string;
  password: string;
  name: string;
}

export interface UserUpdateDto {
  name?: string;
  email?: string;
  password?: string;
  settings?: Record<string, any>;
}

// Interfaces para Category (Categoria)
export interface Category {
  id: number;
  name: string;
  color: string;
  icon?: string;
  isExpense: boolean;
  isDefault: boolean;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreateDto {
  name: string;
  color: string;
  icon?: string;
  isExpense: boolean;
  isDefault?: boolean;
}

export interface CategoryUpdateDto {
  name?: string;
  color?: string;
  icon?: string;
  isExpense?: boolean;
  isDefault?: boolean;
}

// Interfaces para Transaction (Transação)
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: Date;
  categoryId: number;
  userId: number;
  isExpense: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;

  // Propriedades de relacionamento (opcional)
  category?: Category;
}

export interface TransactionCreateDto {
  description: string;
  amount: number;
  date: Date;
  categoryId: number;
  isExpense: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
}

export interface TransactionUpdateDto {
  description?: string;
  amount?: number;
  date?: Date;
  categoryId?: number;
  isExpense?: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
}

// Interfaces para Budget (Orçamento)
export interface Budget {
  id: number;
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  recurrence?: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  // Propriedades de relacionamento (opcional)
  categories?: Category[];
}

export interface BudgetCreateDto {
  name: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  recurrence?: string;
  categoryIds: number[];
}

export interface BudgetUpdateDto {
  name?: string;
  amount?: number;
  startDate?: Date;
  endDate?: Date;
  recurrence?: string;
  categoryIds?: number[];
}

// Interfaces para Insight (Insights de IA)
export interface Insight {
  id: number;
  type: string;
  title: string;
  description: string;
  impactValue?: number;
  relevanceScore: number;
  userId: number;
  createdAt: Date;

  // Propriedades de relacionamento (opcional)
  categories?: Category[];
}

export interface InsightCreateDto {
  type: string;
  title: string;
  description: string;
  impactValue?: number;
  relevanceScore: number;
  categoryIds?: number[];
}

// Interface para relatórios
export interface ReportParams {
  startDate: Date;
  endDate: Date;
  categoryIds?: number[];
  groupBy?: string;
  includeExpenses?: boolean;
  includeIncomes?: boolean;
}

// Resposta de autenticação
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
