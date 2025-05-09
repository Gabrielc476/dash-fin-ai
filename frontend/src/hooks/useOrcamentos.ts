// src/hooks/useOrcamentos.ts
import { useState, useCallback, useEffect } from "react";
import { orcamentosApi } from "../api";
import {
  Orcamento,
  OrcamentoCriar,
  OrcamentoAtualizar,
  OrcamentoFiltros,
  OrcamentoProgresso,
} from "../types/orcamento";

export function useOrcamentos(filtrosIniciais: OrcamentoFiltros = {}) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [orcamentoAtual, setOrcamentoAtual] = useState<Orcamento | null>(null);
  const [progressoAtual, setProgressoAtual] =
    useState<OrcamentoProgresso | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<OrcamentoFiltros>(filtrosIniciais);

  // Buscar orçamentos quando os filtros mudarem
  useEffect(() => {
    buscarOrcamentos();
  }, [filtros]);

  // Buscar orçamentos
  const buscarOrcamentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await orcamentosApi.listar(filtros);
      setOrcamentos(data);
    } catch (error: any) {
      setError(error.message || "Erro ao buscar orçamentos");
    } finally {
      setIsLoading(false);
    }
  }, [filtros]);

  // Buscar orçamento por ID
  const buscarOrcamentoPorId = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);

    try {
      const orcamento = await orcamentosApi.obterPorId(id);
      setOrcamentoAtual(orcamento);
      return orcamento;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar orçamento");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar orçamento
  const criarOrcamento = useCallback(async (orcamento: OrcamentoCriar) => {
    setIsLoading(true);
    setError(null);

    try {
      const novoOrcamento = await orcamentosApi.criar(orcamento);
      setOrcamentos((prev) => [...prev, novoOrcamento]);
      return novoOrcamento;
    } catch (error: any) {
      setError(error.message || "Erro ao criar orçamento");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar orçamento
  const atualizarOrcamento = useCallback(
    async (id: number | string, orcamento: OrcamentoAtualizar) => {
      setIsLoading(true);
      setError(null);

      try {
        const orcamentoAtualizado = await orcamentosApi.atualizar(
          id,
          orcamento
        );
        setOrcamentos((prev) =>
          prev.map((item) =>
            item.id === Number(id) ? orcamentoAtualizado : item
          )
        );
        if (orcamentoAtual && orcamentoAtual.id === Number(id)) {
          setOrcamentoAtual(orcamentoAtualizado);
        }
        return orcamentoAtualizado;
      } catch (error: any) {
        setError(error.message || "Erro ao atualizar orçamento");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [orcamentoAtual]
  );

  // Remover orçamento
  const removerOrcamento = useCallback(
    async (id: number | string) => {
      setIsLoading(true);
      setError(null);

      try {
        await orcamentosApi.remover(id);
        setOrcamentos((prev) => prev.filter((item) => item.id !== Number(id)));
        if (orcamentoAtual && orcamentoAtual.id === Number(id)) {
          setOrcamentoAtual(null);
        }
        return true;
      } catch (error: any) {
        setError(error.message || "Erro ao remover orçamento");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [orcamentoAtual]
  );

  // Buscar orçamentos ativos
  const buscarOrcamentosAtivos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await orcamentosApi.listarAtivos();
      return data;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar orçamentos ativos");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar progresso de um orçamento
  const buscarProgressoOrcamento = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);

    try {
      const progresso = await orcamentosApi.obterProgresso(id);
      setProgressoAtual(progresso);
      return progresso;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar progresso do orçamento");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar filtros
  const atualizarFiltros = useCallback(
    (novosFiltros: Partial<OrcamentoFiltros>) => {
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
    orcamentos,
    orcamentoAtual,
    progressoAtual,
    isLoading,
    error,
    filtros,
    buscarOrcamentos,
    buscarOrcamentoPorId,
    criarOrcamento,
    atualizarOrcamento,
    removerOrcamento,
    buscarOrcamentosAtivos,
    buscarProgressoOrcamento,
    atualizarFiltros,
    limparErro,
    setOrcamentoAtual,
  };
}
