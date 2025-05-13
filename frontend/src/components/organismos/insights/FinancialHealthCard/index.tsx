"use client";

// Component for displaying financial health score and analysis
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { SaudeFinanceira } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FinancialHealthCardProps {
  healthData: SaudeFinanceira;
  onViewMoreClick?: () => void;
}

export function FinancialHealthCard({
  healthData,
  onViewMoreClick,
}: FinancialHealthCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Helper to determine the color based on health score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Helper to determine progress bar color based on health score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  // Helper to get icon for evaluation area
  const getAreaIcon = (score: number) => {
    if (score >= 80) return <Check className="w-4 h-4 text-green-600" />;
    if (score >= 60)
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Saúde Financeira</span>
          <div
            className={`text-2xl font-bold ${getScoreColor(
              healthData.pontuacao_saude
            )}`}
          >
            {healthData.pontuacao_saude}/100
          </div>
        </CardTitle>
        <CardDescription>
          Avaliação da sua saúde financeira baseada em dados e comportamentos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Overall score progress bar */}
        <div className="space-y-2">
          <Progress
            value={healthData.pontuacao_saude}
            className="h-2"
            indicatorClassName={getProgressColor(healthData.pontuacao_saude)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        <p className="text-sm">{healthData.resumo}</p>

        {/* Expanded section with detailed evaluation areas */}
        <div
          className={`transition-all duration-300 ${
            expanded ? "max-h-96" : "max-h-0 overflow-hidden"
          }`}
        >
          <Accordion type="single" collapsible className="mt-4">
            {healthData.avaliacoes.map((avaliacao, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="py-2">
                  <div className="flex items-center gap-2">
                    {getAreaIcon(avaliacao.pontuacao)}
                    <span>{avaliacao.area}</span>
                    <span
                      className={`text-sm ${getScoreColor(
                        avaliacao.pontuacao
                      )}`}
                    >
                      {avaliacao.pontuacao}/100
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 py-1">
                    <p className="text-sm">{avaliacao.analise}</p>

                    {avaliacao.recomendacoes &&
                      avaliacao.recomendacoes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Recomendações:</p>
                          <ul className="pl-5 text-sm space-y-1">
                            {avaliacao.recomendacoes.map((rec, i) => (
                              <li
                                key={i}
                                className="list-disc text-muted-foreground"
                              >
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {healthData.acoes_recomendadas &&
            healthData.acoes_recomendadas.length > 0 && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <p className="font-medium text-sm">Ações recomendadas</p>
                </div>

                <ul className="pl-5 text-sm space-y-1">
                  {healthData.acoes_recomendadas.map((acao, i) => (
                    <li key={i} className="list-disc text-muted-foreground">
                      {acao}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Mais detalhes
            </>
          )}
        </Button>

        {onViewMoreClick && (
          <Button
            variant="default"
            size="sm"
            className="text-xs flex-1"
            onClick={onViewMoreClick}
          >
            Ver relatório completo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
