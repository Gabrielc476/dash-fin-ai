// frontend/src/hooks/useTransacoes.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { transacoesApi } from "../api";
import {
  Transacao,
  TransacaoCriar,
  TransacaoAtualizar,
  TransacaoFiltros,
  ResumoCategoria,
  ResumoMensal,
} from "../types/transacao";
import { formatarDataParaAPI } from "../utils/data";

export function useTransacoes(filtrosIniciais: TransacaoFiltros = {}) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [transacaoAtual, setTransacaoAtual] = useState<Transacao | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<TransacaoFiltros>(filtrosIniciais);
  const [resumoCategoria, setResumoCategoria] = useState<ResumoCategoria[]>([]);
  const [resumoMensal, setResumoMensal] = useState<ResumoMensal[]>([]);

  // Buscar transações quando os filtros mudarem
  useEffect(() => {
    buscarTransacoes(filtros);
  }, [filtros]);

  // Buscar transações
  const buscarTransacoes = useCallback(
    async (filtrosBusca: TransacaoFiltros = filtros) => {
      setIsLoading(true);
      setError(null);

      try {
        // Converter os filtros para o formato esperado pelo backend
        const parametros = {
          skip: filtrosBusca.pular,
          limit: filtrosBusca.limite,
          startDate: filtrosBusca.dataInicial,
          endDate: filtrosBusca.dataFinal,
        };

        // Remover parâmetros undefined
        Object.keys(parametros).forEach((key) => {
          if (parametros[key] === undefined) {
            delete parametros[key];
          }
        });

        const data = await transacoesApi.listar(parametros);
        setTransacoes(data);
      } catch (error: any) {
        setError(error.message || "Erro ao buscar transações");
      } finally {
        setIsLoading(false);
      }
    },
    [filtros]
  );

  // Buscar transação por ID
  const buscarTransacaoPorId = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);

    try {
      const transacao = await transacoesApi.obterPorId(id);
      setTransacaoAtual(transacao);
      return transacao;
    } catch (error: any) {
      setError(error.message || "Erro ao buscar transação");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar transação
  const criarTransacao = useCallback(async (transacao: TransacaoCriar) => {
    setIsLoading(true);
    setError(null);

    try {
      const novaTransacao = await transacoesApi.criar(transacao);
      setTransacoes((prev) => [novaTransacao, ...prev]);
      return novaTransacao;
    } catch (error: any) {
      setError(error.message || "Erro ao criar transação");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar transação
  const atualizarTransacao = useCallback(
    async (id: number | string, transacao: TransacaoAtualizar) => {
      setIsLoading(true);
      setError(null);

      try {
        const transacaoAtualizada = await transacoesApi.atualizar(
          id,
          transacao
        );
        setTransacoes((prev) =>
          prev.map((item) =>
            item.id === Number(id) ? transacaoAtualizada : item
          )
        );
        if (transacaoAtual && transacaoAtual.id === Number(id)) {
          setTransacaoAtual(transacaoAtualizada);
        }
        return transacaoAtualizada;
      } catch (error: any) {
        setError(error.message || "Erro ao atualizar transação");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [transacaoAtual]
  );

  // Remover transação
  const removerTransacao = useCallback(
    async (id: number | string) => {
      setIsLoading(true);
      setError(null);

      try {
        await transacoesApi.remover(id);
        setTransacoes((prev) => prev.filter((item) => item.id !== Number(id)));
        if (transacaoAtual && transacaoAtual.id === Number(id)) {
          setTransacaoAtual(null);
        }
        return true;
      } catch (error: any) {
        setError(error.message || "Erro ao remover transação");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [transacaoAtual]
  );

  // Buscar resumo por categoria
  const buscarResumoPorCategoria = useCallback(
    async (dataInicial: Date, dataFinal: Date) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataInicialFormatada = formatarDataParaAPI(dataInicial);
        const dataFinalFormatada = formatarDataParaAPI(dataFinal);

        const resumo = await transacoesApi.obterResumoPorCategoria(
          dataInicialFormatada,
          dataFinalFormatada
        );
        setResumoCategoria(resumo);
        return resumo;
      } catch (error: any) {
        setError(error.message || "Erro ao buscar resumo por categoria");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar resumo mensal
  const buscarResumoMensal = useCallback(
    async (dataInicial: Date, dataFinal: Date) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataInicialFormatada = formatarDataParaAPI(dataInicial);
        const dataFinalFormatada = formatarDataParaAPI(dataFinal);

        const resumo = await transacoesApi.obterResumoMensal(
          dataInicialFormatada,
          dataFinalFormatada
        );
        setResumoMensal(resumo);
        return resumo;
      } catch (error: any) {
        setError(error.message || "Erro ao buscar resumo mensal");
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Atualizar filtros
  const atualizarFiltros = useCallback(
    (novosFiltros: Partial<TransacaoFiltros>) => {
      setFiltros((prevFiltros) => ({
        ...prevFiltros,
        ...novosFiltros,
      }));
    },
    []
  );

  // Limpar filtros
  const limparFiltros = useCallback(() => {
    setFiltros({});
  }, []);

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    transacoes,
    transacaoAtual,
    isLoading,
    error,
    filtros,
    resumoCategoria,
    resumoMensal,
    buscarTransacoes,
    buscarTransacaoPorId,
    criarTransacao,
    atualizarTransacao,
    removerTransacao,
    buscarResumoPorCategoria,
    buscarResumoMensal,
    atualizarFiltros,
    limparFiltros,
    limparErro,
    setTransacaoAtual,
  };
}
