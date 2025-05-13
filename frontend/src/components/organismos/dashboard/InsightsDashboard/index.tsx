"use client";

// Component to display insights in the dashboard
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InsightCard } from "@/components/organismos/insights/InsightCard";
import { ROTAS } from "@/constants/rotas";
import { Insight, TipoInsight } from "@/types";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Loader2,
  PlusCircle,
  TrendingDown,
  AlertTriangle,
  PieChart,
  TrendingUp,
  InfoIcon,
} from "lucide-react";

interface InsightsDashboardProps {
  insights: Insight[];
  categorias: any[];
  isLoading: boolean;
  onGerarInsights: () => Promise<any>;
  onNavegar: (route: string) => void;
}

export function InsightsDashboard({
  insights,
  categorias,
  isLoading,
  onGerarInsights,
  onNavegar,
}: InsightsDashboardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Get top 3 insights by relevance score
  const topInsights = [...insights]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);

  // Function to handle generating insights
  const handleGerarInsights = async () => {
    setIsGenerating(true);
    try {
      await onGerarInsights();
    } catch (error) {
      console.error("Erro ao gerar insights:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to get icon by insight type
  const getIconByType = (type: TipoInsight) => {
    switch (type) {
      case TipoInsight.PADRAO_GASTO:
        return <PieChart className="w-5 h-5" />;
      case TipoInsight.OPORTUNIDADE_ECONOMIA:
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      case TipoInsight.DETECCAO_ANOMALIA:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case TipoInsight.RECOMENDACAO_ORCAMENTO:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case TipoInsight.TENDENCIA:
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case TipoInsight.INFORMATIVO:
      default:
        return <InfoIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-primary" />
            Insights de IA
          </CardTitle>
          <Badge variant="outline" className="px-3">
            Powered by Claude 3.7
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
          </div>
        ) : topInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topInsights.map((insight) => (
              <div
                key={insight.id}
                className="border rounded-lg p-4 hover:bg-accent/5 cursor-pointer transition-colors"
                onClick={() =>
                  onNavegar(ROTAS.PRIVATE.INSIGHTS.DETALHE(insight.id))
                }
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {getIconByType(insight.type)}
                    </div>
                    <Badge
                      className={
                        insight.relevanceScore >= 8
                          ? "bg-red-100 text-red-800"
                          : insight.relevanceScore >= 6
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {insight.relevanceScore.toFixed(1)}
                    </Badge>
                  </div>
                  <Badge variant="outline">
                    {insight.type === TipoInsight.PADRAO_GASTO
                      ? "Padrão"
                      : insight.type === TipoInsight.OPORTUNIDADE_ECONOMIA
                      ? "Economia"
                      : insight.type === TipoInsight.DETECCAO_ANOMALIA
                      ? "Anomalia"
                      : insight.type === TipoInsight.RECOMENDACAO_ORCAMENTO
                      ? "Orçamento"
                      : insight.type === TipoInsight.TENDENCIA
                      ? "Tendência"
                      : "Info"}
                  </Badge>
                </div>

                <h4 className="font-medium mb-2">{insight.title}</h4>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {insight.description}
                </p>

                {insight.impactValue && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Impacto potencial:</span>{" "}
                    <span className="text-green-600 font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(insight.impactValue)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-primary/5 p-4 rounded-full inline-flex mb-3">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">
              Sem insights disponíveis
            </h3>
            <p className="text-muted-foreground mb-4">
              Gere novos insights para receber recomendações personalizadas com
              base nos seus dados financeiros.
            </p>
            <Button onClick={handleGerarInsights} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando insights...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Insights
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>

      {topInsights.length > 0 && (
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleGerarInsights}
            disabled={isGenerating}
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                Gerar Novos Insights
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onNavegar(ROTAS.PRIVATE.INSIGHTS.LISTAR)}
          >
            Ver Todos os Insights
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
