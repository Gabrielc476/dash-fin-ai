// src/api/orcamentos.ts
import api from "./cliente";
import { ROTAS } from "../constants/rotas";
import {
  Orcamento,
  OrcamentoCriar,
  OrcamentoAtualizar,
  OrcamentoFiltros,
  OrcamentoProgresso,
} from "../types/orcamento";

export const orcamentosApi = {
  /**
   * Lista orçamentos com filtros opcionais
   * @param filtros Filtros para a listagem
   * @returns Lista de orçamentos
   */
  async listar(filtros: OrcamentoFiltros = {}): Promise<Orcamento[]> {
    const { data } = await api.get<Orcamento[]>(ROTAS.API.ORCAMENTOS.BASE, {
      params: filtros,
    });

    return data;
  },

  /**
   * Obtém um orçamento por ID
   * @param id ID do orçamento
   * @returns Detalhes do orçamento
   */
  async obterPorId(id: number | string): Promise<Orcamento> {
    const { data } = await api.get<Orcamento>(ROTAS.API.ORCAMENTOS.POR_ID(id));
    return data;
  },

  /**
   * Cria um novo orçamento
   * @param orcamento Dados do novo orçamento
   * @returns Orçamento criado
   */
  async criar(orcamento: OrcamentoCriar): Promise<Orcamento> {
    const { data } = await api.post<Orcamento>(
      ROTAS.API.ORCAMENTOS.BASE,
      orcamento
    );
    return data;
  },

  /**
   * Atualiza um orçamento existente
   * @param id ID do orçamento
   * @param orcamento Dados para atualização
   * @returns Orçamento atualizado
   */
  async atualizar(
    id: number | string,
    orcamento: OrcamentoAtualizar
  ): Promise<Orcamento> {
    const { data } = await api.put<Orcamento>(
      ROTAS.API.ORCAMENTOS.POR_ID(id),
      orcamento
    );
    return data;
  },

  /**
   * Remove um orçamento
   * @param id ID do orçamento
   * @returns void
   */
  async remover(id: number | string): Promise<void> {
    await api.delete(ROTAS.API.ORCAMENTOS.POR_ID(id));
  },

  /**
   * Obtém orçamentos ativos
   * @returns Lista de orçamentos ativos
   */
  async listarAtivos(): Promise<Orcamento[]> {
    return this.listar({ active: true });
  },

  /**
   * Obtém o progresso de um orçamento
   * @param id ID do orçamento
   * @returns Detalhes do progresso do orçamento
   */
  async obterProgresso(id: number | string): Promise<OrcamentoProgresso> {
    const { data } = await api.get<OrcamentoProgresso>(
      ROTAS.API.ORCAMENTOS.PROGRESSO(id)
    );
    return data;
  },
};
