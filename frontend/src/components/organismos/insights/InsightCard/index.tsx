"use client";

// Component for displaying a single insight
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Insight, TipoInsight } from "@/types";
import { formatarMoeda } from "@/utils/formatadores";
import {
  LightbulbIcon,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  Info,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ROTAS } from "@/constants/rotas";

interface InsightCardProps {
  insight: Insight;
  compact?: boolean;
}

export function InsightCard({ insight, compact = false }: InsightCardProps) {
  const router = useRouter();

  // Function to get the appropriate icon based on insight type
  const getInsightIcon = (tipo: TipoInsight) => {
    switch (tipo) {
      case TipoInsight.PADRAO_GASTO:
        return <BarChart3 className="w-5 h-5" />;
      case TipoInsight.OPORTUNIDADE_ECONOMIA:
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      case TipoInsight.DETECCAO_ANOMALIA:
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case TipoInsight.RECOMENDACAO_ORCAMENTO:
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case TipoInsight.TENDENCIA:
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case TipoInsight.INFORMATIVO:
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  // Function to get badge styling based on relevance score
  const getRelevanceBadgeStyle = (score: number) => {
    if (score >= 8) return "bg-red-100 text-red-800";
    if (score >= 6) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  // Function to get insight type label
  const getInsightTypeLabel = (tipo: TipoInsight) => {
    switch (tipo) {
      case TipoInsight.PADRAO_GASTO:
        return "Padrão de Gasto";
      case TipoInsight.OPORTUNIDADE_ECONOMIA:
        return "Oportunidade de Economia";
      case TipoInsight.DETECCAO_ANOMALIA:
        return "Anomalia Detectada";
      case TipoInsight.RECOMENDACAO_ORCAMENTO:
        return "Recomendação de Orçamento";
      case TipoInsight.TENDENCIA:
        return "Tendência";
      case TipoInsight.INFORMATIVO:
        return "Informativo";
      default:
        return tipo;
    }
  };

  const handleViewDetails = () => {
    router.push(ROTAS.PRIVATE.INSIGHTS.DETALHE(insight.id));
  };

  return (
    <Card className={compact ? "h-full" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getInsightIcon(insight.type)}
            </div>
            <Badge className={getRelevanceBadgeStyle(insight.relevanceScore)}>
              {insight.relevanceScore.toFixed(1)}
            </Badge>
          </div>
          <Badge variant="outline">{getInsightTypeLabel(insight.type)}</Badge>
        </div>
        <CardTitle className="text-lg mt-3">{insight.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-muted-foreground ${compact ? "line-clamp-3" : ""}`}>
          {insight.description}
        </p>

        {insight.impactValue && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium">Impacto potencial:</span>
            <span className="font-bold text-green-600">
              {formatarMoeda(insight.impactValue)}
            </span>
          </div>
        )}

        {insight.categories && insight.categories.length > 0 && !compact && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Categorias relacionadas:</p>
            <div className="flex flex-wrap gap-2">
              {insight.categories.map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {!compact && (
        <CardFooter>
          <Button
            variant="outline"
            onClick={handleViewDetails}
            className="w-full"
          >
            Ver detalhes
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
