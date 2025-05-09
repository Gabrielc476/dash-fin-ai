// src/hooks/useRelatorios.ts
import { useState, useCallback } from "react";
import { relatoriosApi } from "../api";
import {
  TipoAgrupamento,
  FormatoExportacao,
  RelatorioReceitaDespesa,
  RelatorioCategoria,
  Tendencia,
} from "../types/relatorio";
import { formatarDataParaAPI } from "../utils/data";

export function useRelatorios() {
  const [relatorioReceitaDespesa, setRelatorioReceitaDespesa] =
    useState<RelatorioReceitaDespesa | null>(null);
  const [relatorioCategoria, setRelatorioCategoria] =
    useState<RelatorioCategoria | null>(null);
  const [tendencias, setTendencias] = useState<Tendencia | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obter relatório de receitas vs despesas
  const obterRelatorioReceitaDespesa = useCallback(
    async (
      dataInicial: Date,
      dataFinal: Date,
      agrupamento: TipoAgrupamento = TipoAgrupamento.MONTH
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataInicialFormatada = formatarDataParaAPI(dataInicial);
        const dataFinalFormatada = formatarDataParaAPI(dataFinal);

        const relatorio = await relatoriosApi.obterRelatorioReceitaDespesa(
          dataInicialFormatada,
          dataFinalFormatada,
          agrupamento
        );
        setRelatorioReceitaDespesa(relatorio);
        return relatorio;
      } catch (error: any) {
        setError(
          error.message || "Erro ao gerar relatório de receitas e despesas"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter relatório por categoria
  const obterRelatorioCategoria = useCallback(
    async (dataInicial: Date, dataFinal: Date, categoriaIds?: number[]) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataInicialFormatada = formatarDataParaAPI(dataInicial);
        const dataFinalFormatada = formatarDataParaAPI(dataFinal);

        const relatorio = await relatoriosApi.obterRelatorioCategoria(
          dataInicialFormatada,
          dataFinalFormatada,
          categoriaIds
        );
        setRelatorioCategoria(relatorio);
        return relatorio;
      } catch (error: any) {
        setError(error.message || "Erro ao gerar relatório por categoria");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter tendências financeiras
  const obterTendencias = useCallback(async (meses: number = 6) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await relatoriosApi.obterTendencias(meses);
      setTendencias(data);
      return data;
    } catch (error: any) {
      setError(error.message || "Erro ao obter tendências financeiras");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Exportar dados
  const exportarDados = useCallback(
    async (dataInicial: Date, dataFinal: Date, formato: FormatoExportacao) => {
      setIsLoading(true);
      setError(null);

      try {
        const dataInicialFormatada = formatarDataParaAPI(dataInicial);
        const dataFinalFormatada = formatarDataParaAPI(dataFinal);

        const blob = await relatoriosApi.exportarDados({
          startDate: dataInicialFormatada,
          endDate: dataFinalFormatada,
          format: formato,
        });

        // Criar URL de download
        const url = URL.createObjectURL(blob);

        // Determinar extensão do arquivo
        let extensao = "";
        switch (formato) {
          case FormatoExportacao.CSV:
            extensao = "csv";
            break;
          case FormatoExportacao.EXCEL:
            extensao = "xlsx";
            break;
          case FormatoExportacao.JSON:
            extensao = "json";
            break;
          case FormatoExportacao.PDF:
            extensao = "pdf";
            break;
          default:
            extensao = "txt";
        }

        // Criar e clicar em link para download
        const a = document.createElement("a");
        a.href = url;
        a.download = `financas_${dataInicialFormatada}_${dataFinalFormatada}.${extensao}`;
        document.body.appendChild(a);
        a.click();

        // Limpar
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return true;
      } catch (error: any) {
        setError(error.message || "Erro ao exportar dados");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter URL para exportação
  const obterUrlExportacao = useCallback(
    (dataInicial: Date, dataFinal: Date, formato: FormatoExportacao) => {
      const dataInicialFormatada = formatarDataParaAPI(dataInicial);
      const dataFinalFormatada = formatarDataParaAPI(dataFinal);

      return relatoriosApi.obterUrlExportacao({
        startDate: dataInicialFormatada,
        endDate: dataFinalFormatada,
        format: formato,
      });
    },
    []
  );

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    relatorioReceitaDespesa,
    relatorioCategoria,
    tendencias,
    isLoading,
    error,
    obterRelatorioReceitaDespesa,
    obterRelatorioCategoria,
    obterTendencias,
    exportarDados,
    obterUrlExportacao,
    limparErro,
  };
}
