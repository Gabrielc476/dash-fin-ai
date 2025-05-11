// frontend/src/components/organismos/dashboard/TransacoesRecentes/index.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROTAS } from "@/constants/rotas";
import { formatarData, formatarMoeda } from "@/utils/formatadores";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Plus,
  Receipt,
} from "lucide-react";

interface TransacoesRecentesProps {
  transacoes: any[];
  isLoading: boolean;
  onNavegar: (rota: string) => void;
  limite?: number;
}

export function TransacoesRecentes({
  transacoes,
  isLoading,
  onNavegar,
  limite = 6,
}: TransacoesRecentesProps) {
  // Ordenar e limitar transações
  const ultimasTransacoes = transacoes
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limite);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Transações Recentes
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavegar(ROTAS.PRIVATE.TRANSACOES.LISTAR)}
          >
            Ver todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array(limite)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
          </div>
        ) : ultimasTransacoes.length > 0 ? (
          <div className="space-y-3">
            {ultimasTransacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="flex justify-between items-center py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                onClick={() =>
                  onNavegar(ROTAS.PRIVATE.TRANSACOES.DETALHE(transacao.id))
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      transacao.isExpense ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {transacao.isExpense ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {transacao.description}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{transacao.category?.name || "Sem categoria"}</span>
                      <span>•</span>
                      <span>
                        {formatarData(new Date(transacao.date), "dd/MM")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium text-sm ${
                      transacao.isExpense ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {transacao.isExpense ? "-" : "+"}
                    {formatarMoeda(transacao.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transacao.paymentMethod || ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma transação encontrada</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => onNavegar(ROTAS.PRIVATE.TRANSACOES.ADICIONAR)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Transação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
