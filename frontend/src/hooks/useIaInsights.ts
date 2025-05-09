// src/hooks/useIaInsights.ts
import { useState, useCallback, useEffect } from "react";
import { iaApi } from "../api";
import {
  Insight,
  InsightFilters,
  RecomendacaoTransacao,
  PrevisaoGastos,
  SaudeFinanceira,
  TipoInsight,
} from "../types/ia";

export function useIaInsights(filtrosIniciais: InsightFilters = {}) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [insightAtual, setInsightAtual] = useState<Insight | null>(null);
  const [recomendacao, setRecomendacao] =
    useState<RecomendacaoTransacao | null>(null);
  const [previsaoGastos, setPrevisaoGastos] = useState<PrevisaoGastos | null>(
    null
  );
  const [saudeFinanceira, setSaudeFinanceira] =
    useState<SaudeFinanceira | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<InsightFilters>(filtrosIniciais);

  // Buscar insights quando os filtros mudarem
  useEffect(() => {
    buscarInsights();
  }, [filtros]);

  // Buscar insights
  const buscarInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await iaApi.listarInsights(filtros);
      setInsights(data);
    } catch (error: any) {
      setError(error.message || "Erro ao buscar insights");
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  // Gerar novos insights
  const gerarInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await iaApi.gerarInsights();
      setInsights((prevInsights) => {
        // Mesclar novos insights com os existentes
        const novoInsights = response.insights || [];
        const todos = [...novoInsights, ...prevInsights];

        // Remover duplicatas baseadas no ID
        const insightsMap = new Map();
        todos.forEach((insight) => {
          insightsMap.set(insight.id, insight);
        });

        return Array.from(insightsMap.values());
      });
      return response;
    } catch (error: any) {
      setError(error.message || "Erro ao gerar novos insights");
      return { insights: [], count: 0 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar insight por ID
  const buscarInsightPorId = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);

    try {
      const insight = await iaApi.obterInsightPorId(id);
      setInsightAtual(insight);
      return insight;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar insight");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar insights por categoria
  const buscarInsightsPorCategoria = useCallback(
    async (categoriaId: number | string, limite: number = 5) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await iaApi.obterInsightsPorCategoria(categoriaId, limite);
        return data;
      } catch (error: any) {
        setError(error.message || "Erro ao buscar insights por categoria");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter recomendação para transação
  const obterRecomendacaoTransacao = useCallback(
    async (transacao: {
      description: string;
      amount: number;
      categoryId: number;
      date?: string;
      isExpense?: boolean;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await iaApi.obterRecomendacaoTransacao(transacao);
        setRecomendacao(data);
        return data;
      } catch (error: any) {
        setError(error.message || "Erro ao obter recomendação para transação");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter previsão de gastos
  const obterPrevisaoGastos = useCallback(async (meses: number = 3) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await iaApi.obterPrevisaoGastos(meses);
      setPrevisaoGastos(data);
      return data;
    } catch (error: any) {
      setError(error.message || "Erro ao obter previsão de gastos");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obter saúde financeira
  const obterSaudeFinanceira = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await iaApi.obterSaudeFinanceira();
      setSaudeFinanceira(data);
      return data;
    } catch (error: any) {
      setError(error.message || "Erro ao obter análise de saúde financeira");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtrar insights por tipo
  const filtrarPorTipo = useCallback(async (tipo: TipoInsight) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await iaApi.filtrarInsightsPorTipo(tipo);
      return data;
    } catch (error: any) {
      setError(error.message || `Erro ao filtrar insights por tipo ${tipo}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obter insights relevantes
  const obterInsightsRelevantes = useCallback(
    async (pontuacaoMinima: number = 7) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await iaApi.obterInsightsRelevantes(pontuacaoMinima);
        return data;
      } catch (error: any) {
        setError(error.message || "Erro ao obter insights relevantes");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Atualizar filtros
  const atualizarFiltros = useCallback(
    (novosFiltros: Partial<InsightFilters>) => {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        ...novosFiltros,
      }));
    },
    []
  );

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    insights,
    insightAtual,
    recomendacao,
    previsaoGastos,
    saudeFinanceira,
    isLoading,
    error,
    filtros,
    buscarInsights,
    gerarInsights,
    buscarInsightPorId,
    buscarInsightsPorCategoria,
    obterRecomendacaoTransacao,
    obterPrevisaoGastos,
    obterSaudeFinanceira,
    filtrarPorTipo,
    obterInsightsRelevantes,
    atualizarFiltros,
    limparErro,
    setInsightAtual,
  };
}
