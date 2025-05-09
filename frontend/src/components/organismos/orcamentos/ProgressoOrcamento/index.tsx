// src/components/organismos/orcamentos/ProgressoOrcamento/index.tsx
import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatarMoeda } from "@/utils/formatadores";
import { formatarData } from "@/utils/formatadores";
import { OrcamentoProgresso } from "@/types/orcamento";
import { ROTAS } from "@/constants/rotas";

// Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BarraProgresso } from "@/components/moleculas/orcamentos/BarraProgresso";
import { DetalheGasto } from "@/components/moleculas/orcamentos/DetalheGasto";

interface ProgressoOrcamentoProps {
  progresso: OrcamentoProgresso | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
}

export function ProgressoOrcamento({
  progresso,
  isLoading,
  error,
  onRefresh,
}: ProgressoOrcamentoProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Handle manually refreshing the progress data
  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  // Calculate remaining days
  const calcularDiasRestantes = () => {
    if (!progresso) return 0;

    const hoje = new Date();
    const dataFim = new Date(progresso.budget.endDate);
    const diffTempo = dataFim.getTime() - hoje.getTime();
    return Math.max(0, Math.ceil(diffTempo / (1000 * 3600 * 24)));
  };

  // Navigate back to budgets list
  const voltarParaLista = () => {
    router.push(ROTAS.PRIVATE.ORCAMENTOS.LISTAR);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={voltarParaLista}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Orçamentos
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || refreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Atualizar Dados
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : progresso ? (
        <div className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>{progresso.budget.name}</CardTitle>
                  <CardDescription>
                    Período:{" "}
                    {formatarData(new Date(progresso.budget.startDate))} a{" "}
                    {formatarData(new Date(progresso.budget.endDate))}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    progresso.progress.isOverBudget ? "destructive" : "default"
                  }
                  className="text-sm"
                >
                  {progresso.progress.isOverBudget
                    ? "Orçamento Excedido"
                    : progresso.progress.percentage >= 90
                    ? "Quase no Limite"
                    : "Dentro do Orçamento"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-6 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Orçamento Total
                  </p>
                  <p className="text-2xl font-bold">
                    {formatarMoeda(progresso.budget.amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gasto Atual</p>
                  <p
                    className={`text-2xl font-bold ${
                      progresso.progress.isOverBudget ? "text-destructive" : ""
                    }`}
                  >
                    {formatarMoeda(progresso.progress.spent)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Restante</p>
                  <p className="text-2xl font-bold">
                    {formatarMoeda(progresso.progress.remaining)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Dias Restantes
                  </p>
                  <p className="text-2xl font-bold">
                    {calcularDiasRestantes()}
                  </p>
                </div>
              </div>

              <BarraProgresso
                percentual={progresso.progress.percentage}
                textoPercentual={`${Math.min(
                  100,
                  Math.round(progresso.progress.percentage)
                )}%`}
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Categorias Incluídas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {progresso.budget.categories?.map((categoria) => (
                    <DetalheGasto
                      key={categoria.id}
                      categoria={categoria}
                      orcamentoId={progresso.budget.id}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas para Economizar</CardTitle>
              <CardDescription>
                Recomendações para manter seu orçamento sob controle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {progresso.progress.isOverBudget ? (
                  <>
                    <li>
                      Revise suas últimas transações para identificar gastos que
                      podem ser reduzidos.
                    </li>
                    <li>
                      Considere aumentar o valor do orçamento para o próximo
                      período se o gasto for necessário.
                    </li>
                    <li>
                      Divida suas compras entre diferentes categorias para
                      melhor controle.
                    </li>
                  </>
                ) : progresso.progress.percentage > 80 ? (
                  <>
                    <li>
                      Você está próximo do limite. Monitore seus gastos nos
                      próximos dias.
                    </li>
                    <li>
                      Planeje suas compras essenciais para o restante do
                      período.
                    </li>
                    <li>
                      Adie gastos não essenciais para o próximo período
                      orçamentário.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Seu orçamento está sob controle. Continue monitorando seus
                      gastos.
                    </li>
                    <li>
                      Considere economizar o valor restante para objetivos
                      financeiros futuros.
                    </li>
                    <li>
                      Analise se o valor orçado está adequado às suas
                      necessidades.
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Nenhum dado de orçamento disponível</p>
            <Button onClick={voltarParaLista}>
              Voltar para a lista de orçamentos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
