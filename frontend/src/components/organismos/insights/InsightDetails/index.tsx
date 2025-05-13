// Component to display detailed information about an insight
import { useIaInsights } from "@/hooks";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatarMoeda } from "@/utils/formatadores";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  Tag,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ROTAS } from "@/constants/rotas";
import { TipoInsight } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InsightDetailsProps {
  insightId: number | string;
}

export function InsightDetails({ insightId }: InsightDetailsProps) {
  const router = useRouter();
  const { insightAtual, buscarInsightPorId, isLoading, error } =
    useIaInsights();

  useEffect(() => {
    buscarInsightPorId(insightId);
  }, [insightId, buscarInsightPorId]);

  // Function to get the appropriate icon based on insight type
  const getInsightIcon = (tipo: TipoInsight) => {
    switch (tipo) {
      case TipoInsight.PADRAO_GASTO:
        return <BarChart3 className="w-6 h-6" />;
      case TipoInsight.OPORTUNIDADE_ECONOMIA:
        return <TrendingDown className="w-6 h-6 text-green-500" />;
      case TipoInsight.DETECCAO_ANOMALIA:
        return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case TipoInsight.RECOMENDACAO_ORCAMENTO:
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      case TipoInsight.TENDENCIA:
        return <TrendingUp className="w-6 h-6 text-purple-500" />;
      case TipoInsight.INFORMATIVO:
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
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

  const handleBack = () => {
    router.push(ROTAS.PRIVATE.INSIGHTS.LISTAR);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Erro ao carregar o insight
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleBack}>Voltar para a lista</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insightAtual) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Insight não encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                O insight solicitado não foi encontrado
              </p>
              <Button onClick={handleBack}>Voltar para a lista</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          {getInsightIcon(insightAtual.type)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{insightAtual.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">
              {getInsightTypeLabel(insightAtual.type)}
            </Badge>
            <Badge
              className={
                insightAtual.relevanceScore >= 8
                  ? "bg-red-100 text-red-800"
                  : insightAtual.relevanceScore >= 6
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }
            >
              Relevância: {insightAtual.relevanceScore.toFixed(1)}/10
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Insight</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{insightAtual.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {insightAtual.impactValue && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Impacto Potencial
                      </p>
                      <p className="font-bold text-green-600">
                        {formatarMoeda(insightAtual.impactValue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data de Geração
                    </p>
                    <p className="font-medium">
                      {format(
                        new Date(insightAtual.createdAt),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {insightAtual.categories && insightAtual.categories.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-medium">Categorias Relacionadas</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {insightAtual.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
