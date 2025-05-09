// src/types/ia.ts

export enum TipoInsight {
  PADRAO_GASTO = "padrao_gasto",
  OPORTUNIDADE_ECONOMIA = "oportunidade_economia",
  DETECCAO_ANOMALIA = "deteccao_anomalia",
  RECOMENDACAO_ORCAMENTO = "recomendacao_orcamento",
  TENDENCIA = "tendencia",
  INFORMATIVO = "informativo",
}

export interface Insight {
  id: number;
  type: TipoInsight;
  title: string;
  description: string;
  impactValue?: number;
  relevanceScore: number;
  userId: number;
  createdAt: string;
  categories?: { id: number; name: string }[];
}

export interface InsightFilters {
  limit?: number;
  offset?: number;
  type?: TipoInsight;
  minRelevance?: number;
}

export interface RecomendacaoTransacao {
  titulo: string;
  recomendacao: string;
  dica_economia: string | null;
  pontuacao_relevancia: number;
}

export interface PrevisaoGastos {
  previsao: {
    mes: string;
    categorias: Record<string, number>;
    total: number;
  }[];
  explicacao: string;
}

export interface SaudeFinanceira {
  pontuacao_saude: number;
  avaliacoes: {
    area: string;
    pontuacao: number;
    analise: string;
    recomendacoes: string[];
  }[];
  resumo: string;
  acoes_recomendadas: string[];
}
