"use client";

// Component for displaying AI financial recommendation for a transaction
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecomendacaoTransacao } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ThumbsUp, ChevronUp, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface TransactionRecommendationProps {
  recommendation: RecomendacaoTransacao;
  onDismiss?: () => void;
}

export function TransactionRecommendation({
  recommendation,
  onDismiss,
}: TransactionRecommendationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to determine badge color based on relevance score
  const getRelevanceBadgeStyle = (score: number) => {
    if (score >= 8) return "bg-red-100 text-red-800";
    if (score >= 6) return "bg-amber-100 text-amber-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card className="relative">
      {/* Close button */}
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-full">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <Badge
            className={getRelevanceBadgeStyle(
              recommendation.pontuacao_relevancia
            )}
          >
            Relevância: {recommendation.pontuacao_relevancia.toFixed(1)}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{recommendation.titulo}</CardTitle>
        <CardDescription>
          Recomendação baseada nos seus padrões de gastos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm">{recommendation.recomendacao}</p>

        {recommendation.dica_economia && (
          <div
            className={`transition-all duration-300 ${
              isExpanded ? "max-h-40" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
              <div className="flex items-start gap-2">
                <ThumbsUp className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-green-700">
                    Dica de economia
                  </p>
                  <p className="text-sm text-green-800">
                    {recommendation.dica_economia}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {recommendation.dica_economia && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground w-full text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Ver dica de economia
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
