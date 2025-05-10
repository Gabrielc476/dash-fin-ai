// frontend/src/api/transacoes.ts
import api from "./cliente";
import { ROTAS } from "../constants/rotas";
import {
  Transacao,
  TransacaoCriar,
  TransacaoAtualizar,
  TransacaoFiltros,
  ResumoCategoria,
  ResumoMensal,
} from "../types/transacao";

export const transacoesApi = {
  /**
   * Lista transações com filtros opcionais
   * @param filtros Filtros para a listagem
   * @returns Lista de transações
   */
  async listar(filtros: any = {}): Promise<Transacao[]> {
    const { data } = await api.get<Transacao[]>(ROTAS.API.TRANSACOES.BASE, {
      params: filtros,
    });

    return data;
  },

  /**
   * Obtém uma transação por ID
   * @param id ID da transação
   * @returns Detalhes da transação
   */
  async obterPorId(id: number | string): Promise<Transacao> {
    const { data } = await api.get<Transacao>(ROTAS.API.TRANSACOES.POR_ID(id));
    return data;
  },

  /**
   * Cria uma nova transação
   * @param transacao Dados da nova transação
   * @returns Transação criada
   */
  async criar(transacao: TransacaoCriar): Promise<Transacao> {
    const { data } = await api.post<Transacao>(
      ROTAS.API.TRANSACOES.BASE,
      transacao
    );
    return data;
  },

  /**
   * Atualiza uma transação existente
   * @param id ID da transação
   * @param transacao Dados para atualização
   * @returns Transação atualizada
   */
  async atualizar(
    id: number | string,
    transacao: TransacaoAtualizar
  ): Promise<Transacao> {
    const { data } = await api.put<Transacao>(
      ROTAS.API.TRANSACOES.POR_ID(id),
      transacao
    );
    return data;
  },

  /**
   * Remove uma transação
   * @param id ID da transação
   * @returns void
   */
  async remover(id: number | string): Promise<void> {
    await api.delete(ROTAS.API.TRANSACOES.POR_ID(id));
  },

  /**
   * Obtém resumo de gastos por categoria em um período
   * @param dataInicial Data inicial do período
   * @param dataFinal Data final do período
   * @returns Resumo de gastos por categoria
   */
  async obterResumoPorCategoria(
    dataInicial: string,
    dataFinal: string
  ): Promise<ResumoCategoria[]> {
    const { data } = await api.get<ResumoCategoria[]>(
      ROTAS.API.TRANSACOES.RESUMO_CATEGORIAS,
      {
        params: {
          startDate: dataInicial,
          endDate: dataFinal,
        },
      }
    );

    return data;
  },

  /**
   * Obtém resumo mensal de receitas e despesas
   * @param dataInicial Data inicial do período
   * @param dataFinal Data final do período
   * @returns Resumo mensal
   */
  async obterResumoMensal(
    dataInicial: string,
    dataFinal: string
  ): Promise<ResumoMensal[]> {
    const { data } = await api.get<ResumoMensal[]>(
      ROTAS.API.TRANSACOES.RESUMO_MENSAL,
      {
        params: {
          startDate: dataInicial,
          endDate: dataFinal,
        },
      }
    );

    return data;
  },
};
