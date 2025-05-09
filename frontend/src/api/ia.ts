// src/api/ia.ts
import api from "./cliente";
import { ROTAS } from "../constants/rotas";
import {
  Insight,
  InsightFilters,
  RecomendacaoTransacao,
  PrevisaoGastos,
  SaudeFinanceira,
  TipoInsight,
} from "../types/ia";

export const iaApi = {
  /**
   * Lista insights com filtros opcionais
   * @param filtros Filtros para a listagem
   * @returns Lista de insights
   */
  async listarInsights(filtros: InsightFilters = {}): Promise<Insight[]> {
    const { data } = await api.get<Insight[]>(ROTAS.API.IA.INSIGHTS, {
      params: filtros,
    });

    return data;
  },

  /**
   * Gera novos insights usando IA
   * @returns Lista de insights gerados
   */
  async gerarInsights(): Promise<{ insights: Insight[]; count: number }> {
    const { data } = await api.post<{
      insights: Insight[];
      count: number;
      message: string;
    }>(ROTAS.API.IA.GERAR_INSIGHTS);
    return data;
  },

  /**
   * Obtém um insight por ID
   * @param id ID do insight
   * @returns Detalhes do insight
   */
  async obterInsightPorId(id: number | string): Promise<Insight> {
    const { data } = await api.get<Insight>(ROTAS.API.IA.INSIGHTS_POR_ID(id));
    return data;
  },

  /**
   * Obtém insights relacionados a uma categoria
   * @param categoriaId ID da categoria
   * @param limite Limite de resultados
   * @returns Lista de insights relacionados à categoria
   */
  async obterInsightsPorCategoria(
    categoriaId: number | string,
    limite: number = 5
  ): Promise<Insight[]> {
    const { data } = await api.get<Insight[]>(
      ROTAS.API.IA.INSIGHTS_POR_CATEGORIA(categoriaId),
      {
        params: {
          limit: limite,
        },
      }
    );

    return data;
  },

  /**
   * Obtém recomendação para uma transação
   * @param transacao Dados da transação para análise
   * @returns Recomendação personalizada
   */
  async obterRecomendacaoTransacao(transacao: {
    description: string;
    amount: number;
    categoryId: number;
    date?: string;
    isExpense?: boolean;
  }): Promise<RecomendacaoTransacao> {
    const { data } = await api.post<RecomendacaoTransacao>(
      ROTAS.API.IA.RECOMENDACAO_TRANSACAO,
      transacao
    );
    return data;
  },

  /**
   * Obtém previsão de gastos futuros
   * @param meses Quantidade de meses para previsão
   * @returns Previsão de gastos por mês e categoria
   */
  async obterPrevisaoGastos(meses: number = 3): Promise<PrevisaoGastos> {
    const { data } = await api.get<PrevisaoGastos>(ROTAS.API.IA.PREVISAO, {
      params: {
        months: meses,
      },
    });

    return data;
  },

  /**
   * Obtém análise de saúde financeira
   * @returns Análise completa de saúde financeira
   */
  async obterSaudeFinanceira(): Promise<SaudeFinanceira> {
    const { data } = await api.get<SaudeFinanceira>(
      ROTAS.API.IA.SAUDE_FINANCEIRA
    );
    return data;
  },

  /**
   * Filtra insights por tipo
   * @param tipo Tipo de insight para filtrar
   * @returns Lista de insights do tipo especificado
   */
  async filtrarInsightsPorTipo(tipo: TipoInsight): Promise<Insight[]> {
    return this.listarInsights({ type: tipo });
  },

  /**
   * Obtém insights com alta relevância
   * @param pontuacaoMinima Pontuação mínima de relevância (0-10)
   * @returns Lista de insights relevantes
   */
  async obterInsightsRelevantes(
    pontuacaoMinima: number = 7
  ): Promise<Insight[]> {
    return this.listarInsights({ minRelevance: pontuacaoMinima });
  },
};
