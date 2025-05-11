// frontend/src/components/organismos/dashboard/InsightsDashboard/index.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ROTAS } from "@/constants/rotas";
import { formatarMoeda } from "@/utils/formatadores";
import { ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react";

interface InsightsDashboardProps {
  insights: any[];
  categorias: any[];
  isLoading: boolean;
  onGerarInsights: () => void;
  onNavegar: (rota: string) => void;
  limite?: number;
}

export function InsightsDashboard({
  insights,
  categorias,
  isLoading,
  onGerarInsights,
  onNavegar,
  limite = 6,
}: InsightsDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Insights Financeiros
          </div>
          <Button
            onClick={onGerarInsights}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Novos
              </>
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Recomendações personalizadas baseadas em seus dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(limite)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2 p-4 border rounded-lg">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
          </div>
        ) : insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.slice(0, limite).map((insight) => (
              <div
                key={insight.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() =>
                  onNavegar(ROTAS.PRIVATE.INSIGHTS.DETALHE(insight.id))
                }
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {insight.relevanceScore}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {insight.description}
                </p>
                {insight.impactValue && (
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        insight.impactValue > 0 ? "default" : "destructive"
                      }
                      className="text-xs"
                    >
                      {insight.impactValue > 0 ? "+" : ""}
                      {formatarMoeda(Math.abs(insight.impactValue))}
                    </Badge>
                    {insight.categories && insight.categories.length > 0 && (
                      <div className="flex -space-x-1">
                        {insight.categories.slice(0, 3).map((cat) => (
                          <div
                            key={cat.id}
                            className="w-4 h-4 rounded-full border-2 border-background"
                            style={{
                              backgroundColor:
                                categorias.find((c) => c.id === cat.id)
                                  ?.color || "#666",
                            }}
                            title={cat.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">Nenhum insight disponível</p>
            <p className="text-sm mt-1">
              Clique em "Gerar Novos" para receber recomendações personalizadas
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavegar(ROTAS.PRIVATE.INSIGHTS.LISTAR)}
        >
          Ver todos os insights
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
