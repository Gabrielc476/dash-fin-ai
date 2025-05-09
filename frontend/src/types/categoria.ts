// src/types/categoria.ts

export interface Categoria {
  id: number;
  name: string;
  color: string;
  icon?: string;
  isExpense: boolean;
  isDefault: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriaCreate {
  name: string;
  color: string;
  icon?: string;
  isExpense: boolean;
  isDefault?: boolean;
}

export interface CategoriaUpdate {
  name?: string;
  color?: string;
  icon?: string;
  isExpense?: boolean;
  isDefault?: boolean;
}

export interface CategoriaFilters {
  onlyExpense?: boolean;
  onlyIncome?: boolean;
}
