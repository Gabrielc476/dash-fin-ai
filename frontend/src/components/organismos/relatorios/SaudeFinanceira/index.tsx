// frontend/src/components/organismos/relatorios/SaudeFinanceira/index.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatarMoeda, formatarPercentual } from "@/utils/formatadores";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart,
  Wallet,
  CreditCard,
  ArrowRight,
  Lightbulb,
  CircleDollarSign,
  Calendar,
} from "lucide-react";

interface SaudeFinanceiraProps {
  saudeFinanceira: any | null;
  isLoading?: boolean;
  onAtualizarAnalise?: () => Promise<void>;
  onExportar?: () => void;
  className?: string;
}

export function SaudeFinanceira({
  saudeFinanceira,
  isLoading = false,
  onAtualizarAnalise,
  onExportar,
  className = "",
}: SaudeFinanceiraProps) {
  const [atualizando, setAtualizando] = useState(false);

  const atualizarAnalise = async () => {
    if (onAtualizarAnalise) {
      setAtualizando(true);
      try {
        await onAtualizarAnalise();
      } finally {
        setAtualizando(false);
      }
    }
  };

  // Funções auxiliares
  const obterCorPontuacao = (pontuacao: number) => {
    if (pontuacao >= 7) return "bg-green-600";
    if (pontuacao >= 4) return "bg-yellow-600";
    return "bg-red-600";
  };

  const obterVarianteBadge = (pontuacao: number) => {
    if (pontuacao >= 7) return "default";
    if (pontuacao >= 4) return "secondary";
    return "destructive";
  };

  const obterIconeArea = (area: string) => {
    switch (area.toLowerCase()) {
      case "orçamento":
      case "orçamentos":
      case "orcamento":
      case "orcamentos":
        return BarChart;
      case "receitas":
      case "receita":
      case "renda":
        return Wallet;
      case "despesas":
      case "despesa":
      case "gastos":
        return CreditCard;
      case "investimentos":
      case "investimento":
      case "poupança":
        return TrendingUp;
      case "dívidas":
      case "dividas":
      case "débitos":
        return TrendingDown;
      case "planejamento":
      case "metas":
        return Calendar;
      case "economia":
      case "economias":
        return CircleDollarSign;
      default:
        return Lightbulb;
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-primary" />
            Saúde Financeira
          </CardTitle>
          {saudeFinanceira && (
            <Badge
              variant={obterVarianteBadge(saudeFinanceira.pontuacao_saude)}
              className="text-lg px-3 py-1"
            >
              {saudeFinanceira.pontuacao_saude.toFixed(1)}/10
            </Badge>
          )}
        </div>
        <CardDescription>
          Análise completa da sua saúde financeira
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || atualizando ? (
          <div className="space-y-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />

            <div className="space-y-4 pt-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                  </div>
                ))}
            </div>
          </div>
        ) : saudeFinanceira ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {saudeFinanceira.resumo}
              </p>
            </div>

            {/* Pontuação geral com barra de progresso */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Pontuação Geral</span>
                <span className="text-sm font-medium">
                  {saudeFinanceira.pontuacao_saude.toFixed(1)}/10
                </span>
              </div>
              <Progress
                value={saudeFinanceira.pontuacao_saude * 10}
                className="h-2"
                indicatorClassName={obterCorPontuacao(
                  saudeFinanceira.pontuacao_saude
                )}
              />
            </div>

            {/* Avaliações por área */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-medium">Avaliação por Área</h3>

              {saudeFinanceira.avaliacoes.map((avaliacao, index) => {
                const IconeArea = obterIconeArea(avaliacao.area);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <IconeArea className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {avaliacao.area}
                        </span>
                      </div>
                      <Badge variant={obterVarianteBadge(avaliacao.pontuacao)}>
                        {avaliacao.pontuacao}/10
                      </Badge>
                    </div>
                    <Progress
                      value={avaliacao.pontuacao * 10}
                      className="h-1.5"
                      indicatorClassName={obterCorPontuacao(
                        avaliacao.pontuacao
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      {avaliacao.analise}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Ações recomendadas */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium">Ações Recomendadas</h3>
              <div className="space-y-2">
                {saudeFinanceira.acoes_recomendadas
                  .slice(0, 3)
                  .map((acao, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                      <p className="text-sm">{acao}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="font-medium mb-2">Análise não disponível</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em "Gerar Análise" para avaliar sua saúde financeira.
            </p>
            <Button onClick={atualizarAnalise}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Análise
            </Button>
          </div>
        )}
      </CardContent>
      {saudeFinanceira && (
        <CardFooter className="flex flex-col space-y-2">
          <Button
            className="w-full"
            onClick={atualizarAnalise}
            disabled={atualizando}
          >
            {atualizando ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar Análise
          </Button>
          {onExportar && (
            <Button variant="outline" className="w-full" onClick={onExportar}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
