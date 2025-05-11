// frontend/src/components/organismos/relatorios/ResumoFinanceiro/index.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatarMoeda, formatarPercentual } from "@/utils/formatadores";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

interface ResumoFinanceiroProps {
  receitas: number;
  despesas: number;
  saldo: number;
  periodo: {
    inicio: Date;
    fim: Date;
  };
  variacaoReceitas?: number; // percentual
  variacaoDespesas?: number; // percentual
  variacaoSaldo?: number; // percentual
  className?: string;
}

export function ResumoFinanceiro({
  receitas,
  despesas,
  saldo,
  periodo,
  variacaoReceitas,
  variacaoDespesas,
  variacaoSaldo,
  className = "",
}: ResumoFinanceiroProps) {
  // Calcular variação percentual entre receitas e despesas
  const percentualSaldo = despesas > 0 ? (saldo / receitas) * 100 : 0;

  // Função para exibir indicador de tendência
  const TendenciaIndicator = ({ variacao }: { variacao?: number }) => {
    if (variacao === undefined) return null;

    const isPositive = variacao > 0;
    const isZero = variacao === 0;
    const value = Math.abs(variacao);

    return (
      <Badge
        variant={isZero ? "outline" : isPositive ? "default" : "destructive"}
        className={`text-xs ${
          isZero ? "" : isPositive ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {isZero ? (
          <Minus className="w-3 h-3 mr-1" />
        ) : isPositive ? (
          <ArrowUp className="w-3 h-3 mr-1" />
        ) : (
          <ArrowDown className="w-3 h-3 mr-1" />
        )}
        {value.toFixed(1)}%
      </Badge>
    );
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Receitas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <Wallet className="w-4 h-4 mr-2 text-green-600" />
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">
              {formatarMoeda(receitas)}
            </div>
            {variacaoReceitas !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  vs. período anterior
                </span>
                <TendenciaIndicator variacao={variacaoReceitas} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Despesas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <CreditCard className="w-4 h-4 mr-2 text-red-600" />
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-600">
              {formatarMoeda(despesas)}
            </div>
            {variacaoDespesas !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  vs. período anterior
                </span>
                <TendenciaIndicator variacao={variacaoDespesas} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saldo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
            Saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div
              className={`text-2xl font-bold ${
                saldo >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatarMoeda(saldo)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {saldo >= 0
                  ? `${formatarPercentual(percentualSaldo / 100)} da receita`
                  : "Déficit"}
              </span>
              {variacaoSaldo !== undefined && (
                <TendenciaIndicator variacao={variacaoSaldo} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-3 text-center text-xs text-muted-foreground">
        Período: {format(periodo.inicio, "dd/MM/yyyy", { locale: ptBR })} até{" "}
        {format(periodo.fim, "dd/MM/yyyy", { locale: ptBR })}
      </div>
    </div>
  );
}
