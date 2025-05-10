// frontend/src/types/transacao.ts

import { Categoria } from "./categoria";

export interface Transacao {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO string format
  categoryId: number;
  userId: number;
  isExpense: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  category?: Categoria;
}

export interface TransacaoCriar {
  description: string;
  amount: number;
  date: string; // ISO string format
  categoryId: number;
  isExpense: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
}

export interface TransacaoAtualizar {
  description?: string;
  amount?: number;
  date?: string; // ISO string format
  categoryId?: number;
  isExpense?: boolean;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
}

export interface TransacaoFiltros {
  pular?: number;
  limite?: number;
  dataInicial?: string; // Para ser enviado como startDate
  dataFinal?: string; // Para ser enviado como endDate
}

export interface ResumoCategoria {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIcon?: string;
  total: number;
  count: number;
  percentage?: number;
}

export interface ResumoMensal {
  month: string;
  expenses: number;
  incomes: number;
}
