// src/types/orcamento.ts

import { Categoria } from "./categoria";

export enum TipoRecorrencia {
  NONE = "NONE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMIANNUALLY = "SEMIANNUALLY",
  ANNUALLY = "ANNUALLY",
}

export interface Orcamento {
  id: number;
  name: string;
  amount: number;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  recurrence?: TipoRecorrencia;
  userId: number;
  createdAt: string;
  updatedAt: string;
  categories?: Categoria[];
}

export interface OrcamentoCriar {
  name: string;
  amount: number;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  recurrence?: TipoRecorrencia;
  categoryIds: number[];
}

export interface OrcamentoAtualizar {
  name?: string;
  amount?: number;
  startDate?: string; // ISO string format
  endDate?: string; // ISO string format
  recurrence?: TipoRecorrencia;
  categoryIds?: number[];
}

export interface OrcamentoFiltros {
  active?: boolean;
  pular?: number;
  limite?: number;
}

export interface OrcamentoProgresso {
  budget: {
    id: number;
    name: string;
    amount: number;
    startDate: string;
    endDate: string;
    recurrence?: TipoRecorrencia;
    categories: Categoria[];
  };
  progress: {
    spent: number;
    remaining: number;
    percentage: number;
    isOverBudget: boolean;
  };
}
