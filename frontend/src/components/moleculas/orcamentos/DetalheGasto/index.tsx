// src/components/moleculas/orcamentos/DetalheGasto/index.tsx
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Categoria } from "@/types/categoria";
import { useTransacoes } from "@/hooks";
import { formatarMoeda } from "@/utils/formatadores";
import { obterPeriodo, formatarDataParaAPI } from "@/utils/data";
import { ROTAS } from "@/constants/rotas";

interface DetalheGastoProps {
  categoria: Categoria;
  orcamentoId: number;
}

export function DetalheGasto({ categoria, orcamentoId }: DetalheGastoProps) {
  const router = useRouter();
  const { buscarResumoPorCategoria } = useTransacoes();
  const [totalGasto, setTotalGasto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load category spending
  useEffect(() => {
    const carregarGastos = async () => {
      setIsLoading(true);

      try {
        // Get current month period
        const { inicio, fim } = obterPeriodo("mes");

        // Get category spending
        const resumo = await buscarResumoPorCategoria(inicio, fim);

        // Find this category's spending
        const categoriaResumo = resumo.find(
          (item) => item.categoryId === categoria.id
        );

        if (categoriaResumo) {
          setTotalGasto(categoriaResumo.total);
        } else {
          setTotalGasto(0);
        }
      } catch (error) {
        console.error("Erro ao carregar gastos da categoria:", error);
        setTotalGasto(0);
      } finally {
        setIsLoading(false);
      }
    };

    carregarGastos();
  }, [categoria.id, buscarResumoPorCategoria]);

  // Navigate to transactions filtered by this category
  const verTransacoes = () => {
    const { inicio, fim } = obterPeriodo("mes");

    const dataInicialParam = formatarDataParaAPI(inicio);
    const dataFinalParam = formatarDataParaAPI(fim);

    router.push(
      `${ROTAS.PRIVATE.TRANSACOES.LISTAR}?categoryId=${categoria.id}&startDate=${dataInicialParam}&endDate=${dataFinalParam}`
    );
  };

  return (
    <div
      className="border rounded-lg p-3 hover:bg-accent/30 transition-colors duration-200 cursor-pointer"
      onClick={verTransacoes}
      style={{ borderLeftColor: categoria.color, borderLeftWidth: "4px" }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{categoria.name}</div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className={`text-base ${isLoading ? "opacity-50" : ""}`}>
        {isLoading ? (
          <div className="w-16 h-5 bg-muted animate-pulse rounded"></div>
        ) : (
          formatarMoeda(totalGasto)
        )}
      </div>

      <div className="text-xs text-muted-foreground mt-1">Mês atual</div>
    </div>
  );
}
