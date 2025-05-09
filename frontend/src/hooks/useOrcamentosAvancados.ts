// src/hooks/useOrcamentosAvancado.ts
import { useState, useCallback, useEffect } from "react";
import { useOrcamentos } from "./useOrcamentos";
import { useTransacoes } from "./useTransacoes";
import { Orcamento, OrcamentoProgresso } from "@/types/orcamento";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";

interface OrcamentoComProgresso extends Orcamento {
  progresso: {
    percentualGasto: number;
    valorGasto: number;
    valorRestante: number;
    situacao: "normal" | "atencao" | "excedido";
  };
}

export function useOrcamentosAvancado() {
  // Base hooks
  const orcamentosHook = useOrcamentos();
  const { buscarResumoPorCategoria } = useTransacoes();

  // Additional state
  const [orcamentosComProgresso, setOrcamentosComProgresso] = useState<
    OrcamentoComProgresso[]
  >([]);
  const [estaCarregandoProgresso, setEstaCarregandoProgresso] = useState(false);
  const [erroProgresso, setErroProgresso] = useState<string | null>(null);

  // Load budgets with progress
  const carregarOrcamentosComProgresso = useCallback(async () => {
    setEstaCarregandoProgresso(true);
    setErroProgresso(null);

    try {
      // Fetch active budgets if not already loaded
      let budgets = orcamentosHook.orcamentos;
      if (budgets.length === 0) {
        await orcamentosHook.buscarOrcamentos({ active: true });
        budgets = orcamentosHook.orcamentos;
      }

      // Get current period
      const periodo = obterPeriodo("mes");

      // Fetch category spending summary
      const resumoCategorias = await buscarResumoPorCategoria(
        periodo.inicio,
        periodo.fim
      );

      // Calculate progress for each budget
      const orcamentosProcessados = budgets.map((orcamento) => {
        // Get all categories for this budget
        const categoriasOrcamento = orcamento.categories || [];
        const categoriaIds = categoriasOrcamento.map((cat) => cat.id);

        // Calculate total spending for these categories
        let valorGastoTotal = 0;

        categoriaIds.forEach((catId) => {
          const categoriaSummary = resumoCategorias.find(
            (item) => item.categoryId === catId
          );
          if (categoriaSummary) {
            valorGastoTotal += Number(categoriaSummary.total);
          }
        });

        // Calculate remaining and percentage
        const valorRestante = Math.max(
          0,
          Number(orcamento.amount) - valorGastoTotal
        );
        const percentualGasto =
          (valorGastoTotal / Number(orcamento.amount)) * 100;

        // Determine budget status
        let situacao: "normal" | "atencao" | "excedido" = "normal";
        if (percentualGasto >= 100) {
          situacao = "excedido";
        } else if (percentualGasto >= 80) {
          situacao = "atencao";
        }

        // Return enhanced budget object
        return {
          ...orcamento,
          progresso: {
            percentualGasto,
            valorGasto: valorGastoTotal,
            valorRestante,
            situacao,
          },
        };
      });

      setOrcamentosComProgresso(orcamentosProcessados);
    } catch (error) {
      console.error("Erro ao carregar progresso dos orçamentos:", error);
      setErroProgresso("Falha ao calcular o progresso dos orçamentos");
    } finally {
      setEstaCarregandoProgresso(false);
    }
  }, [
    orcamentosHook.buscarOrcamentos,
    orcamentosHook.orcamentos,
    buscarResumoPorCategoria,
  ]);

  // Get budget recommendations based on current spending patterns
  const obterRecomendacoesOrcamento = useCallback(async () => {
    if (orcamentosComProgresso.length === 0) {
      await carregarOrcamentosComProgresso();
    }

    // Create recommendations based on budget progress
    const recomendacoes = [];

    // Check for exceeded budgets
    const orcamentosExcedidos = orcamentosComProgresso.filter(
      (orc) => orc.progresso.situacao === "excedido"
    );

    if (orcamentosExcedidos.length > 0) {
      recomendacoes.push({
        tipo: "alerta",
        titulo: `${orcamentosExcedidos.length} orçamento${
          orcamentosExcedidos.length > 1 ? "s" : ""
        } excedido${orcamentosExcedidos.length > 1 ? "s" : ""}`,
        descricao:
          "Você excedeu o limite em alguns orçamentos. Considere revisar seus gastos ou ajustar seus orçamentos para o próximo período.",
        orcamentos: orcamentosExcedidos,
      });
    }

    // Check for budgets nearing limit
    const orcamentosProximosLimite = orcamentosComProgresso.filter(
      (orc) => orc.progresso.situacao === "atencao"
    );

    if (orcamentosProximosLimite.length > 0) {
      recomendacoes.push({
        tipo: "atencao",
        titulo: `${orcamentosProximosLimite.length} orçamento${
          orcamentosProximosLimite.length > 1 ? "s" : ""
        } próximo${orcamentosProximosLimite.length > 1 ? "s" : ""} do limite`,
        descricao:
          "Fique atento aos gastos nestas categorias para não exceder seu orçamento.",
        orcamentos: orcamentosProximosLimite,
      });
    }

    // Check for budgets with little spending
    const orcamentosPoucoUtilizados = orcamentosComProgresso.filter(
      (orc) =>
        orc.progresso.percentualGasto < 20 && new Date(orc.endDate) > new Date()
    );

    if (orcamentosPoucoUtilizados.length > 0) {
      recomendacoes.push({
        tipo: "informacao",
        titulo: "Orçamentos pouco utilizados",
        descricao:
          "Alguns orçamentos têm pouco uso. Considere realocar parte destes recursos para outras categorias no próximo período.",
        orcamentos: orcamentosPoucoUtilizados,
      });
    }

    return recomendacoes;
  }, [orcamentosComProgresso, carregarOrcamentosComProgresso]);

  // Calculate total budget versus spending
  const calcularTotaisOrcamento = useCallback(() => {
    if (orcamentosComProgresso.length === 0) {
      return {
        totalOrcado: 0,
        totalGasto: 0,
        percentualTotal: 0,
      };
    }

    const totalOrcado = orcamentosComProgresso.reduce(
      (sum, orc) => sum + Number(orc.amount),
      0
    );

    const totalGasto = orcamentosComProgresso.reduce(
      (sum, orc) => sum + orc.progresso.valorGasto,
      0
    );

    return {
      totalOrcado,
      totalGasto,
      percentualTotal: totalOrcado > 0 ? (totalGasto / totalOrcado) * 100 : 0,
    };
  }, [orcamentosComProgresso]);

  // Export all base functions and new ones
  return {
    ...orcamentosHook,
    orcamentosComProgresso,
    estaCarregandoProgresso,
    erroProgresso,
    carregarOrcamentosComProgresso,
    obterRecomendacoesOrcamento,
    calcularTotaisOrcamento,
  };
}
