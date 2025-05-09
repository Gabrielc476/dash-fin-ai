// src/components/organismos/dashboard/ResumoOrcamentos/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Orcamento } from "@/types/orcamento";
import { formatarMoeda } from "@/utils/formatadores";
import { ROTAS } from "@/constants/rotas";

// Components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarraProgresso } from "@/components/moleculas/orcamentos/BarraProgresso";

interface ResumoOrcamentosProps {
  orcamentos: Orcamento[];
  progressos: Record<
    number,
    {
      spent: number;
      remaining: number;
      percentage: number;
      isOverBudget: boolean;
    }
  >;
  isLoading: boolean;
}

export function ResumoOrcamentos({
  orcamentos,
  progressos,
  isLoading,
}: ResumoOrcamentosProps) {
  const router = useRouter();
  const [orcamentosAtivos, setOrcamentosAtivos] = useState<Orcamento[]>([]);

  // Filter active budgets
  useEffect(() => {
    const hoje = new Date();

    const ativos = orcamentos.filter((orcamento) => {
      const dataInicio = new Date(orcamento.startDate);
      const dataFim = new Date(orcamento.endDate);

      return dataInicio <= hoje && hoje <= dataFim;
    });

    // Sort by progress percentage (highest first)
    ativos.sort((a, b) => {
      const progressoA = progressos[a.id]?.percentage || 0;
      const progressoB = progressos[b.id]?.percentage || 0;

      return progressoB - progressoA;
    });

    setOrcamentosAtivos(ativos);
  }, [orcamentos, progressos]);

  // Navigate to budget detail
  const verDetalheOrcamento = (id: number) => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.DETALHE(id));
  };

  // Navigate to budgets list
  const verTodosOrcamentos = () => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.LISTAR);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orçamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-6 w-full bg-muted rounded-full"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-1/4 bg-muted rounded"></div>
                  <div className="h-4 w-1/4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orcamentosAtivos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Nenhum orçamento ativo encontrado</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => router.push(ROTAS.PRIVATE.ORCAMENTOS.ADICIONAR)}
            >
              Criar um orçamento
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orcamentosAtivos.slice(0, 5).map((orcamento) => {
              const progresso = progressos[orcamento.id] || {
                spent: 0,
                remaining: orcamento.amount,
                percentage: 0,
                isOverBudget: false,
              };

              return (
                <div key={orcamento.id} className="group">
                  <div
                    className="flex justify-between items-center mb-1 cursor-pointer group-hover:text-primary transition-colors"
                    onClick={() => verDetalheOrcamento(orcamento.id)}
                  >
                    <span className="font-medium">{orcamento.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <BarraProgresso
                    percentual={progresso.percentage}
                    mostrarTexto={true}
                  />

                  <div className="flex justify-between mt-1 text-sm">
                    <span>
                      {formatarMoeda(progresso.spent)} /{" "}
                      {formatarMoeda(orcamento.amount)}
                    </span>
                    <span
                      className={
                        progresso.isOverBudget ? "text-red-600 font-medium" : ""
                      }
                    >
                      {progresso.isOverBudget
                        ? "Excedido"
                        : `${formatarMoeda(progresso.remaining)} restantes`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={verTodosOrcamentos}
        >
          {orcamentosAtivos.length > 0
            ? "Gerenciar orçamentos"
            : "Ver todos os orçamentos"}
        </Button>
      </CardFooter>
    </Card>
  );
}
