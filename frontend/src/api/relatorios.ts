// src/api/relatorios.ts
import api from "./cliente";
import { ROTAS } from "../constants/rotas";
import {
  FormatoExportacao,
  TipoAgrupamento,
  ParametrosRelatorio,
  RelatorioReceitaDespesa,
  RelatorioCategoria,
  Tendencia,
} from "../types/relatorio";

export const relatoriosApi = {
  /**
   * Obtém relatório de receitas vs despesas
   * @param dataInicial Data inicial do período
   * @param dataFinal Data final do período
   * @param agrupamento Tipo de agrupamento (dia, semana, mês, etc.)
   * @returns Relatório de receitas e despesas
   */
  async obterRelatorioReceitaDespesa(
    dataInicial: string,
    dataFinal: string,
    agrupamento: TipoAgrupamento = TipoAgrupamento.MONTH
  ): Promise<RelatorioReceitaDespesa> {
    const { data } = await api.get<RelatorioReceitaDespesa>(
      ROTAS.API.RELATORIOS.RECEITA_DESPESA,
      {
        params: {
          startDate: dataInicial,
          endDate: dataFinal,
          groupBy: agrupamento,
        },
      }
    );

    return data;
  },

  /**
   * Obtém relatório por categoria
   * @param dataInicial Data inicial do período
   * @param dataFinal Data final do período
   * @param categoriaIds IDs das categorias (opcional)
   * @returns Relatório por categoria
   */
  async obterRelatorioCategoria(
    dataInicial: string,
    dataFinal: string,
    categoriaIds?: number[]
  ): Promise<RelatorioCategoria> {
    const { data } = await api.get<RelatorioCategoria>(
      ROTAS.API.RELATORIOS.CATEGORIA,
      {
        params: {
          startDate: dataInicial,
          endDate: dataFinal,
          categoryIds: categoriaIds ? categoriaIds.join(",") : undefined,
        },
      }
    );

    return data;
  },

  /**
   * Obtém URL para exportação de dados
   * @param parametros Parâmetros para exportação
   * @returns URL para download do arquivo
   */
  obterUrlExportacao(parametros: {
    startDate: string;
    endDate: string;
    format: FormatoExportacao;
  }): string {
    const queryParams = new URLSearchParams();
    queryParams.append("startDate", parametros.startDate);
    queryParams.append("endDate", parametros.endDate);
    queryParams.append("format", parametros.format);

    // Obter baseURL dinamicamente da configuração da API
    const baseURL = api.defaults.baseURL || "";

    return `${baseURL}${
      ROTAS.API.RELATORIOS.EXPORTAR
    }?${queryParams.toString()}`;
  },

  /**
   * Exporta dados em formato específico (para download do arquivo)
   * @param parametros Parâmetros para exportação
   * @returns Blob do arquivo para download
   */
  async exportarDados(parametros: {
    startDate: string;
    endDate: string;
    format: FormatoExportacao;
  }): Promise<Blob> {
    const { data } = await api.get<Blob>(ROTAS.API.RELATORIOS.EXPORTAR, {
      params: parametros,
      responseType: "blob",
    });

    return data;
  },

  /**
   * Obtém tendências financeiras
   * @param meses Quantidade de meses para análise
   * @returns Dados de tendências
   */
  async obterTendencias(meses: number = 6): Promise<Tendencia> {
    const { data } = await api.get<Tendencia>(ROTAS.API.RELATORIOS.TENDENCIAS, {
      params: {
        months: meses,
      },
    });

    return data;
  },
};
